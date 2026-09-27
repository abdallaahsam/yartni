import { flushSync } from 'react-dom';

// Opens an advice like a letter: the clicked card morphs into the detail page's card.
// The detail page's card carries the same view-transition-name ("advice-letter"),
// so the browser animates between the two snapshots. See the ::view-transition rules in index.css.
export function openAdvice(navigate, to, advice, cardEl) {
  const state = { advice };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!document.startViewTransition || reduceMotion || !cardEl) {
    navigate(to, { state });
    window.scrollTo(0, 0);
    return;
  }

  // Only the clicked card gets the name; names must be unique in each snapshot
  cardEl.style.viewTransitionName = 'advice-letter';
  document.documentElement.dataset.transition = 'letter';

  const transition = document.startViewTransition(() => {
    flushSync(() => navigate(to, { state }));
    window.scrollTo(0, 0);
  });

  transition.finished.finally(() => {
    cardEl.style.viewTransitionName = '';
    delete document.documentElement.dataset.transition;
  });
}
