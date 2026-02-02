"use client"

import { ReactNode } from "react";

const Section = ({ children, className = "", id = "" }: { children: ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`px-6 py-16 md:py-24 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

export default Section;