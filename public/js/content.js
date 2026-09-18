/* ==========================================================================
   SITE CONTENT — shared by both pages (index.html and videos.html)
   --------------------------------------------------------------------------
   All text on the site lives here. Edit freely; the pages re-render from it.
   Strings may contain simple HTML:  <em>…</em> → green accent   <strong>…</strong>
   Dates use "YYYY-MM" (or "YYYY-MM-DD" for videos) or "present".
   ========================================================================== */

window.SITE = {
  person: {
    name: "Sahan Karunarathne",
    initials: "SK",
    title: "Operations Manager",
    location: "Colombo, Sri Lanka",
    timezone: "Asia/Colombo", // drives the live local-time clock
    email: "sahanuiux@gmail.com",
    phone: "+94 76 652 6087",
    // WhatsApp button. Leave "" to use `phone` above (digits only, no + or spaces),
    // or set a different number here, e.g. "94766526087".
    whatsapp: "",
    // First line pre-filled in the visitor's WhatsApp; leave "" for an empty chat.
    whatsappMessage: "Hi Sahan, I saw your portfolio.",
    linkedin: "linkedin.com/in/sahanux",
    linkedinUrl: "https://www.linkedin.com/in/sahanux",
    cv: "cv.pdf", // the CV file in the project root; opens in a new tab when clicked
    status: "Open to operations roles",
    // Portrait in the About section (portrait orientation works best)
    photo: "assets/sahan.jpg",
  },

  // Top navigation. `target` scrolls to a section on the main page;
  // `href` + `page` opens a separate page. `hideOnMobile` hides it on small screens;
  // `shortLabel` is shown instead of `label` on phones (the full label stays the accessible name).
  // Section links follow the order of the sections on the main page.
  nav: [
    { label: "About", target: "about" },
    { label: "Work", target: "work" },
    { label: "Experience", target: "experience", hideOnMobile: true },
    { label: "Education", target: "education", hideOnMobile: true },
    { label: "Knowledge Sharing", shortLabel: "Knowledge", href: "videos.html", page: "videos" },
    { label: "Contact", target: "contact" },
  ],

  /* ---------- Main page: hero ---------- */
  home: {
    // Question in the pill above the headline (the headline answers it)
    label: "Tired of work getting stuck between teams?",
    // Emoji shown before the question. Set to "" to hide it.
    labelEmoji: "\u{1F6A7}",
    headline: "I Run Company Operations, <em>Start to End.</em>",
    lead:
      "I manage company operations end to end, from people and tools to delivery and growth, and keep improving the process so the whole business runs smoother.",
    primary: { label: "Knowledge Sharing", href: "videos.html" },
  },

  /* ---------- Main page: about + how I work + experience + toolkit + education ---------- */
  about: {
    eyebrow: "About",
    title: "From UX Intern to <em>COO</em>.",
    lead:
      "I'm an operations manager who runs company operations end to end and keeps improving the process, so teams spend less time on friction and more on the work that matters.",
    paragraphs: [
      "I started in design and grew from UX intern to COO over 4+ years at huex. Along the way I've run operations for SaaS and AI platforms, worked remotely with teams in Canada and Sweden, and helped launch into the Indonesian market.",
      "I use AI tools like Claude, Claude Code, Claude Design and Codex every day to cut repetitive work and document how things run.",
    ],
    caption: "", // optional line under the photo; leave "" to hide it

    approach: {
      title: "How I Work",
      intro: "Three things I bring to every company I work with.",
      items: [
        {
          title: "See the Whole Operation",
          text: "Map how work actually flows across teams, tools and markets, and spot the bottlenecks before they turn into fires.",
        },
        {
          title: "Fix the Process, Not the Symptom",
          text: "Redesign workflows, give every step a clear owner, and set simple rhythms the team can keep, even in a busy week.",
        },
        {
          title: "Automate and Keep Improving",
          text: "Use AI tools every day to cut repetitive work, document how things run and build small internal tools. Then measure and iterate.",
          tools: ["Claude", "Claude Code", "Claude Design", "Codex"],
        },
      ],
    },

    experience: {
      title: "Experience",
      intro: "Most recent first. Open a role for the details.",
      roles: [
        {
          role: "Operations Manager",
          company: "Nanthi Ventures Inc",
          product: { name: "ledgerpro.ai", url: "https://ledgerpro.ai" },
          start: "2025-12",
          end: "2026-07",
          location: "Toronto",
          mode: "Remote",
          summary:
            "Owned product design and delivery for LedgerPro, a cloud accounting platform with built-in local tax and payroll compliance.",
          highlights: [
            "Took the payroll module from roadmap through delivery.",
            "Led the payroll launch into the Indonesian market.",
          ],
          tags: ["Operations", "FinTech", "Market launch"],
        },
        {
          role: "UX Designer & Operations",
          company: "Oncotech Nordic AB",
          start: "2024-10",
          end: "2025-12",
          location: "Sweden",
          mode: "Remote",
          summary: "Designed UX for AI-powered cancer and diabetes screening products.",
          highlights: [
            "Designed the experience for <strong>Ophtascan</strong>, the world's first clinically tested on-demand screening system.",
          ],
          tags: ["MedTech", "AI products", "UX & operations"],
        },
        {
          role: "Co-Founder & COO",
          company: "talport",
          start: "2025-03",
          end: "2025-12",
          location: "Colombo",
          mode: "",
          summary:
            "An AI-driven platform aggregating and vetting AI engineering talent from emerging markets for global companies.",
          highlights: [
            "Led product and operations from zero.",
            "Ran marketing campaigns across LinkedIn, Facebook and Instagram.",
          ],
          tags: ["HRTech", "0 → 1", "Operations", "Growth marketing"],
        },
        {
          role: "Chief Operations Officer",
          company: "huex Pvt Ltd",
          product: { name: "huex.io", url: "https://huex.io" },
          start: "2021-12",
          end: "2025-12",
          location: "Colombo",
          mode: "",
          summary: "Progressed from UX Intern to COO over 4+ years.",
          highlights: [
            "Owned product delivery and business operations.",
            "Ran marketing campaigns for huex.io.",
          ],
          tags: ["IT Services", "Operations", "Delivery", "Marketing"],
        },
        {
          role: "Web Development Intern",
          company: "Revoise",
          start: "2021-01",
          end: "2021-06",
          location: "Sri Lanka",
          mode: "",
          summary: "Where it started: hands-on web development.",
          highlights: [],
          tags: ["HTML/CSS", "Web"],
        },
      ],
    },

    skills: {
      title: "Toolkit",
      intro: "Hover a skill to see where I've used it.",
      // `where` shows on hover. Leave "" to hide it.
      groups: [
        {
          name: "Operations & Strategy",
          items: [
            { name: "Startup Strategy", where: "talport · huex" },
            { name: "Cross-Border Team Ops", where: "Canada · Sweden · Sri Lanka" },
            { name: "Talent Vetting", where: "talport" },
          ],
        },
        {
          name: "AI & Technical",
          items: [
            { name: "Claude", where: "Daily: research, docs & planning" },
            { name: "Claude Code", where: "Daily: internal tools (and this site)" },
            { name: "Claude Design", where: "Daily: quick UI exploration" },
            { name: "Codex", where: "Daily: code generation & review" },
            { name: "HTML/CSS", where: "Revoise · this site" },
          ],
        },
        {
          name: "Marketing",
          items: [
            { name: "LinkedIn Campaigns", where: "talport · huex" },
            { name: "Facebook/Instagram Campaigns", where: "talport" },
            { name: "Content", where: "talport · huex" },
          ],
        },
        {
          name: "Design Background",
          items: [
            { name: "UI/UX Design", where: "LedgerPro · Ophtascan · huex" },
            { name: "Design Systems", where: "" },
            { name: "UX Research", where: "" },
            { name: "Prototyping", where: "" },
            { name: "Accessibility", where: "" },
          ],
        },
      ],
    },

    education: {
      title: "Education",
      degrees: [
        { name: "MBA", school: "Canterbury Christ Church University", years: "2024 – 2025" },
        { name: "HND in Creative Media Production", school: "AMDT School of Creativity", years: "" },
      ],
      certifications: [
        { name: "Google Interaction Design", issuer: "Google" },
        { name: "Google UX Fundamentals", issuer: "Google" },
        { name: "UX Design: Creating Personas", issuer: "Coursera" },
        { name: "UX Design Foundations", issuer: "Uxcel" },
        { name: "React.js Essential Training", issuer: "Coursera" },
      ],
    },
  },

  /* ---------- Main page: work ---------- */
  work: {
    eyebrow: "Work",
    title: "Products I've <em>Worked On</em>.",
    intro: "Products and companies I've worked on, and the part I played in each.",
    // To add a screenshot: drop an image into assets/work/ and set `image`,
    // e.g. image: "assets/work/ledgerpro.jpg" (16:10 works best). `tint` colours the empty slot.
    items: [
      {
        name: "LedgerPro",
        category: "FinTech",
        description: "A cloud accounting platform with built-in local tax and payroll compliance.",
        role: "Operations Manager. Took the payroll module to launch in the Indonesian market.",
        url: "https://ledgerpro.ai",
        urlLabel: "ledgerpro.ai",
        image: "",
        imageHint: "assets/work/ledgerpro.jpg",
        tint: "green",
      },
      {
        name: "Oncotech",
        category: "MedTech",
        description: "The MedTech company behind Ophtascan, the world's first clinically tested on-demand screening system.",
        role: "UX Designer & Operations. Designed the screening experience.",
        url: "https://oncotech.global",
        urlLabel: "Oncotech Nordic AB",
        image: "assets/work/oncotech.jpg?v=2",
        imageAlt: "Ophtascan in use: a clinician adjusts the smartphone headset on a patient while it captures a close-up photo of her eye",
        imageHint: "assets/work/oncotech.jpg",
        tint: "blue",
      },
      {
        name: "talport",
        category: "HRTech",
        description:
          "An AI-driven platform that aggregates and vets AI engineering talent from emerging markets for global companies.",
        role: "Co-Founder & COO. Led product, operations and marketing.",
        url: "https://www.linkedin.com/company/talport",
        urlLabel: "LinkedIn",
        image: "",
        imageHint: "assets/work/talport.jpg",
        tint: "lilac",
      },
      {
        name: "huex",
        category: "IT Services",
        description: "A product studio where I grew from UX intern to COO over 4+ years.",
        role: "COO. Owned delivery, business operations and marketing.",
        url: "https://huex.io",
        urlLabel: "huex.io",
        image: "",
        imageHint: "assets/work/huex.jpg",
        tint: "sand",
      },
    ],
  },

  /* ---------- Main page: contact ---------- */
  contact: {
    eyebrow: "Contact",
    title: "Let's Talk <em>Operations</em>.",
    intro: "Hiring for operations, or need someone to untangle how your company runs? Send me a message.",
    formNote: "This opens your email app with the message ready to send.",
    subject: "Hello from your website",
  },

  /* ---------- Videos page (videos.html) ---------- */
  videos: {
    title: "Videos",
    intro:
      "Where I share what I've learned running company operations: fixing processes, working across teams and using AI tools day to day.",
    // Your YouTube channel link (shows a "Subscribe" button). Leave "" to hide it.
    channelUrl: "",
    channelLabel: "Subscribe on YouTube",
    // HOW TO ADD A VIDEO — copy this block into `items` and fill it in:
    //   {
    //     title: "How I map a company's operations in one week",
    //     url: "https://www.youtube.com/watch?v=VIDEO_ID",   // any YouTube link works (watch, youtu.be, shorts)
    //     date: "2026-09-10",                                 // newest is featured at the top
    //     topic: "Operations",                                // used for the filter buttons
    //     description: "One or two lines about what viewers will learn.",
    //   },
    items: [],
    empty: {
      title: "Videos Coming Soon",
      text: "I share what I learn about running operations on YouTube. The latest videos will be listed here.",
    },
  },

  footer: {
    credit: "Built with Claude Code",
  },
};
