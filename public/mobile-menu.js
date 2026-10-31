/* PEEK: mobile hamburger menu
   Turns the existing <nav> into a right-side drawer on screens <= 900px.
   (The drawer is the same <nav>, so active-link highlighting and the
   Urdu translation keep working with no extra code.)
   In Urdu / RTL the drawer opens from the left, next to the toggle. */
(() => {
  "use strict";
  const header = document.querySelector("header");
  const nav = header && header.querySelector("nav");
  const actions = header && header.querySelector(".header-actions");
  if (!nav || !actions) return;

  const root = document.documentElement;
  const mq = window.matchMedia("(max-width: 900px)");

  nav.id = nav.id || "site-nav";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-label", "Open menu");
  toggle.setAttribute("aria-controls", nav.id);
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML =
    '<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>';
  actions.appendChild(toggle);

  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  header.insertBefore(backdrop, nav);

  const head = document.createElement("div");
  head.className = "nav-drawer-head";
  head.innerHTML =
    '<button type="button" class="nav-close" aria-label="Close menu">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>';
  nav.insertBefore(head, nav.firstChild);
  const closeBtn = head.querySelector(".nav-close");

  const demo = document.createElement("button");
  demo.type = "button";
  demo.className = "nav-demo";
  demo.innerHTML = "Explore demo <span>↗</span>";
  demo.addEventListener("click", () => {
    close(false);
    if (typeof window.startDemo === "function") window.startDemo();
  });
  nav.appendChild(demo);

  // Urdu labels for the two icon buttons
  if (window.PeekLang && typeof window.PeekLang.add === "function") {
    window.PeekLang.add({
      "Open menu": "مینو کھولیں",
      "Close menu": "مینو بند کریں",
    });
  }

  const isOpen = () => root.classList.contains("nav-open");

  function open() {
    if (!mq.matches || isOpen()) return;
    root.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    const target = nav.querySelector("a.active") || nav.querySelector("a");
    // wait for the drawer to become visible before moving focus into it
    setTimeout(() => target && target.focus({ preventScroll: true }), 40);
  }
  function close(returnFocus = true) {
    if (!isOpen()) return;
    root.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));
  closeBtn.addEventListener("click", () => close());
  backdrop.addEventListener("click", () => close(false));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) close(false);
  });
  window.addEventListener("hashchange", () => close(false));
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    // keep keyboard focus inside the open drawer
    const items = [...nav.querySelectorAll("a[href], button")].filter(
      (el) => el.offsetParent !== null,
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  const onResize = () => {
    if (!mq.matches) close(false);
  };
  if (mq.addEventListener) mq.addEventListener("change", onResize);
  else mq.addListener(onResize);
})();
