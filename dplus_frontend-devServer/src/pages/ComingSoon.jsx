import React from 'react';

/**
 * Matches datayog Next.js `components/module-workspace.js` coming-soon view (lines 299–313).
 * Outer gradient wrapper: dy3 Layout uses light default bg; Next workspace uses dark shell.
 */
export default function ComingSoon() {
  return (
    <div className="min-h-[calc(100vh-78px)] w-full bg-[linear-gradient(180deg,#09001A_0%,#0A1240_38%,#071224_100%)]">
      <div className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-transparent p-4 text-white sm:p-6 lg:p-8">
        <div className="relative flex min-h-[min(420px,70vh)] w-full max-w-4xl items-center justify-center overflow-hidden sm:min-h-[420px]">
          <div className="absolute h-40 w-40 rounded-full bg-[#F26522]/10 blur-3xl animate-pulse sm:h-56 sm:w-56" />
          <div className="absolute h-52 w-52 rounded-full border border-[#F26522]/15 animate-[spin_18s_linear_infinite] sm:h-72 sm:w-72" />
          <div className="absolute h-72 w-72 rounded-full border border-cyan-400/10 animate-[spin_28s_linear_infinite_reverse] sm:h-96 sm:w-96" />
          <div className="relative rounded-full border border-[#F26522]/30 bg-[#F26522]/10 px-6 py-3 text-center shadow-[0_0_40px_rgba(242,101,34,0.12)] sm:px-8 sm:py-4">
            <span className="bg-[linear-gradient(90deg,#f8fafc_0%,#F26522_45%,#f8fafc_100%)] bg-[length:200%_100%] bg-clip-text text-base font-extrabold uppercase tracking-[0.35em] text-transparent animate-[pulse_2.2s_ease-in-out_infinite] sm:text-lg sm:tracking-[0.45em] md:text-2xl">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
