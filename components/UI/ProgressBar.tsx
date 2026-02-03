const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
    <div
      className="h-full bg-teal-600 transition-all duration-700 ease-out"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

export default ProgressBar;