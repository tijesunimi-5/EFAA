"use client";
import { useUser } from '@/components/context/User';

export default function WelcomeHeader() {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <section className="px-6 pt-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
        Stay calm, {firstName}.<br />
        <span className="text-slate-500 font-medium text-lg">How can EFAA help you?</span>
      </h1>
    </section>
  );
}