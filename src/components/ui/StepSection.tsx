import type { ReactNode } from 'react';

interface Props {
  step: number;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function StepSection({ step, title, aside, children }: Props) {
  return (
    <section className="step">
      <header className="step__head">
        <span className="step__num">{step}</span>
        <h2 className="step__title">{title}</h2>
        {aside && <span className="step__aside">{aside}</span>}
      </header>
      {children}
    </section>
  );
}
