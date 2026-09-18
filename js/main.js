/* ==========================================================================
   Rendering + interactions for both pages.
   Content comes from js/content.js (window.SITE); each HTML file sets
   <body data-page="home|videos">. You shouldn't need to edit this file
   to change text.
   ========================================================================== */
(() => {
  "use strict";

  const S = window.SITE;
  if (!S) return;

  const PAGE = document.body.dataset.page || "home";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Icons ---------- */
  const svg = (paths, cls = "", size = 18) =>
    `<svg class="${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const ICON = {
    download: () => svg('<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/>'),
    external: () => svg('<path d="M7 17 17 7m0 0H9m8 0v8"/>'),
    mail: () => svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7.5 8 5.5 8-5.5"/>'),
    phone: () => svg('<path d="M5.5 4h3l1.8 4.6-2.3 1.5a11 11 0 0 0 5.9 5.9l1.5-2.3L20 15.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3.5 6a2 2 0 0 1 2-2z"/>'),
    linkedin: () => svg('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5V17M8 7.2v.01M12 17v-3.6a2.4 2.4 0 0 1 4.8 0V17M12 10.5V17"/>'),
    pin: () => svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    copy: () => svg('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9"/>', "i-copy"),
    check: () => svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', "i-check"),
    plus: () => svg('<path d="M12 5v14M5 12h14"/>', "", 16),
    youtube: () => svg('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>'),
    play: () => '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  };

  /* ---------- Helpers ---------- */
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ym = (s) => {
    if (!s || s === "present") {
      const d = new Date();
      return { y: d.getFullYear(), m: d.getMonth() };
    }
    const [y, m] = s.split("-").map(Number);
    return { y, m: m - 1 };
  };
  const fmtMonth = (s) => (s === "present" ? "Present" : `${MONTHS[ym(s).m]} ${ym(s).y}`);
  const fmtDay = (s) => {
    if (!s) return "";
    const [y, m, d] = s.split("-").map(Number);
    return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
  };
  const fmtDuration = (start, end) => {
    const a = ym(start);
    const b = ym(end);
    const total = (b.y - a.y) * 12 + (b.m - a.m) + 1;
    const y = Math.floor(total / 12);
    const m = total % 12;
    return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
  };
  const pad = (n) => String(n).padStart(2, "0");
  const attr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const cvAttrs = () => `href="${S.person.cv}" target="_blank" rel="noopener"`;

  // Section links scroll in place on the main page, and point back to it from other pages
  const navHref = (n) => (n.href ? n.href : PAGE === "home" ? `#${n.target}` : `index.html#${n.target}`);
  // Long labels can carry a `shortLabel` for phones; CSS picks which one shows
  const navText = (n) =>
    n.shortLabel ? `<span class="topnav__long">${n.label}</span><span class="topnav__short">${n.shortLabel}</span>` : n.label;

  // Accepts any YouTube link (watch, youtu.be, shorts, embed, live) or a bare 11-character ID
  const youtubeId = (url) => {
    const s = String(url || "").trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    try {
      const u = new URL(s);
      if (u.hostname.endsWith("youtu.be")) return u.pathname.slice(1, 12) || null;
      if (u.searchParams.get("v")) return u.searchParams.get("v").slice(0, 11);
      const m = u.pathname.match(/\/(embed|shorts|live|v)\/([\w-]{11})/);
      return m ? m[2] : null;
    } catch {
      return null;
    }
  };

  const sectionHead = ({ eyebrow, title, intro }, tag = "h2") => `
    <header class="section-head reveal">
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
      <${tag} class="section-title">${title}</${tag}>
      ${intro ? `<p class="section-intro">${intro}</p>` : ""}
    </header>`;

  const split = (id, { title, intro }, body) => `
    <section class="section" id="${id}" aria-labelledby="${id}-title">
      <div class="container split">
        <div class="split__head reveal">
          <h2 id="${id}-title">${title}</h2>
          ${intro ? `<p>${intro}</p>` : ""}
        </div>
        <div class="reveal" style="--d:.08s">${body}</div>
      </div>
    </section>`;

  /* ======================================================================
     SHARED PARTS
     ====================================================================== */
  const header = () => `
    <div class="topbar__inner">
      <a class="brand" href="${PAGE === "home" ? "#top" : "index.html"}" aria-label="${attr(S.person.name)}, home">
        <span class="brand__mark" aria-hidden="true">${S.person.initials}</span>
      </a>
      <nav class="topnav" aria-label="Primary">
        ${S.nav
          .map(
            (n) =>
              `<a href="${navHref(n)}"${n.page === PAGE ? ' aria-current="page"' : ""}${n.target ? ` data-section="${n.target}"` : ""}${
                n.hideOnMobile ? ' class="hide-sm"' : ""
              }${n.shortLabel ? ` aria-label="${attr(n.label)}"` : ""}>${navText(n)}</a>`
          )
          .join("")}
      </nav>
    </div>`;

  const footer = () => `
    <div class="container footer__inner">
      <p>© ${new Date().getFullYear()} ${S.person.name} · ${S.person.title}</p>
      <nav class="footer__nav" aria-label="Footer">
        ${S.nav.map((n) => `<a href="${navHref(n)}">${n.label}</a>`).join("")}
        <a href="${S.person.linkedinUrl}" target="_blank" rel="noopener">LinkedIn</a>
      </nav>
      <p class="footer__credit">${S.footer.credit}</p>
    </div>`;

  /* ======================================================================
     MAIN PAGE SECTIONS
     ====================================================================== */
  const hero = () => {
    const { home: h, person: p } = S;
    return `
      <section class="hero" id="top">
        <div class="hero__inner">
          <p class="label" data-enter style="--i:0">${h.label
            .split("·")
            .map((part) => `<span>${part.trim()}</span>`)
            .join('<span class="label__sep" aria-hidden="true">·</span>')}</p>
          <h1 class="hero__title" data-enter style="--i:1">${h.headline}</h1>
          <p class="hero__lead" data-enter style="--i:2">${h.lead}</p>
          <div class="hero__cta" data-enter style="--i:3">
            <a class="btn btn--primary" href="${h.primary.href}">${ICON.youtube()} ${h.primary.label}</a>
            <a class="btn btn--secondary" ${cvAttrs()}>${ICON.download()} Download CV</a>
          </div>
          <p class="hero__note" data-enter style="--i:4">
            <span class="dot" aria-hidden="true"></span><span>${p.status}</span><span aria-hidden="true">·</span><span data-clock></span>
          </p>
        </div>
      </section>`;
  };

  const about = () => {
    const { about: a, person: p } = S;
    return `
      <section class="section" id="about">
        <div class="container about">
          <div class="reveal">
            <p class="eyebrow">${a.eyebrow}</p>
            <h2 class="section-title">${a.title}</h2>
            <p class="about-lead">${a.lead}</p>
            ${a.paragraphs.map((t) => `<p class="about-p">${t}</p>`).join("")}
            <div class="about-cta">
              <a class="btn btn--primary" ${cvAttrs()}>${ICON.download()} Download CV</a>
              <a class="btn btn--secondary" href="#contact">Get in touch</a>
            </div>
          </div>
          <figure class="portrait reveal" style="--d:.1s">
            <div class="portrait__frame">
              <span class="portrait__mono" aria-hidden="true">${p.initials}</span>
              ${p.photo ? `<img src="${p.photo}" alt="Portrait of ${attr(p.name)}" onerror="this.remove()">` : `<span class="ph__hint">photo slot → person.photo</span>`}
            </div>
            ${a.caption ? `<figcaption>${a.caption}</figcaption>` : ""}
          </figure>
        </div>
      </section>`;
  };

  const approach = () =>
    split(
      "how-i-work",
      S.about.approach,
      `<ol class="steps">
        ${S.about.approach.items
          .map(
            (it, i) => `
          <li class="step">
            <span class="step__num">${pad(i + 1)}</span>
            <div>
              <h3>${it.title}</h3>
              <p>${it.text}</p>
              ${it.tools ? `<ul class="chips" aria-label="Tools">${it.tools.map((t) => `<li class="chip">${t}</li>`).join("")}</ul>` : ""}
            </div>
          </li>`
          )
          .join("")}
      </ol>`
    );

  const work = () => {
    const w = S.work;
    return `
      <section class="section" id="work">
        <div class="container">
          ${sectionHead(w)}
          <div class="work-grid">
            ${w.items
              .map(
                (it, i) => `
              <article class="card reveal" style="--d:${(i % 2) * 0.08}s">
                <div class="card__media" style="--tint:var(--tint-${it.tint || "green"})">
                  <div class="ph" aria-hidden="true">
                    <span class="ph__name">${it.name}</span>
                    ${it.image ? "" : `<span class="ph__hint">image slot → ${it.imageHint || "assets/work/…"}</span>`}
                  </div>
                  ${it.image ? `<img src="${it.image}" alt="${attr(it.imageAlt || `${it.name} screenshot`)}" loading="lazy" onerror="this.remove()">` : ""}
                </div>
                <div class="card__body">
                  <div class="card__top">
                    <span class="eyebrow">${it.category}</span>
                    ${it.url ? `<a class="card__link" href="${it.url}" target="_blank" rel="noopener">${it.urlLabel || "Visit"} ${ICON.external()}</a>` : ""}
                  </div>
                  <h3>${it.name}</h3>
                  <p class="card__desc">${it.description}</p>
                  <div class="card__role"><p><b>My role:</b> ${it.role}</p></div>
                </div>
              </article>`
              )
              .join("")}
          </div>
        </div>
      </section>`;
  };

  const experience = () =>
    split(
      "experience",
      S.about.experience,
      `<div class="timeline">
        ${S.about.experience.roles
          .map((r, i) => {
            const place = [r.location, r.mode && `(${r.mode})`].filter(Boolean).join(" ");
            return `
          <details class="role"${i === 0 ? " open" : ""}>
            <summary>
              <span class="role__dates">${fmtMonth(r.start)} – ${fmtMonth(r.end)}<small>${fmtDuration(r.start, r.end)}</small></span>
              <span class="role__main">
                <span class="role__title">${r.role}</span>
                <span class="role__company">${r.company}${place ? ` · ${place}` : ""}</span>
              </span>
              <span class="plus" aria-hidden="true">${ICON.plus()}</span>
            </summary>
            <div class="role__body">
              <p>${r.summary}</p>
              ${r.highlights?.length ? `<ul class="bullets">${r.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>` : ""}
              ${r.tags?.length ? `<ul class="tags-sm" aria-label="Tags">${r.tags.map((t) => `<li>${t}</li>`).join("")}</ul>` : ""}
              ${r.product ? `<a class="text-link" href="${r.product.url}" target="_blank" rel="noopener">${r.product.name} ${ICON.external()}</a>` : ""}
            </div>
          </details>`;
          })
          .join("")}
      </div>`
    );

  const toolkit = () =>
    split(
      "toolkit",
      S.about.skills,
      `<div class="skill-rows">
        ${S.about.skills.groups
          .map(
            (g) => `
          <div class="skill-row">
            <h3>${g.name}</h3>
            <ul class="tags">
              ${g.items.map((it) => `<li class="tag"${it.where ? ` data-where="${attr(it.where)}" tabindex="0"` : ""}>${it.name}</li>`).join("")}
            </ul>
          </div>`
          )
          .join("")}
      </div>`
    );

  const education = () => {
    const ed = S.about.education;
    return split(
      "education",
      ed,
      `<div class="edu-group">
        <h3>Degrees</h3>
        <ul class="rows">
          ${ed.degrees
            .map((d) => `<li class="row"><div><p class="row__title">${d.name}</p><p class="row__sub">${d.school}</p></div><span class="row__meta">${d.years || ""}</span></li>`)
            .join("")}
        </ul>
      </div>
      <div class="edu-group">
        <h3>Certifications</h3>
        <ul class="rows">
          ${ed.certifications.map((c) => `<li class="row"><p class="row__title">${c.name}</p><span class="row__meta">${c.issuer}</span></li>`).join("")}
        </ul>
      </div>`
    );
  };

  const contact = () => {
    const { contact: c, person: p } = S;
    const tel = p.phone.replace(/[^\d+]/g, "");
    return `
      <section class="section" id="contact">
        <div class="container">
          <div class="contact-card reveal">
            <div>
              ${sectionHead(c)}
              <ul class="clist">
                <li>
                  <span class="clist__icon">${ICON.mail()}</span>
                  <span class="clist__text"><small>Email</small><a href="mailto:${p.email}">${p.email}</a></span>
                  <button class="copy-btn" type="button" data-copy="${p.email}" aria-label="Copy email address">${ICON.copy()}${ICON.check()}<span>Copy</span></button>
                </li>
                <li>
                  <span class="clist__icon">${ICON.phone()}</span>
                  <span class="clist__text"><small>Phone</small><a href="tel:${tel}">${p.phone}</a></span>
                </li>
                <li>
                  <span class="clist__icon">${ICON.linkedin()}</span>
                  <span class="clist__text"><small>LinkedIn</small><a href="${p.linkedinUrl}" target="_blank" rel="noopener">${p.linkedin}</a></span>
                </li>
                <li>
                  <span class="clist__icon">${ICON.pin()}</span>
                  <span class="clist__text"><small>Based in</small><span>${p.location} · <span data-clock="short"></span> local time</span></span>
                </li>
              </ul>
              <a class="btn btn--secondary contact-cv" ${cvAttrs()}>${ICON.download()} Download CV</a>
            </div>

            <form class="form" data-contact-form>
              <div class="field">
                <label for="f-name">Name</label>
                <input id="f-name" name="name" autocomplete="name" required>
              </div>
              <div class="field">
                <label for="f-email">Email</label>
                <input id="f-email" name="email" type="email" autocomplete="email" required>
              </div>
              <div class="field">
                <label for="f-message">Message</label>
                <textarea id="f-message" name="message" rows="6" required></textarea>
              </div>
              <button class="btn btn--primary btn--block" type="submit">${ICON.mail()} Send message</button>
              <p class="form__note">${c.formNote}</p>
            </form>
          </div>
        </div>
      </section>`;
  };

  /* ======================================================================
     PAGES
     ====================================================================== */
  const P = {};

  P.home = () => hero() + about() + approach() + work() + experience() + toolkit() + education() + contact();

  /* ---------- Videos page ---------- */
  // `eager` for the featured video: it's above the fold, so don't lazy-load its thumbnail
  const player = (v, eager = false) => `
    <div class="player">
      <button class="player__btn" type="button" data-yt="${v.id}" data-title="${attr(v.title)}" aria-label="Play video: ${attr(v.title)}">
        <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}>
        <span class="player__play">${ICON.play()}</span>
      </button>
    </div>`;
  const videoMeta = (v) =>
    `<p class="meta">${v.topic ? `<span class="meta__topic">${v.topic}</span>` : ""}${v.topic && v.date ? '<span aria-hidden="true">·</span>' : ""}${
      v.date ? `<time datetime="${attr(v.date)}">${fmtDay(v.date)}</time>` : ""
    }</p>`;
  const ytLink = (v) =>
    `<a class="yt-link" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Watch on YouTube ${ICON.external()}</a>`;

  P.videos = () => {
    const v = S.videos;
    const items = (v.items || [])
      .map((it) => ({ ...it, id: youtubeId(it.url) }))
      .filter((it) => it.id)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    const subscribe = v.channelUrl
      ? `<a class="btn btn--secondary btn--sm" href="${v.channelUrl}" target="_blank" rel="noopener">${ICON.youtube()} ${v.channelLabel}</a>`
      : "";
    const head = `
      <header class="page-head reveal">
        <h1 class="page-title">${v.title}</h1>
        ${v.intro ? `<p class="page-intro">${v.intro}</p>` : ""}
      </header>`;

    if (!items.length) {
      return `
        <div class="narrow page">
          ${head}
          <div class="empty reveal">
            <span class="empty__icon">${ICON.youtube()}</span>
            <h2>${v.empty.title}</h2>
            <p>${v.empty.text}</p>
            ${subscribe}
          </div>
        </div>`;
    }

    const topics = [...new Set(items.map((i) => i.topic).filter(Boolean))];
    const filters =
      topics.length > 1
        ? `<div class="filters" role="group" aria-label="Filter videos by topic">
            <button class="filter" type="button" data-topic="" aria-pressed="true">All</button>
            ${topics.map((t) => `<button class="filter" type="button" data-topic="${attr(t)}" aria-pressed="false">${t}</button>`).join("")}
          </div>`
        : "<span></span>";
    const [first] = items;

    return `
      <div class="narrow page">
        ${head}
        ${topics.length > 1 || subscribe ? `<div class="video-toolbar">${filters}${subscribe}</div>` : ""}

        <article class="featured reveal" data-featured>
          ${player(first, true)}
          <div class="featured__body">
            ${videoMeta(first)}
            <h2 class="featured__title">${first.title}</h2>
            ${first.description ? `<p>${first.description}</p>` : ""}
            ${ytLink(first)}
          </div>
        </article>

        ${items.length > 1 ? `<h2 class="list-title" data-list-title>More Videos</h2>` : ""}
        <div class="video-grid">
          ${items
            .map(
              (it, i) => `
            <article class="video reveal" data-topic="${attr(it.topic || "")}"${i === 0 ? " data-dup hidden" : ""}>
              ${player(it)}
              <div class="video__body">
                ${videoMeta(it)}
                <h3 class="video__title">${it.title}</h3>
                ${it.description ? `<p class="video__desc">${it.description}</p>` : ""}
                ${ytLink(it)}
              </div>
            </article>`
            )
            .join("")}
        </div>
      </div>`;
  };

  /* ---------- Paint ---------- */
  const slot = (name) => $(`[data-render="${name}"]`);
  if (slot("header")) slot("header").innerHTML = header();
  if (slot("footer")) slot("footer").innerHTML = footer();
  if (slot("page") && P[PAGE]) slot("page").innerHTML = P[PAGE]();

  // Arriving from the videos page with a #section link: the browser tried to jump before
  // the sections existed, so jump now, and again once web fonts settle the layout
  if (PAGE === "home" && location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      const jump = () => target.scrollIntoView({ behavior: "instant", block: "start" });
      jump();
      document.fonts?.ready.then(jump);
    }
  }

  /* ======================================================================
     INTERACTIONS
     ====================================================================== */

  /* ---------- Top bar: deeper shadow once the page scrolls ---------- */
  (() => {
    const bar = $(".topbar");
    if (!bar) return;
    const onScroll = () => bar.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Hero entrance ---------- */
  const loaded = () => document.body.classList.add("is-loaded");
  requestAnimationFrame(() => requestAnimationFrame(loaded));
  setTimeout(loaded, 400); // fallback: rAF doesn't fire in background tabs

  /* ---------- Live local clock ---------- */
  (() => {
    const els = $$("[data-clock]");
    if (!els.length) return;
    let fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", { timeZone: S.person.timezone, hour: "2-digit", minute: "2-digit" });
    } catch {
      return;
    }
    const city = S.person.location.split(",")[0];
    // data-clock="short" shows just the time (used where the city is already written out)
    const update = () => {
      const t = fmt.format(new Date());
      els.forEach((el) => (el.textContent = el.dataset.clock === "short" ? t : `${t} in ${city}`));
    };
    update();
    setInterval(update, 20000);
  })();

  /* ---------- Main page: highlight the nav link for the section in view ---------- */
  (() => {
    if (PAGE !== "home") return;
    const links = new Map($$(".topnav [data-section]").map((a) => [a.dataset.section, a]));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const link = en.target.id === "top" ? null : links.get(en.target.id);
          if (link === undefined) return; // sections without a nav link keep the previous state
          links.forEach((a) => a.classList.toggle("is-active", a === link));
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main section[id]").forEach((s) => io.observe(s));
  })();

  /* ---------- Reveal on scroll ---------- */
  (() => {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => io.observe(el));
  })();

  /* ---------- Videos: play inline + topic filter ---------- */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".player__btn");
    if (!btn) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    iframe.title = btn.dataset.title || "YouTube video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    btn.replaceWith(iframe);
  });

  (() => {
    const buttons = $$(".filter");
    if (!buttons.length) return;
    const featured = $("[data-featured]");
    const listTitle = $("[data-list-title]");
    const cards = $$(".video");
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        const topic = b.dataset.topic;
        const all = !topic;
        buttons.forEach((x) => x.setAttribute("aria-pressed", x === b));
        if (featured) featured.hidden = !all;
        if (listTitle) listTitle.hidden = !all;
        cards.forEach((c) => {
          c.hidden = all ? c.hasAttribute("data-dup") : c.dataset.topic !== topic;
          c.classList.add("is-visible");
        });
      })
    );
  })();

  /* ---------- Contact form → opens the visitor's email app ---------- */
  (() => {
    const form = $("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get("name")).trim();
      const email = String(data.get("email")).trim();
      const message = String(data.get("message")).trim();
      const subject = `${S.contact.subject}: ${name}`;
      const body = `${message}\n\n${name}\n${email}`;
      window.location.href = `mailto:${S.person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      say("Opening your email app…");
    });
  })();

  /* ---------- Copy email + toast ---------- */
  const toast = $(".toast");
  let hideTimer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove("is-show"), 2200);
  }
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  };
  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const label = $("span", btn);
      if (await copy(btn.dataset.copy)) {
        btn.classList.add("is-copied");
        label.textContent = "Copied";
        say("Email copied. Talk soon!");
        setTimeout(() => {
          btn.classList.remove("is-copied");
          label.textContent = "Copy";
        }, 2000);
      } else {
        say(`Couldn't copy. It's ${btn.dataset.copy}`);
      }
    })
  );
})();
