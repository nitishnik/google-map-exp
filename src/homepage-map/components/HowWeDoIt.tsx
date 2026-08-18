const STEPS = [
  {
    n: '01',
    q: 'Where should someone like me go?',
    a: 'We recommend countries. A pin is a place we would send you — not a catalogue of everywhere.',
  },
  {
    n: '02',
    q: 'Where in this country do I base myself?',
    a: 'We pick a default city and keep the rest honest. We reorder. We never hide.',
  },
  {
    n: '03',
    q: 'What is actually worth my time here?',
    a: 'At most four attractions, ranked by evidence. Commercial detail starts here.',
  },
  {
    n: '04',
    q: 'Which version of this do I book?',
    a: 'Two or three genuinely different products, each with a material trade-off.',
  },
]

export function HowWeDoIt() {
  return (
    <section className="flex flex-col gap-4">
      <p className="font-[var(--hm-sans)] text-[11px] font-semibold tracking-[0.14em] text-[var(--hm-ink3)] uppercase">
        How we do it
      </p>
      <ol className="grid gap-3 sm:grid-cols-2">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-[var(--hm-hair)] bg-white px-4 py-3.5"
          >
            <p className="font-[var(--hm-sans)] text-[11px] font-bold tracking-[0.12em] text-[var(--hm-ink3)]">
              {step.n}
            </p>
            <p className="mt-1 font-[var(--hm-disp)] text-[17px] leading-snug text-[var(--hm-ink)]">
              {step.q}
            </p>
            <p className="mt-2 font-[var(--hm-sans)] text-xs leading-relaxed text-[var(--hm-ink2)]">
              {step.a}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
