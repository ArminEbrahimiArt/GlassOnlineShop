/**
 * Global UI behaviour that every page needs: header state, menu dialog,
 * scroll reveals, newsletter. Component-specific behaviour lives in a
 * <script> inside that component.
 */

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const announce = document.querySelector<HTMLElement>('[data-announce]')?.offsetHeight ?? 0;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > announce + 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMenu() {
  const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
  if (!menu) return;
  document.querySelectorAll('[data-menu-open]').forEach((b) => b.addEventListener('click', () => menu.showModal()));
  menu.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => menu.close()));
  // Same-page anchors should close the menu.
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.close()));
}

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}

function initNewsletter() {
  document.querySelectorAll<HTMLFormElement>('[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Phase 1: no backend. Phase 3 posts to the mailing service.
      form.querySelector<HTMLElement>('[data-newsletter-thanks]')!.hidden = false;
    });
  });
}

export function initUI() {
  document.documentElement.classList.remove('no-js');
  initHeader();
  initMenu();
  initReveal();
  initNewsletter();
}
