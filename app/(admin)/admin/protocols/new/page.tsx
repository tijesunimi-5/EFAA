"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  GitBranch,
  GripVertical,
  Info,
  Layers,
  Loader2,
  Mic,
  MicOff,
  Monitor,
  Pencil,
  PlusCircle,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Timer,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { useAPI } from "@/components/hook/callApi";
import { useAlert } from "@/components/context/Alert";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES  —  mirror the original model exactly so the backend contract is intact
// ─────────────────────────────────────────────────────────────────────────────

interface Option {
  label: string;
  next: string; // id of the target node, or "" if unset
}

interface Step {
  text: string;
  voice: string;
  autoNext: number; // seconds
}

interface QuestionNode {
  id: string;
  type: "question";
  title: string;
  text: string;
  options: Option[];
}

interface GuideNode {
  id: string;
  type: "guide";
  title: string;
  steps: Step[];
  text?: string;
}

type ProtocolNode = QuestionNode | GuideNode;

/** Keyed by node id — matches the backend's `nodes` column format */
interface ProtocolNodes {
  [key: string]: ProtocolNode;
}

/** Shape returned by POST /protocols/extract */
interface ExtractedData {
  title?: string;
  category?: string;
  nodes: Partial<ProtocolNode>[];
  confidence: number; // 0–1
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Trauma",
  "Respiratory",
  "Cardiac",
  "Environmental",
  "Cardiac Emergency",
  "Neurological Emergency",
  "Toxicology & Poisoning",
  "Obstetric Emergency",
  "Paediatric Emergency",
  "Burns & Environmental",
  "Mental Health Crisis",
  "Mass Casualty Incident",
  "Other",
];

const makeId = () =>
  `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

const emptyStep = (): Step => ({ text: "", voice: "", autoNext: 30 });

const emptyQuestion = (id: string, title = "New Assessment"): QuestionNode => ({
  id,
  type: "question",
  title,
  text: "",
  options: [
    { label: "Yes", next: "" },
    { label: "No", next: "" },
  ],
});

const emptyGuide = (id: string, title = "New Action Plan"): GuideNode => ({
  id,
  type: "guide",
  title,
  steps: [emptyStep()],
});

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

const confidenceMeta = (c: number) => {
  if (c >= 0.85)
    return {
      label: "High Confidence",
      color: "text-emerald-700",
      bar: "bg-emerald-500",
      pill: "bg-emerald-50 border-emerald-200 text-emerald-700",
    };
  if (c >= 0.6)
    return {
      label: "Moderate Confidence",
      color: "text-amber-700",
      bar: "bg-amber-400",
      pill: "bg-amber-50 border-amber-200 text-amber-700",
    };
  return {
    label: "Low Confidence",
    color: "text-red-700",
    bar: "bg-red-400",
    pill: "bg-red-50 border-red-200 text-red-700",
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// StepRow  —  single step inside a GuideNode
// ─────────────────────────────────────────────────────────────────────────────

const StepRow: React.FC<{
  step: Step;
  index: number;
  onChange: (s: Step) => void;
  onDelete: () => void;
}> = ({ step, index, onChange, onDelete }) => {
  const [showTimer, setShowTimer] = useState(step.autoNext > 0);
  const [showVoice, setShowVoice] = useState(!!step.voice);

  return (
    <div className="group flex gap-2 items-start p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
      {/* Drag handle (visual only) */}
      <GripVertical size={13} className="mt-3 text-slate-300 shrink-0 cursor-grab" />

      {/* Index badge */}
      <span className="mt-2.5 text-xs font-bold text-slate-400 w-5 shrink-0 select-none tabular-nums">
        {index + 1}.
      </span>

      <div className="flex-1 space-y-2">
        {/* Visual instruction */}
        <textarea
          value={step.text}
          onChange={(e) => onChange({ ...step, text: e.target.value })}
          placeholder="Describe this action clearly for the responder…"
          rows={2}
          className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition"
        />

        {/* Voice guidance (expandable) */}
        {showVoice && (
          <textarea
            value={step.voice}
            onChange={(e) => onChange({ ...step, voice: e.target.value })}
            placeholder="Voice script read aloud to the responder (optional)…"
            rows={2}
            className="w-full text-sm italic text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition"
          />
        )}

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice toggle */}
          <button
            onClick={() => {
              if (showVoice) onChange({ ...step, voice: "" });
              setShowVoice(!showVoice);
            }}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${showVoice
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
          >
            {showVoice ? <Mic size={11} /> : <MicOff size={11} />}
            {showVoice ? "Voice On" : "Add Voice"}
          </button>

          {/* Timer toggle */}
          <button
            onClick={() => {
              const next = !showTimer;
              setShowTimer(next);
              onChange({ ...step, autoNext: next ? 30 : 0 });
            }}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${showTimer
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
          >
            <Timer size={11} />
            {showTimer ? "Timer On" : "Add Timer"}
          </button>

          {/* Timer value */}
          {showTimer && (
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-amber-500" />
              <input
                type="number"
                min={5}
                max={3600}
                value={step.autoNext}
                onChange={(e) =>
                  onChange({ ...step, autoNext: parseInt(e.target.value) || 30 })
                }
                className="w-16 text-xs border border-amber-200 rounded px-2 py-0.5 text-amber-800 bg-amber-50 focus:outline-none focus:ring-1 focus:ring-amber-400 tabular-nums"
              />
              <span className="text-xs text-slate-400">sec</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete step */}
      <button
        onClick={onDelete}
        className="mt-2 p-1 rounded text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        title="Remove step"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// OptionRow  —  single branch option inside a QuestionNode
// ─────────────────────────────────────────────────────────────────────────────

const OptionRow: React.FC<{
  option: Option;
  index: number;
  allNodes: ProtocolNodes;
  currentId: string;
  onChange: (o: Option) => void;
}> = ({ option, index, allNodes, currentId, onChange }) => (
  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${index === 0
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
          }`}
      >
        {option.label}
      </span>
      {/* Editable branch label */}
      <input
        value={option.label}
        onChange={(e) => onChange({ ...option, label: e.target.value })}
        className="flex-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
        placeholder="Branch label…"
      />
    </div>
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">Go to node:</label>
      <select
        value={option.next}
        onChange={(e) => onChange({ ...option, next: e.target.value })}
        className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer appearance-none"
      >
        <option value="">— Select next node —</option>
        {Object.values(allNodes)
          .filter((n) => n.id !== currentId)
          .map((n) => (
            <option key={n.id} value={n.id}>
              {n.title}
            </option>
          ))}
      </select>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// QuestionNodeCard
// ─────────────────────────────────────────────────────────────────────────────

const QuestionNodeCard: React.FC<{
  node: QuestionNode;
  allNodes: ProtocolNodes;
  isStart: boolean;
  onChange: (n: QuestionNode) => void;
  onDelete: () => void;
}> = ({ node, allNodes, isStart, onChange, onDelete }) => {
  const [collapsed, setCollapsed] = useState(false);

  const updateOption = (i: number, opt: Option) => {
    const options = [...node.options];
    options[i] = opt;
    onChange({ ...node, options });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 shrink-0">
          <GitBranch size={14} className="text-white" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 shrink-0">
          Decision Point
        </span>
        {isStart && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">
            START
          </span>
        )}

        {/* Editable title */}
        <input
          value={node.title}
          onChange={(e) => onChange({ ...node, title: e.target.value })}
          className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-none focus:outline-none min-w-0 placeholder:text-slate-400"
          placeholder="Node title…"
        />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-blue-400 hover:text-blue-700 hover:bg-blue-100 transition-colors"
          >
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          {!isStart && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="p-5 space-y-4">
          {/* Diagnostic question */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Diagnostic Question
            </label>
            <textarea
              value={node.text}
              onChange={(e) => onChange({ ...node, text: e.target.value })}
              placeholder="What should the responder assess or check?"
              rows={2}
              className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition"
            />
          </div>

          {/* Branch options */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Branch Options
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {node.options.map((opt, i) => (
                <OptionRow
                  key={i}
                  option={opt}
                  index={i}
                  allNodes={allNodes}
                  currentId={node.id}
                  onChange={(o) => updateOption(i, o)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GuideNodeCard
// ─────────────────────────────────────────────────────────────────────────────

const GuideNodeCard: React.FC<{
  node: GuideNode;
  onChange: (n: GuideNode) => void;
  onDelete: () => void;
}> = ({ node, onChange, onDelete }) => {
  const [collapsed, setCollapsed] = useState(false);

  const updateStep = (i: number, s: Step) => {
    const steps = [...node.steps];
    steps[i] = s;
    onChange({ ...node, steps });
  };

  const addStep = () => onChange({ ...node, steps: [...node.steps, emptyStep()] });

  const deleteStep = (i: number) =>
    onChange({ ...node, steps: node.steps.filter((_, idx) => idx !== i) });

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 shrink-0">
          <BookOpen size={14} className="text-white" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 shrink-0">
          Guide Section
        </span>

        <input
          value={node.title}
          onChange={(e) => onChange({ ...node, title: e.target.value })}
          className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-none focus:outline-none min-w-0 placeholder:text-slate-400"
          placeholder="Node title…"
        />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="Delete node"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-1">
          {node.steps.map((step, i) => (
            <StepRow
              key={i}
              step={step}
              index={i}
              onChange={(s) => updateStep(i, s)}
              onDelete={() => deleteStep(i)}
            />
          ))}
          <button
            onClick={addStep}
            className="mt-2 flex items-center gap-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors w-full"
          >
            <PlusCircle size={13} />
            Add Step
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AIImportPanel  —  integrates POST /protocols/extract
// ─────────────────────────────────────────────────────────────────────────────

const AIImportPanel: React.FC<{
  onApply: (data: ExtractedData) => void;
}> = ({ onApply }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {showAlert} = useAlert();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStatus("idle");
    setExtracted(null);
  };

  const handleExtract = async () => {
    if (!file) return;
    setStatus("loading");

    try {
      const fd = new FormData();
      // The backend middleware looks for 'protocol' (upload.single('protocol'))
      fd.append("protocol", file);

      const res = await fetch("https://efaa-backend.onrender.com/extract", {
        method: "POST",
        body: fd
        // Note: Do NOT set Content-Type header; the browser does it for FormData
      });

      const result = await res.json();

      if (result.success) {
        setExtracted(result.data); // The backend wraps data in a 'data' object
        setStatus("success");
        setPreviewOpen(true);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Extraction Error:", err);
      setStatus("error");
      showAlert("AI Extraction failed: " + (err as Error).message, "error");
    }
  };

  const conf = extracted ? confidenceMeta(extracted.confidence) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <Sparkles size={15} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">AI-Assisted Import</h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">
            Upload a document — AI extracts and structures it for your review.
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Disclaimer */}
        <div className="flex gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            AI extraction is a{" "}
            <strong className="text-slate-700">first-draft aid only</strong>. All
            extracted content must be reviewed by a qualified clinician before use.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl px-4 py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
            <Upload size={16} className="text-slate-400 group-hover:text-violet-500 transition-colors" />
          </div>
          {file ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB · Click to replace
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">
                Drop your document here
              </p>
              <p className="text-xs text-slate-400 mt-0.5">PDF, DOCX, or TXT</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Extract button */}
        {file && status !== "success" && (
          <button
            onClick={handleExtract}
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Extracting…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Extract with AI
              </>
            )}
          </button>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">
              Extraction failed. Check the file format and try again.
            </p>
          </div>
        )}

        {/* Success */}
        {status === "success" && extracted && conf && (
          <div className="space-y-2.5">
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${conf.pill}`}>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className={conf.color} />
                <span className={`text-xs font-semibold ${conf.color}`}>{conf.label}</span>
              </div>
              <span className={`text-xs font-bold tabular-nums ${conf.color}`}>
                {Math.round(extracted.confidence * 100)}%
              </span>
            </div>

            {/* Confidence bar */}
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${conf.bar}`}
                style={{ width: `${extracted.confidence * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-500">
              {extracted.nodes.length} section(s) extracted. Review before applying.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setPreviewOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors"
              >
                <Eye size={12} />
                Preview
              </button>
              <button
                onClick={() => {
                  onApply(extracted);
                  setStatus("idle");
                  setFile(null);
                  setExtracted(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                <Layers size={12} />
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Extracted preview modal ───────────────────────────────────────── */}
      {previewOpen && extracted && conf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-slate-900">Extracted Preview</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI-generated draft — verify all clinical details before applying.
                </p>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {extracted.title && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Title</p>
                  <p className="text-sm font-semibold text-slate-900">{extracted.title}</p>
                </div>
              )}
              {extracted.nodes.map((node, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${node.type === "question"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                      {node.type === "question" ? "Decision Point" : "Guide Section"}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {node.title}
                    </span>
                  </div>
                  {"steps" in node && node.steps?.map((step, j) => (
                    <div
                      key={j}
                      className="flex gap-2 text-xs text-slate-600 py-1.5 border-t border-slate-100"
                    >
                      <span className="text-slate-400 shrink-0 tabular-nums">{j + 1}.</span>
                      <span>{step.text}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onApply(extracted);
                  setPreviewOpen(false);
                  setStatus("idle");
                  setFile(null);
                  setExtracted(null);
                }}
                className="px-5 py-2 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Apply to Builder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// NodeReference  —  sidebar quick-reference card
// ─────────────────────────────────────────────────────────────────────────────

const NodeReference: React.FC = () => (
  <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
      <Info size={14} className="text-slate-400" />
      Node Types
    </h3>
    <div className="space-y-2">
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-100">
        <GitBranch size={13} className="text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-blue-800">Decision Point</p>
          <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
            Use when responders must choose between two or more paths based on patient
            condition or assessment finding.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
        <BookOpen size={13} className="text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-emerald-800">Guide Section</p>
          <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
            Use for sequential instructions without branching — drug administration,
            monitoring steps, stabilisation.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PublishModal  —  gated review confirmation
// ─────────────────────────────────────────────────────────────────────────────

const PublishModal: React.FC<{
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, onConfirm, onCancel }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-amber-50 border-b border-amber-200 flex items-start gap-4">
          <div className="mt-0.5 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Before You Publish</h3>
            <p className="text-sm text-slate-600 mt-1">
              This protocol will be available to all emergency responders. Please
              confirm each requirement below.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="px-6 py-5 space-y-2.5">
          {[
            "All steps reviewed by a qualified clinician",
            "Medical accuracy verified against current guidelines",
            "Timers and voice cues are appropriate for the emergency context",
            "Protocol tested in a simulation or tabletop exercise",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="mt-0.5 text-emerald-500 shrink-0" />
              <p className="text-sm text-slate-700">{item}</p>
            </div>
          ))}

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-3 mt-4 p-3.5 rounded-xl border border-amber-200 bg-amber-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-amber-600"
            />
            <span className="text-sm font-medium text-amber-800">
              I confirm a licensed medical professional has reviewed and approved{" "}
              <span className="italic">&quot;{title || "this protocol"}&quot;</span>.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!checked}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <ShieldCheck size={14} />
            Publish Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ClinicalGuidance  —  collapsible authoring guide at the bottom
// ─────────────────────────────────────────────────────────────────────────────

const ClinicalGuidance: React.FC = () => {
  const [open, setOpen] = useState(false);

  const sections = [
    {
      icon: <Pencil size={15} className="text-blue-600" />,
      title: "Writing Emergency Steps",
      border: "border-blue-100",
      items: [
        "Use imperative, action-first language: 'Administer 300mg aspirin orally.'",
        "One action per step — never combine two interventions.",
        "Specify dosage, route, and timing explicitly for every medication step.",
        "Avoid abbreviations unless universally understood in your clinical context.",
        "Write at a level a trained first responder can execute under stress.",
      ],
    },
    {
      icon: <Layers size={15} className="text-emerald-600" />,
      title: "Structuring Protocols",
      border: "border-emerald-100",
      items: [
        "Begin with an Assessment node to establish baseline before any intervention.",
        "Group related actions into Guide nodes (e.g. Drug Administration).",
        "Use Decision Points only for genuine binary or branching clinical decisions.",
        "Place contraindication checks before any high-risk drug or procedure step.",
        "End every protocol with a Handover or Transfer node.",
      ],
    },
    {
      icon: <Shield size={15} className="text-amber-600" />,
      title: "Medical Safety Reminders",
      border: "border-amber-100",
      items: [
        "Reference the evidence base (e.g. AHA 2020 Guidelines) in each protocol.",
        "Include contraindication checks before any high-risk step.",
        "Paediatric protocols must include weight-based dosing calculations.",
        "Never overwrite — create a new revision and maintain version history.",
        "Set a mandatory review date. Guidelines change; your protocol must too.",
      ],
    },
    {
      icon: <ShieldCheck size={15} className="text-red-600" />,
      title: "Human Review is Mandatory",
      border: "border-red-100",
      items: [
        "No protocol should be published without sign-off from a licensed clinician.",
        "AI-assisted extraction is a drafting aid only — never a clinical authority.",
        "Review every step against the latest national or international guidelines.",
        "Document who reviewed the protocol, when, and under which version.",
        "Publishing without clinical review could directly harm patients.",
      ],
    },
  ];

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
          <BookOpen size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">Clinical Authoring Guide</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Writing standards, structure best practices, and safety reminders.
          </p>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-slate-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 p-5">
          {/* Critical banner */}
          <div className="mb-5 flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertTriangle size={17} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Every protocol in EFAA is used in real emergency situations.
              </p>
              <p className="text-sm text-red-700 mt-1">
                Errors in protocol design can directly impact patient outcomes. Human
                clinical review is not optional — it is a mandatory step before any
                protocol is published.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {sections.map((s, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border bg-white ${s.border} space-y-3`}
              >
                <div className="flex items-center gap-2">
                  {s.icon}
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {s.title}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ProtocolCreator  —  root page component
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_NODES: ProtocolNodes = {
  start: {
    id: "start",
    type: "question",
    title: "Initial Assessment",
    text: "",
    options: [
      { label: "Yes", next: "" },
      { label: "No", next: "" },
    ],
  },
};

export default function ProtocolCreator() {
  const { callApi } = useAPI();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Trauma");
  const [nodes, setNodes] = useState<ProtocolNodes>(INITIAL_NODES);
  const [showPublish, setShowPublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Node operations ──────────────────────────────────────────────────────

  const addNode = (type: "question" | "guide") => {
    const id = makeId();
    setNodes((prev) => ({
      ...prev,
      [id]: type === "question" ? emptyQuestion(id) : emptyGuide(id),
    }));
  };

  const removeNode = (id: string) => {
    if (id === "start")
      return showAlert("Cannot remove the starting assessment node.", "error");
    setNodes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateNode = useCallback((id: string, updated: ProtocolNode) => {
    setNodes((prev) => ({ ...prev, [id]: updated }));
  }, []);

  // ── AI extraction apply ──────────────────────────────────────────────────

  /**
   * Maps extracted data back into the original ProtocolNodes keyed format
   * so the backend receives exactly the same shape as before.
   */
  const applyExtracted = (data: ExtractedData) => {
    if (data.title) setTitle(data.title);
    if (data.category) setCategory(data.category);

    const newNodes: ProtocolNodes = {};

    // 1. First, map all AI nodes into our format using the IDs provided by AI
    data.nodes.forEach((n) => {
      // Fallback to makeId if AI failed to provide a unique ID
      const id = n.id || makeId();

      if (n.type === "guide") {
        newNodes[id] = {
          id,
          type: "guide",
          title: n.title ?? "Extracted Section",
          steps: Array.isArray(n.steps) ? n.steps : [emptyStep()]
        };
      } else {
        const question = n as Partial<QuestionNode>;
        newNodes[id] = {
          id,
          type: "question",
          title: question.title ?? "Extracted Assessment",
          text: question.text ?? "",
          options: Array.isArray(question.options) ? question.options : [
            { label: "Yes", next: "" },
            { label: "No", next: "" },
          ],
        };
      }
    });

    // 2. Merge with existing nodes
    setNodes((prev) => ({ ...prev, ...newNodes }));
    showAlert(`Extracted ${data.nodes.length} nodes successfully.`, "success");
  };

  // ── Save (POST /protocols) ───────────────────────────────────────────────

  const handleSave = async () => {
    if (!title.trim())
      return showAlert("Please enter a name for this protocol.", "error");

    setSaving(true);
    const slug = title.toLowerCase().trim().replace(/\s+/g, "-");
    const res = await callApi("/protocols", "POST", { slug, title, category, nodes });
    setSaving(false);

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      showAlert("Protocol saved successfully.", "success");
    } else {
      showAlert("Save failed. Check your connection and try again.", "error");
    }
  };

  // ── Publish (save + status update) ──────────────────────────────────────

  const handlePublish = async () => {
    setShowPublish(false);
    await handleSave();
    showAlert("Protocol published and live for responders.", "success");
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const nodeList = Object.values(nodes);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">

      {/* ════════════════════════════════════════════════════════════════════
          STICKY TOP BAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center">
              <Monitor size={14} className="text-white" />
            </div>
            <div className="leading-none">
              <p className="text-xs font-black tracking-widest text-red-600 uppercase">EFAA</p>
              <p className="text-xs text-slate-400">Protocol Builder</p>
            </div>
          </div>

          {/* Node count pill */}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <FileText size={11} />
            {nodeList.length} node{nodeList.length !== 1 ? "s" : ""}
          </span>

          {/* Save + publish */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <Save size={14} />
              )}
              {saveSuccess ? "Saved!" : "Save Draft"}
            </button>

            <button
              onClick={() => setShowPublish(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <ShieldCheck size={14} />
              Publish
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE BODY
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Empty-state banner */}
        {nodeList.length === 0 && (
          <div className="mb-6 flex gap-3 items-start p-4 rounded-xl border border-amber-200 bg-amber-50">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              No nodes yet. Add a Decision Point or Guide Section below, or import
              from an existing document using AI Import.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ── LEFT: builder canvas ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* ── Protocol metadata ─────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} className="text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700">Protocol Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Emergency Condition Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Adult Cardiac Arrest — Out of Hospital"
                    className="w-full text-base font-semibold text-slate-900 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:font-normal placeholder:text-slate-400 transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Workflow nodes ─────────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Workflow Nodes
                </h2>
                <span className="text-xs text-slate-400">
                  {nodeList.length} node{nodeList.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {nodeList.map((node) =>
                  node.type === "question" ? (
                    <QuestionNodeCard
                      key={node.id}
                      node={node}
                      allNodes={nodes}
                      isStart={node.id === "start"}
                      onChange={(n) => updateNode(node.id, n)}
                      onDelete={() => removeNode(node.id)}
                    />
                  ) : (
                    <GuideNodeCard
                      key={node.id}
                      node={node}
                      onChange={(n) => updateNode(node.id, n)}
                      onDelete={() => removeNode(node.id)}
                    />
                  )
                )}
              </div>

              {/* Add node buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addNode("question")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-semibold"
                >
                  <PlusCircle size={15} />
                  Add Decision Point
                </button>
                <button
                  onClick={() => addNode("guide")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-emerald-200 text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-sm font-semibold"
                >
                  <PlusCircle size={15} />
                  Add Guide Section
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: sidebar ───────────────────────────────────────────── */}
          <aside className="space-y-5 xl:sticky xl:top-20">
            <AIImportPanel onApply={applyExtracted} />
            <NodeReference />
          </aside>
        </div>

        {/* ── Clinical authoring guide (collapsible, bottom) ─────────────── */}
        <ClinicalGuidance />
      </main>

      {/* ── Publish safety modal ──────────────────────────────────────────── */}
      {showPublish && (
        <PublishModal
          title={title}
          onConfirm={handlePublish}
          onCancel={() => setShowPublish(false)}
        />
      )}
    </div>
  );
}