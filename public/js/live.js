// Renders the parts of the login page that legitimately change between loads:
// a ticking clock, market figures, a rotating testimonial, and per-session ids.
// These are intentionally unstable so visual runs surface them as differences.

const set = (name, value) => {
  document.querySelectorAll(`[data-live="${name}"]`).forEach((node) => {
    node.textContent = value;
  });
};

const randomBetween = (min, max) => min + Math.random() * (max - min);

const TESTIMONIALS = [
  {
    quote: 'The portal gives our family office a single, trustworthy view of every account.',
    author: 'Amara Okafor',
    role: 'Principal, Okafor Holdings',
  },
  {
    quote: 'Settlement visibility used to take days. Now it is simply always there.',
    author: 'Daniel Reyes',
    role: 'CFO, Northwind Logistics',
  },
  {
    quote: 'Onboarding our trustees took an afternoon instead of a quarter.',
    author: 'Priya Raghunathan',
    role: 'Director, Meridian Trust',
  },
  {
    quote: 'The clearest banking interface my team has worked with in a decade.',
    author: 'Tobias Lindqvist',
    role: 'Head of Treasury, Kestrel Group',
  },
];

const renderClock = () => {
  set(
    'clock',
    new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }),
  );
};

const renderTicker = () => {
  const quotes = [
    { name: 'ticker-spx', base: 5460 },
    { name: 'ticker-ndx', base: 17820 },
    { name: 'ticker-gold', base: 2390 },
  ];

  for (const { name, base } of quotes) {
    const price = base * randomBetween(0.985, 1.015);
    const change = randomBetween(-1.4, 1.6);
    const node = document.querySelector(`[data-live="${name}"]`);
    if (!node) continue;

    node.textContent = `${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}  ${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`;
    node.classList.toggle('is-up', change >= 0);
    node.classList.toggle('is-down', change < 0);
  }
};

const renderTestimonial = () => {
  const pick = TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)];
  set('quote-text', `“${pick.quote}”`);
  set('quote-author', pick.author);
  set('quote-role', pick.role);
  set(
    'quote-initials',
    pick.author
      .split(' ')
      .map((part) => part[0])
      .join(''),
  );
};

const renderSessionDetails = () => {
  set('active-sessions', Math.round(randomBetween(840, 1960)).toLocaleString('en-US'));
  set('last-scan', `${Math.round(randomBetween(2, 57))} minutes ago`);

  const reference = Array.from({ length: 3 }, () =>
    Math.floor(randomBetween(0, 0xffff))
      .toString(16)
      .padStart(4, '0'),
  ).join('-');
  set('session-ref', reference.toUpperCase());
};

renderClock();
renderTicker();
renderTestimonial();
renderSessionDetails();

setInterval(renderClock, 1000);
