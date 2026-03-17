import { Lightbulb, Activity } from 'lucide-react';
import Card from '@/components/UI/Card';

export default function HealthNudge() {
  const nudge = {
    tip: "Don't restrain seizures.",
    context: "Restraining can cause injury. Clear the area and cushion their head instead."
  };

  return (
    <section className="px-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Health Nudge</h3>
      </div>
      <Card className="bg-gradient-to-br from-teal-50 to-white border-none shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-5">
          <Activity className="w-32 h-32 text-teal-900" />
        </div>
        <p className="text-teal-900 font-bold text-lg mb-2 relative z-10">{nudge.tip}</p>
        <p className="text-teal-700/80 text-sm leading-relaxed relative z-10">{nudge.context}</p>
      </Card>
    </section>
  );
}