const questSteps = [
  'Understand the mission.',
  'Follow the official channels.',
  'Watch the registry and public surface.',
  'Prepare for future operator participation.',
];

const publicLinks = [
  {
    label: 'Open asatcoin.com',
    href: 'https://asatcoin.com',
    primary: true,
  },
  {
    label: 'Join Telegram',
    href: 'https://t.me/ASATcoin',
    primary: false,
  },
  {
    label: 'Follow @ASATcoin',
    href: 'https://x.com/ASATcoin',
    primary: false,
  },
];

export default function Page() {
  return (
    <main className="page-shell">
      <div className="grid-background" />

      <section className="hero">
        <div className="eyebrow">ASAT PUBLIC QUEST</div>

        <h1>
          The reserve and coordination unit
          <br />
          for the autonomous economy.
        </h1>

        <p className="hero-copy">
          This public repo is now intentionally minimal. It is a public-safe
          quest surface only — not the private product engine, not the registry
          internals, and not the reward infrastructure.
        </p>

        <div className="cta-row">
          {publicLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={link.primary ? 'button button-primary' : 'button'}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-label">MISSION</div>
        <h2>ASAT is not just a token.</h2>
        <p>
          ASAT is being built as a machine-native coordination and settlement
          layer around registry, task coordination, proof-of-task, reward flows,
          human + AI work, and future agent participation.
        </p>
      </section>

      <section className="panel">
        <div className="panel-label">QUEST</div>
        <h2>Public path from here</h2>

        <div className="quest-list">
          {questSteps.map((step, index) => (
            <div key={step} className="quest-item">
              <div className="quest-index">{index + 1}</div>
              <div className="quest-text">{step}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-label">PUBLIC NOTICE</div>
        <h2>Why this repo is minimal now</h2>
        <p>
          The real ASAT build continues privately. This public surface exists to
          share mission, links, and public direction without exposing internal
          product logic, private architecture, or reward systems.
        </p>
      </section>

      <footer className="footer">
        <div>ASAT</div>
        <div>Reserve • Coordination • Task Economy</div>
      </footer>
    </main>
  );
}
