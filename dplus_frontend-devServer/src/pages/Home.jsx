import React from 'react';
import { Activity, Layers3, Map, ShieldCheck } from 'lucide-react';

const cards = [
  {
    title: 'Portal Status',
    value: 'Ready',
    tone: 'from-[#F26522]/20 to-[#F26522]/5',
    icon: Activity,
  },
  {
    title: 'GIS Engine',
    value: 'Connected',
    tone: 'from-sky-500/20 to-sky-500/5',
    icon: Map,
  },
  {
    title: 'Layer Controls',
    value: 'Synced',
    tone: 'from-violet-500/20 to-violet-500/5',
    icon: Layers3,
  },
  {
    title: 'Access State',
    value: 'Authenticated',
    tone: 'from-emerald-500/20 to-emerald-500/5',
    icon: ShieldCheck,
  },
];

const Home = () => {
  return (
    <div className="min-h-full bg-[#f3eee6] px-6 py-6">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-[#10214d]/10 bg-[linear-gradient(135deg,#09001A_0%,#0B143D_48%,#0A1830_100%)] px-8 py-8 text-white shadow-[0_18px_60px_rgba(9,0,26,0.18)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#F26522]">Dashboard</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[680px]">
              <h1 className="text-4xl font-black tracking-[0.02em] text-white">
                Welcome to DataPlus
              </h1>
              <p className="mt-3 max-w-[620px] text-sm leading-7 text-white/68">
                Local React + Vite shell is active and ready for UI migration. Use this dashboard as the stable landing page while the
                rest of the portal is being aligned to the Datayog design system.
              </p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/45">Current View</p>
              <p className="mt-2 text-base font-semibold text-white">Home Overview</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ title, value, tone, icon: Icon }) => (
            <article
              key={title}
              className={`rounded-[24px] border border-[#10214d]/10 bg-white px-5 py-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]`}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}>
                <Icon className="h-6 w-6 text-[#0f214d]" />
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.26em] text-[#7b8194]">{title}</p>
              <p className="mt-3 text-2xl font-black tracking-[0.02em] text-[#101828]">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <article className="rounded-[26px] border border-[#10214d]/10 bg-white px-6 py-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F26522]">Workspace</p>
            <h2 className="mt-3 text-2xl font-black tracking-[0.02em] text-[#111827]">Migration Staging Area</h2>
            <p className="mt-3 max-w-[760px] text-sm leading-7 text-[#475467]">
              Header and sidebar are being aligned to the Datayog reference. This page is intentionally lightweight so the post-login
              route stays stable while the rest of the portal is ported feature by feature.
            </p>
          </article>

          <article className="rounded-[26px] border border-[#10214d]/10 bg-white px-6 py-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F26522]">Next Focus</p>
            <div className="mt-4 space-y-3 text-sm text-[#344054]">
              <div className="rounded-2xl border border-[#10214d]/10 bg-[#f8fafc] px-4 py-3">Login and portal shell are active.</div>
              <div className="rounded-2xl border border-[#10214d]/10 bg-[#f8fafc] px-4 py-3">Next step can continue with exact Datayog page-by-page porting.</div>
              <div className="rounded-2xl border border-[#10214d]/10 bg-[#f8fafc] px-4 py-3">Backend remains on the server; frontend stays local for UI work.</div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default Home;
