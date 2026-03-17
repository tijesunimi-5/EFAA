export default function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-teal-700 uppercase">Progress</span>
        <span className="text-[10px] font-black text-slate-400">{current}/{total}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-600 transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}