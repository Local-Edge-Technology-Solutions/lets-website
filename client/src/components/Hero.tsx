import { useRef, useState } from 'react';
import benHeadshotImg from '@assets/ben-headshot_1762803470298.jpg';
import { handoffs } from '@/content';

export default function Hero() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // W3C tabs pattern: arrows move between tabs, Home/End jump to the ends.
  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = handoffs.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <span>Tell us what you need.</span> <span>We'll build it.</span>
          </h1>
          <p className="hero__lede">We build custom automations and AI tools for small businesses.</p>
          <p className="hero__people">
            We're Ben and Zeke, near Nashville. Work with us anywhere by phone or video.
          </p>
          <div className="hero__actions">
            <a className="button" href="#contact">Tell us what you need</a>
          </div>
        </div>

        <figure className="handoff" aria-labelledby="handoff-caption">
          <figcaption id="handoff-caption" className="handoff__caption">
            An example of what we could build, with made-up details.
          </figcaption>

          {handoffs.map((h, i) => (
            <div
              key={h.id}
              id={`handoff-panel-${h.id}`}
              className="handoff__panel"
              role="tabpanel"
              aria-labelledby={`handoff-tab-${h.id}`}
              hidden={i !== selected}
            >
              <blockquote className="handoff__ask">
                <span className="handoff__who">A business owner tells us</span>
                <q>{h.ask}</q>
              </blockquote>

              <div className="handoff__route">
                <div className="handoff__team">
                  <span className="handoff__faces" aria-hidden="true">
                    <img className="face" src={benHeadshotImg} alt="" width={52} height={52} />
                    <span className="face face--missing">Z</span>
                  </span>
                  <p className="handoff__team-text">
                    Ben and Zeke build it
                    <span>and check it with you before it goes live</span>
                  </p>
                </div>
              </div>

              <div className="handoff__result">
                <h3>{h.resultTitle}</h3>
                <dl>
                  {h.rows.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}

          <div className="handoff__tabs js-only" role="tablist" aria-label="Examples">
            {handoffs.map((h, i) => (
              <button
                key={h.id}
                ref={(el) => (tabRefs.current[i] = el)}
                id={`handoff-tab-${h.id}`}
                type="button"
                role="tab"
                className="handoff__tab"
                aria-selected={i === selected}
                aria-controls={`handoff-panel-${h.id}`}
                tabIndex={i === selected ? 0 : -1}
                onClick={() => setSelected(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {h.tab}
              </button>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
}
