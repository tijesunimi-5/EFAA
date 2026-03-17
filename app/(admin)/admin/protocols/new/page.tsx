"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Save, HelpCircle, Activity, Clock, Mic, ChevronRight, AlertCircle } from 'lucide-react';
import { useAPI } from '@/components/hook/callApi';
import { useAlert } from '@/components/context/Alert';

/**
 * CLINICAL INTERFACES
 */
interface Option { label: string; next: string; }
interface Step { text: string; voice: string; autoNext: number; }
interface QuestionNode { id: string; type: "question"; title: string; text: string; options: Option[]; }
interface GuideNode { id: string; type: "guide"; title: string; steps: Step[]; }
type Node = QuestionNode | GuideNode;
interface ProtocolNodes { [key: string]: Node; }

export default function ProtocolCreator() {
  const { callApi } = useAPI();
  const { showAlert } = useAlert();
  const [showConfirm, setShowConfirm] = useState(false); // Modal State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Trauma");
  const [nodes, setNodes] = useState<ProtocolNodes>({
    start: {
      id: "start",
      type: "question",
      title: "Initial Assessment",
      text: "",
      options: [{ label: "Yes", next: "" }, { label: "No", next: "" }]
    }
  });

  const addNode = (type: "question" | "guide") => {
    const id = `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newTitle = type === "question" ? "New Assessment" : "New Action Plan";
    if (type === "question") {
      setNodes({ ...nodes, [id]: { id, type, title: newTitle, text: "", options: [{ label: "Yes", next: "" }, { label: "No", next: "" }] } });
    } else {
      setNodes({ ...nodes, [id]: { id, type, title: newTitle, steps: [{ text: "", voice: "", autoNext: 10 }] } });
    }
  };

  const removeNode = (id: string) => {
    if (id === "start") return showAlert("Cannot remove the starting assessment", "error");
    const newNodes = { ...nodes };
    delete newNodes[id];
    setNodes(newNodes);
  };

  const handleSave = async () => {
    if (!title) return showAlert("Please enter a name for this protocol", "error");
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const res = await callApi('/protocols', 'POST', { slug, title, category, nodes });
    if (res.success) showAlert("Medical Protocol Saved!", "success");
    else showAlert("Save failed. Check your connection.", "error");
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="fixed md:left-72 md:right-5 top-0 z-40 bg-slate-50/80 backdrop-blur-md pt-4 pb-6 border-b border-slate-200 mb-10 px-4 -mx-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Emergency Guide</h1>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Clinical Flow Builder</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors">Quit</button>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-teal-900 text-white px-7 py-2 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-teal-900/20"
            >
             Save Guide
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Ready to publish?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              This will update the protocol for all responders in the mesh. Ensure the clinical data is accurate.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleSave} className="w-full py-4 bg-teal-900 text-white rounded-2xl font-black shadow-lg">Yes, Publish Now</button>
              <button onClick={() => setShowConfirm(false)} className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold">Not yet, go back</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-28">
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Emergency Condition Name</label>
          <input className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2rem] text-xl font-bold focus:border-teal-500 text-black outline-none transition-all" placeholder="e.g. Severe Bleeding" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-2">Category</label>
          <select className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2rem] font-bold outline-none appearance-none cursor-pointer text-black" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Trauma</option>
            <option>Respiratory</option>
            <option>Cardiac</option>
            <option>Environmental</option>
          </select>
        </div>
      </div>

      <div className="space-y-12">
        {Object.values(nodes).map((node: Node) => (
          <div key={node.id} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${node.type === 'question' ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                {node.type === 'question' ? <HelpCircle className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
              </div>
              <input
                className="text-2xl text-black  bg-transparent outline-none focus:text-teal-600 w-full"
                value={node.title}
                onChange={(e) => {
                  const updated = { ...nodes };
                  updated[node.id].title = e.target.value;
                  setNodes(updated);
                }}
              />
              <button onClick={() => removeNode(node.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            {node.type === 'question' ? (
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Diagnostic Question</label>
                  <textarea className="w-full p-6 text-black bg-slate-50 border-none rounded-3xl font-bold text-lg focus:ring-2 ring-teal-500/10 outline-none" placeholder="What should the responder check?" value={node.text} onChange={(e) => {
                    const updated = { ...nodes };
                    (updated[node.id] as QuestionNode).text = e.target.value;
                    setNodes(updated);
                  }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {node.options.map((opt: Option, i: number) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">If responder chooses &quot;{opt.label}&quot;:</p>
                      <select
                        className="w-full bg-white p-4 rounded-2xl font-black text-teal-700 border-none shadow-sm outline-none"
                        value={opt.next}
                        onChange={(e) => {
                          const updated = { ...nodes };
                          (updated[node.id] as QuestionNode).options[i].next = e.target.value;
                          setNodes(updated);
                        }}
                      >
                        <option value="">-- Choose next step --</option>
                        {Object.values(nodes).filter(n => n.id !== node.id).map(n => (
                          <option key={n.id} value={n.id}>{n.title}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Instruction Sequence</label>
                {node.steps.map((step: Step, i: number) => (
                  <div key={i} className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><ChevronRight className="w-3 h-3" /> Visual Instruction</label>
                        <input className="w-full bg-white p-4 rounded-2xl outline-none font-bold text-slate-800" placeholder="e.g. Tie a bandage tightly" value={step.text} onChange={(e) => {
                          const updated = { ...nodes };
                          (updated[node.id] as GuideNode).steps[i].text = e.target.value;
                          setNodes(updated);
                        }} />
                      </div>
                      <div className="md:w-32">
                        <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><Clock className="w-3 h-3" /> Timer (s)</label>
                        <input type="number" className="w-full bg-white p-4 rounded-2xl outline-none font-black text-teal-600" value={step.autoNext} onChange={(e) => {
                          const updated = { ...nodes };
                          (updated[node.id] as GuideNode).steps[i].autoNext = parseInt(e.target.value) || 0;
                          setNodes(updated);
                        }} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-2"><Mic className="w-3 h-3" /> Voice Guidance Script</label>
                      <textarea className="w-full bg-white p-4 rounded-2xl outline-none font-bold text-slate-600 text-sm italic" placeholder="Read this out loud for the responder..." value={step.voice} onChange={(e) => {
                        const updated = { ...nodes };
                        (updated[node.id] as GuideNode).steps[i].voice = e.target.value;
                        setNodes(updated);
                      }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => {
                  const updated = { ...nodes };
                  const target = updated[node.id] as GuideNode;
                  target.steps.push({ text: "", voice: "", autoNext: 10 });
                  setNodes(updated);
                }} className="w-full py-5 border-4 border-dotted border-slate-100 rounded-[2.5rem] text-slate-400 font-black hover:border-teal-500 hover:text-teal-600 transition-all flex items-center justify-center gap-3">
                  <Plus className="w-5 h-5" /> Add Another Action Step
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-col md:flex-row gap-6 justify-center py-10">
          <button onClick={() => addNode('question')} className="flex-1 flex items-center justify-center gap-3 py-6 bg-amber-50 rounded-[2.5rem] font-black text-amber-700 hover:bg-amber-100 transition-all border-2 border-amber-100">
            <Plus className="w-6 h-6" /> Add New Assessment
          </button>
          <button onClick={() => addNode('guide')} className="flex-1 flex items-center justify-center gap-3 py-6 bg-teal-50 rounded-[2.5rem] font-black text-teal-700 hover:bg-teal-100 transition-all border-2 border-teal-100">
            <Plus className="w-6 h-6" /> Add New Action Plan
          </button>
        </div>
      </div>
    </div>
  );
}