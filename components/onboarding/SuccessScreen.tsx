'use client'

import { CheckCircle2 } from "lucide-react";
import SButton from "../UI/SButton";

const SuccessScreen = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center animate-in zoom-in-95 duration-500">
    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100/50">
      <CheckCircle2 className="w-12 h-12" />
    </div>
    <h2 className="text-3xl font-bold mb-4">You&apos;re all set!</h2>
    <p className="text-slate-600 mb-10 leading-relaxed">
      EFAA is now ready to assist you. Keep this app accessible on your home screen for quick response.
    </p>
    <SButton onClick={onReset}>
      Go to Dashboard
     </SButton>
   </div>
 );

export default SuccessScreen