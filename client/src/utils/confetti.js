// Lightweight zero-dependency celebration particle burst (replaces 25KB canvas-confetti)
export default function confetti() {
  const colors = ['#0D9488', '#14B8A6', '#059669', '#E5B83B', '#E11D48'];
  const count = 30;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;
    const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
    const y = window.innerHeight * 0.7;

    el.style.cssText = `
      position: fixed; left: ${x}px; top: ${y}px; width: ${size}px; height: ${size}px;
      background-color: ${color}; border-radius: 50%; pointer-events: none; z-index: 9999;
      transition: all 800ms cubic-bezier(0.25, 1, 0.5, 1);
    `;
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 220 + 80;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity - 120;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 850);
  }
}
