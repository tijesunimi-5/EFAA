"use client";
import { AlertCircle, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';

export default function ActionCards() {
  const router = useRouter();

  return (
    <>
      <Card className="border-rose-100 bg-rose-50/30 group">
        <div className="flex items-start gap-4">
          <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-200">
            <AlertCircle className="text-white w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-rose-700 mb-1 tracking-tight">EMERGENCY</h2>
            <p className="text-rose-600/80 text-sm font-medium mb-4 leading-snug">
              Immediate, step-by-step guidance for an ongoing crisis.
            </p>
            <SButton
              variant="emergency"
              className="py-3 text-base shadow-md"
              onClick={() => router.push('/emergency')}
            >
              Start Guidance Now
            </SButton>
          </div>
        </div>
      </Card>

      <Card className="border-teal-100 group">
        <div className="flex items-start gap-4">
          <div className="bg-teal-100 p-3 rounded-2xl">
            <BookOpen className="text-teal-700 w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-teal-800 mb-1 tracking-tight">LEARN & PREPARE</h2>
            <p className="text-slate-500 text-sm mb-4 leading-snug">
              Browse medical guides and sharpen your first aid skills.
            </p>
            <SButton
              variant="secondary"
              className="py-3 text-base"
              onClick={() => router.push("/learn")}
            >
              Browse Library
            </SButton>
          </div>
        </div>
      </Card>
    </>
  );
}