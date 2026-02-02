"use client"

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex gap-2 mb-8 justify-center">
    {[1, 2, 3].map((s) => (
      <div
        key={s}
        className={`h-1.5 rounded-full transition-all duration-500 ${s <= currentStep ? 'w-8 bg-teal-600' : 'w-4 bg-slate-200'
          }`}
      />
    ))}
  </div>
);

export default ProgressIndicator