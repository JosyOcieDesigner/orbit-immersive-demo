const BASE = "./";

/* ==========================================================
   PORTFOLIO — SELECTED WORKS (simplified)
   type: event | video | live (streaming / virtual) | digital
   ========================================================== */

const videos = [
  { id:"p5H_neI8nSA", title:"Aximmetry Streaming Event", client:"Kemendikbudristek", year:2022, type:"live" },
  { id:"7Mjo9ZoQKdk", title:"After Effects Graphic Development", client:"Jafra", year:2020, type:"digital" },
  { id:"78YeVpyMJgE", title:"Midyear Meeting Broadcast", client:"Mandiri Utama Finance", year:2023, type:"live" },
  { id:"o-jr_uCeVGc", title:"Reuni Akbar 55 Tahun", client:"FISIP UI", year:2022, type:"event" },
  { id:"SZuYLtXobTw", title:"Gala Dinner", client:"Ferrari Owners Club Indonesia", year:2022, type:"event" },
  { id:"RYHhRRq4vmk", title:"Launching Tujuh Kebiasaan", client:"Kemendikbudristek", year:2024, type:"event" },
  { id:"Ysb_F_TWdBM", title:"Movie Screening", client:"Telkomsel × Prime Video", year:2024, type:"event" },
  { id:"ztzvE9rnH9U", title:"Gelar Wicara Puspeka", client:"Kemendikbudristek", year:2022, type:"event" },
  { id:"6i2qeBiPmrM", title:"Midyear Meeting", client:"Mandiri Utama Finance", year:2023, type:"event" },
  { id:"bmD3KTpkQu8", title:"Annual Meeting", client:"Mandiri Utama Finance", year:2025, type:"event" },
  { id:"aNVfmG6Io88", title:"Interview Series", client:"Mitras DUDI", year:2023, type:"video" },
  { id:"vpmbdMpktXI", title:"Music Video — Andien Medley", client:"Kemendikbudristek", year:2021, type:"video" },
  { id:"nSuQSeqH0iI", title:"Launching Manajemen Talenta", client:"Kemendikdasmen", year:2025, type:"event" },
  { id:"4tqC6Hr1R5E", title:"Farewell Party", client:"Kemendikbudristek", year:2024, type:"event" },
  { id:"CfSAYpalJAE", title:"Short Film Anti-Bullying", client:"Kemendikbudristek", year:2025, type:"video" },
  { id:"1G8XVFR8NeQ", title:"Midyear Touring", client:"Mandiri Utama Finance", year:2023, type:"video" },
  { id:"x93EqiUeD6c", title:"Untukmu Indonesiaku", client:"Bappenas", year:2021, type:"event" },
  { id:"v7SNZDYfVOQ", title:"Alumni Gathering", client:"FISIP UI", year:2024, type:"event" },
  { id:"a6JZUictggw", title:"Music Video — Pelajar Pancasila", client:"Kemendikbudristek", year:2023, type:"video" },
  { id:"qIE1wK0Zf2o", title:"Praktik Baik Program", client:"Kemendikbudristek", year:2023, type:"event" },
  { id:"Qbv4WrXNDXM", title:"Online Graduation", client:"Universitas Prasetiya Mulya", year:2020, type:"live" },
  { id:"kVx6Bget3Wk", title:"Opening Video — Formula One", client:"Mandiri Utama Finance", year:2021, type:"digital" },
  { id:"Ww2o08iwjF4", title:"Tunas Bhinneka Gathering", client:"Kemendikbudristek", year:2024, type:"video" },
  { id:"EFi6plBvvSg", title:"Product Launch Video", client:"Telkom Indonesia", year:2024, type:"video" },
  { id:"mWOWWVG1gdk", title:"Staff Gathering", client:"Toyota Tsusho Indonesia", year:2023, type:"event" },
  { id:"hsdsg711GOw", title:"Employee Gathering — Mission Impossible", client:"Castrol", year:2023, type:"event" },
  { id:"K3IL5DFYE1Y", title:"Pusaka Days Exhibition", client:"Kemendikbudristek", year:2024, type:"event" },
  { id:"iFeY5ShrP_8", title:"Awarding Night", client:"Kemendikdasmen", year:2024, type:"event" },
  { id:"jddCyUzLeBQ", title:"Midyear Meeting", client:"Mandiri Utama Finance", year:2024, type:"event" },
  { id:"kc7d9YxAAeM", title:"Unreal Engine Opening", client:"Mandiri Utama Finance", year:2025, type:"digital" },
  // 31 & 32: video IDs swapped so each matches its thumbnail
  { id:"n_zRjZcywXM", title:"Nobar NBA Final", client:"NBA × Prime Video", year:2026, type:"event" },
  { id:"CEhWNUVJiB8", title:"3x3 Shoot & Win Competition", client:"Telkomsel", year:2026, type:"event" },
  { id:"oUe9WBMy-Is", title:"Rukun Sama Teman", client:"Kemendikbudristek", year:2026, type:"video" },
  { id:"cQAOSfosogE", title:"Business Revamp", client:"BCA", year:2020, type:"live" },
  { id:"E2PQuEoaRgg", title:"Virtual Exhibition", client:"BCA", year:2020, type:"live" },
  { id:"Kr1njc5bDb8", title:"Kick Off Meeting", client:"Mandiri Utama Finance", year:2021, type:"live" },
  { id:"E1cNRHAcHfw", title:"Intimate Dinner", client:"Mandiri Utama Finance", year:2021, type:"event" },
  { id:"fytjaZ4skac", title:"Anugerah Tata Bandha Negara", client:"Kementerian ESDM", year:2021, type:"video" },
  { id:"Iuh_6cuiazc", title:"Animated Explainer", client:"IndiHome", year:2021, type:"video" },
  { id:"JS_ngll75OA", title:"Virtual Sneaker Exhibition", client:"Jakarta Sneaker Day", year:2020, type:"digital" },
  { id:"B4fUzJI2VRM", title:"Launching Lagu Rukun Sama Teman", client:"Kemendikbudristek", year:2026, type:"event" },
  { id:"V1hNhzusDok", title:"FISIP UI Open Badminton", client:"FISIP UI", year:2023, type:"event" }
].map((v, i) => ({ ...v, thumbnail:`project-${String(i + 1).padStart(2, "0")}.png` }));

const WORK_TYPES = [
  ["all", "All"],
  ["event", "Event"],
  ["video", "Video"],
  ["live", "Streaming & Virtual"],
  ["digital", "Digital"]
];
const WORKS_PREVIEW = 8;

const grid = document.getElementById("videoGrid");

function thumbSrc(v) {
  return `${BASE}${v.thumbnail}?v=20260829-1`;
}

(function buildWorks() {
  if (!grid) return;
  const section = grid.closest("section");
  const counter = section && section.querySelector(".section-head > span");
  if (counter) counter.textContent = `${videos.length} projects`;

  // newest first
  const list = videos
    .map((v, i) => ({ ...v, order: i }))
    .sort((a, b) => b.year - a.year || a.order - b.order);

  const filters = document.createElement("div");
  filters.className = "wk-filters";
  filters.setAttribute("role", "tablist");
  filters.innerHTML = WORK_TYPES.map(([key, label]) => {
    const n = key === "all" ? list.length : list.filter(v => v.type === key).length;
    return `<button type="button" role="tab" data-type="${key}" aria-selected="${key === "all"}">${label}<span>${n}</span></button>`;
  }).join("");

  grid.className = "wk-grid";
  grid.innerHTML = "";
  grid.before(filters);

  const more = document.createElement("button");
  more.type = "button";
  more.className = "wk-more";
  grid.after(more);

  list.forEach(v => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "wk-card";
    card.dataset.type = v.type;
    card.setAttribute("aria-label", `Play ${v.title} — ${v.client}`);
    card.innerHTML = `
      <span class="wk-thumb"><img src="${thumbSrc(v)}" alt="" loading="lazy" draggable="false"><i aria-hidden="true">▶</i></span>
      <span class="wk-info"><strong>${v.title}</strong><small>${v.client} · ${v.year}</small></span>`;
    card.addEventListener("click", () => openWork(v));
    grid.appendChild(card);
  });

  let type = "all", expanded = false;
  function render() {
    const cards = [...grid.children];
    const match = cards.filter(c => type === "all" || c.dataset.type === type);
    cards.forEach(c => (c.hidden = true));
    match.forEach((c, i) => (c.hidden = !expanded && i >= WORKS_PREVIEW));
    const hiddenCount = Math.max(0, match.length - WORKS_PREVIEW);
    more.hidden = hiddenCount === 0;
    more.textContent = expanded ? "Show less ↑" : `View all ${match.length} projects ↓`;
    filters.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.type === type)));
    grid.scrollLeft = 0;
  }
  filters.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    type = b.dataset.type;
    expanded = false;
    render();
  });
  more.addEventListener("click", () => {
    expanded = !expanded;
    render();
    if (!expanded) filters.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  render();

  // lightweight video lightbox
  const box = document.createElement("div");
  box.className = "wk-modal";
  box.hidden = true;
  box.innerHTML = `
    <div class="wk-modal-bg" data-close></div>
    <div class="wk-modal-panel" role="dialog" aria-modal="true" aria-label="Project video">
      <button type="button" class="wk-close" data-close aria-label="Close">✕</button>
      <div class="wk-player"></div>
      <div class="wk-caption"><strong></strong><small></small></div>
    </div>`;
  document.body.appendChild(box);
  const player = box.querySelector(".wk-player");
  let lastFocus = null;

  function openWork(v) {
    lastFocus = document.activeElement;
    player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${v.title}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    box.querySelector(".wk-caption strong").textContent = v.title;
    box.querySelector(".wk-caption small").textContent = `${v.client} · ${v.year}`;
    box.hidden = false;
    document.documentElement.classList.add("wk-lock");
    box.querySelector(".wk-close").focus();
  }
  function closeWork() {
    if (box.hidden) return;
    box.hidden = true;
    player.innerHTML = "";
    document.documentElement.classList.remove("wk-lock");
    if (lastFocus) lastFocus.focus();
  }
  box.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeWork(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeWork(); });
})();


/* ========================================
   FEATURED SHOWREEL POPUP
   ======================================== */

const showreelTrigger =
  document.getElementById("showreelTrigger");

const showreelModal =
  document.getElementById("showreelModal");

const showreelModalVideo =
  document.getElementById("showreelModalVideo");

let lastFocusedElement = null;


function openShowreel() {

  if (!showreelModal || !showreelModalVideo) return;

  lastFocusedElement = document.activeElement;

  showreelModalVideo.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/25dHHzPEinA?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1"
      title="Cek Artis Portfolio Showreel"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  showreelModal.classList.add("is-open");
  showreelModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");

  const closeBtn =
    showreelModal.querySelector(".showreel-modal-close");

  if (closeBtn) closeBtn.focus();
}


function closeShowreel() {

  if (!showreelModal || !showreelModalVideo) return;

  showreelModal.classList.remove("is-open");
  showreelModal.setAttribute("aria-hidden", "true");

  /* Menghapus iframe juga menghentikan video */
  showreelModalVideo.innerHTML = "";

  document.body.classList.remove("modal-open");

  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus === "function"
  ) {
    lastFocusedElement.focus();
  }
}


if (showreelTrigger) {
  showreelTrigger.addEventListener(
    "click",
    openShowreel
  );
}


if (showreelModal) {

  showreelModal
    .querySelectorAll("[data-showreel-close]")
    .forEach(element => {

      element.addEventListener(
        "click",
        closeShowreel
      );

    });
}


/* ESC untuk menutup popup */

document.addEventListener("keydown", event => {

  if (
    event.key === "Escape" &&
    showreelModal &&
    showreelModal.classList.contains("is-open")
  ) {
    closeShowreel();
  }

});
/* ==========================================================
   REFERENCE SHOWREEL LAYOUT
   Add this at the VERY BOTTOM of script.js
   ========================================================== */

(function () {

  function buildReferenceShowreel() {

    const section = document.querySelector("#showreel");
    if (!section) return;

    const shell = section.querySelector(".showreel-shell");
    const copy = section.querySelector(".showreel-copy");
    const art = section.querySelector(".showreel-art");
    const scene = section.querySelector(".showreel-object-scene");
    const stats = section.querySelector(".showreel-stats");

    if (!shell || !copy || !art || !scene || !stats) return;

    /* ------------------------------------------------------
       LEFT SIDE
       ------------------------------------------------------ */

    const eyebrow = copy.querySelector(".eyebrow");
    const heading = copy.querySelector("h2");
    const lead = copy.querySelector(".showreel-lead");
    const trigger = copy.querySelector(".showreel-trigger");

    if (eyebrow) {
      eyebrow.textContent = "WHO WE ARE";
    }

    if (heading) {
      heading.innerHTML =
        'CREATIVITY<br>MEETS<br><span>STRATEGY.</span>';
    }

    if (lead) {
      lead.textContent =
        "We combine creative thinking with a strong production mindset—building work that is visually engaging, strategically relevant, and executable in the real world.";
    }

    if (trigger) {

      trigger.innerHTML = `
        <span class="showreel-play">▶</span>
        <span>WATCH OUR SHOWREEL</span>
        <span aria-hidden="true">↗</span>
      `;

    }


    /* ------------------------------------------------------
       CENTER — FEATURED PROJECT
       ------------------------------------------------------ */

    if (!scene.querySelector(".featured-project-label")) {

      const label = document.createElement("div");

      label.className =
        "featured-project-label";

      label.textContent =
        "FEATURED PROJECT";

      scene.appendChild(label);

    }


    /* REAL MP4 CUBE */

    if (!scene.querySelector(".reference-cube-video")) {

      const video =
        document.createElement("video");

      video.className =
        "reference-cube-video";

      video.src =
        "cube-loop.mp4";

      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      video.setAttribute(
        "autoplay",
        ""
      );

      video.setAttribute(
        "loop",
        ""
      );

      video.setAttribute(
        "muted",
        ""
      );

      video.setAttribute(
        "playsinline",
        ""
      );

      video.setAttribute(
        "preload",
        "auto"
      );

      scene.appendChild(video);


      /*
       Safari sometimes needs play()
       after DOM insertion.
      */

      const startVideo = () => {

        const playPromise =
          video.play();

        if (
          playPromise &&
          typeof playPromise.catch === "function"
        ) {

          playPromise.catch(() => {});

        }

      };

      video.addEventListener(
        "canplay",
        startVideo,
        { once:true }
      );

      startVideo();

    }


    /* bottom tagline */

    if (!scene.querySelector(".reference-project-tagline")) {

      const tagline =
        document.createElement("div");

      tagline.className =
        "reference-project-tagline";

      tagline.innerHTML =
        "IDEA <b>•</b> PLAN <b>•</b> CREATE <b>•</b> IMPACT";

      scene.appendChild(tagline);

    }


    /* ------------------------------------------------------
       RIGHT SIDE — SERVICES
       ------------------------------------------------------ */

    let services =
      shell.querySelector(".reference-services");

    if (!services) {

      services =
        document.createElement("div");

      services.className =
        "reference-services";


      services.innerHTML = `

        <article class="reference-service-card">

          <div
            class="reference-service-icon"
            aria-hidden="true"
          >
            ◎
          </div>

          <h3>
            BRAND BUILDING<br>
            &amp; STRATEGY
          </h3>

          <p>
            Concept development, positioning,
            narrative, and campaign direction.
          </p>

        </article>


        <article class="reference-service-card">

          <div
            class="reference-service-icon"
            aria-hidden="true"
          >
            ♧
          </div>

          <h3>
            CREATIVE DIGITAL<br>
            SOLUTION
          </h3>

          <p>
            Content, visual communication,
            digital activation, and audience
            experience.
          </p>

        </article>


        <article class="reference-service-card">

          <div
            class="reference-service-icon"
            aria-hidden="true"
          >
            ▷
          </div>

          <h3>
            EVENT &amp; CAMPAIGN<br>
            PRODUCTION
          </h3>

          <p>
            Planning, creative direction,
            execution, and documentation.
          </p>

        </article>

      `;


      /*
       Insert directly after center artwork.
       CSS grid then positions it on the right.
      */

      art.insertAdjacentElement(
        "afterend",
        services
      );

    }


    /* ------------------------------------------------------
       STATS
       ------------------------------------------------------ */

    const statItems =
      stats.querySelectorAll(":scope > div");

    const statData = [

      {
        number:"100+",
        label:"EVENTS PRODUCED"
      },

      {
        number:"50+",
        label:"BRANDS TRUSTED"
      },

      {
        number:"15+",
        label:"YEARS OF EXPERIENCE"
      },

      {
        number:"1",
        label:"VISION : IMPACT"
      }

    ];


    statItems.forEach(
      (item,index) => {

        if (!statData[index]) return;

        const strong =
          item.querySelector("strong");

        const span =
          item.querySelector("span");

        if (strong) {
          strong.textContent =
            statData[index].number;
        }

        if (span) {
          span.textContent =
            statData[index].label;
        }

      }
    );


    /* ------------------------------------------------------
       REMOVE DUPLICATE ABOUT SECTION
       ------------------------------------------------------

       Reference already includes WHO WE ARE inside showreel.
       We hide the old About section so it isn't repeated.
       Navigation #about will point to this new section.
       ------------------------------------------------------ */

    const oldAbout =
      document.querySelector("#about");

    if (oldAbout) {

      oldAbout.style.display =
        "none";

    }


    /*
     Give this section the About anchor without
     breaking the existing showreel ID.
    */

    if (!document.querySelector("#reference-about-anchor")) {

      const anchor =
        document.createElement("span");

      anchor.id =
        "reference-about-anchor";

      anchor.style.position =
        "absolute";

      anchor.style.top =
        "-90px";

      section.prepend(anchor);

    }


    /*
     Redirect About Us nav link
     to this section.
    */

    document
      .querySelectorAll('a[href="#about"]')
      .forEach(link => {

        link.setAttribute(
          "href",
          "#showreel"
        );

      });

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      buildReferenceShowreel
    );

  } else {

    buildReferenceShowreel();

  }

})();
/* ==========================================================
   CREATIVE JOURNEY SECTION
   Add this at the VERY BOTTOM of script.js
   ========================================================== */

(function () {

  function buildCreativeJourney() {

    /*
      prevent duplicate section
    */

    if (
      document.querySelector(
        "#creativeJourney"
      )
    ) {
      return;
    }


    /*
      find showreel/reference section
    */

    const showreel =
      document.querySelector(
        "#showreel"
      );

    if (!showreel) return;


    /*
      create section
    */

    const journey =
      document.createElement(
        "section"
      );

    journey.id =
      "creativeJourney";


    journey.innerHTML = `

      <div class="journey-shell">


        <!-- =========================
             TOP
        ========================== -->

        <div class="journey-top">


          <div class="journey-copy">

            <p class="journey-eyebrow">
              → &nbsp; OUR CREATIVE JOURNEY
            </p>

            <h2 class="journey-title">

              WE DON'T JUST
              <br>

              CREATE EVENTS.

              <br>

              <span>
                WE DESIGN EXPERIENCES
                <br>
                PEOPLE REMEMBER.
              </span>

            </h2>


            <p class="journey-intro">

              Every project starts with an insight,
              becomes an idea, and evolves into an
              experience built to connect brands
              with real people.

            </p>

          </div>


          <div
            class="journey-image"
            aria-hidden="true"
          ></div>


        </div>



        <!-- =========================
             FLOW
        ========================== -->

        <div class="journey-flow">


          <!-- 01 -->

          <article class="journey-step">

            <div class="journey-number">
              01
            </div>


            <div class="journey-node">

              <span class="journey-dot">
              </span>

            </div>


            <h3>
              INSIGHT
            </h3>


            <p>

              We explore audience,
              culture, and market data
              to uncover meaningful
              opportunities.

            </p>


            <div
              class="journey-icon"
              aria-hidden="true"
            >
              ◉
            </div>

          </article>



          <!-- 02 -->

          <article class="journey-step">

            <div class="journey-number">
              02
            </div>


            <div class="journey-node">

              <span class="journey-dot">
              </span>

            </div>


            <h3>
              BIG IDEA
            </h3>


            <p>

              We turn insight into
              a powerful creative idea
              that has relevance and
              emotional impact.

            </p>


            <div
              class="journey-icon"
              aria-hidden="true"
            >
              ♧
            </div>

          </article>



          <!-- 03 -->

          <article class="journey-step">

            <div class="journey-number">
              03
            </div>


            <div class="journey-node">

              <span class="journey-dot">
              </span>

            </div>


            <h3>
              EXPERIENCE DESIGN
            </h3>


            <p>

              We design the experience
              journey, touchpoints, and
              interactions that engage
              and inspire.

            </p>


            <div
              class="journey-icon"
              aria-hidden="true"
            >
              ✎
            </div>

          </article>



          <!-- 04 -->

          <article class="journey-step">

            <div class="journey-number">
              04
            </div>


            <div class="journey-node">

              <span class="journey-dot">
              </span>

            </div>


            <h3>
              EXECUTION
            </h3>


            <p>

              We bring the idea to life
              with precise planning,
              production, and flawless
              execution.

            </p>


            <div
              class="journey-icon"
              aria-hidden="true"
            >
              ⚙
            </div>

          </article>



          <!-- 05 -->

          <article class="journey-step">

            <div class="journey-number">
              05
            </div>


            <div class="journey-node">

              <span class="journey-dot">
              </span>

            </div>


            <h3>
              IMPACT
            </h3>


            <p>

              We measure results,
              audience response,
              and long-term impact
              for real growth.

            </p>


            <div
              class="journey-icon"
              aria-hidden="true"
            >
              ◎
            </div>

          </article>


        </div>



        <!-- =========================
             BOTTOM MESSAGE
        ========================== -->

        <div class="journey-bottom">


          <div
            class="journey-bottom-image"
            aria-hidden="true"
          ></div>
/* ==========================================================
   CREATIVE JOURNEY BOTTOM CLEANUP
   ========================================================== */

(function () {

  function cleanJourneyBottomImage() {

    const bottomImage =
      document.querySelector(
        "#creativeJourney .journey-bottom-image"
      );

    if (!bottomImage) return;

    bottomImage.innerHTML = "";

    bottomImage
      .querySelectorAll(
        "button, .play, .showreel-play, svg"
      )
      .forEach(el => el.remove());

  }

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      cleanJourneyBottomImage
    );

  } else {

    cleanJourneyBottomImage();

  }

})();

          <div class="journey-bottom-copy">

            <h3>

              IDEAS ARE ONLY THE BEGINNING.

              <span>
                WE MAKE THEM HAPPEN.
              </span>

            </h3>

          </div>


        </div>


      </div>

    `;


    /*
      insert immediately after showreel
    */

    showreel.insertAdjacentElement(
      "afterend",
      journey
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      buildCreativeJourney
    );

  } else {

    buildCreativeJourney();

  }

})();
/* ==========================================================
   REFERENCE SHOWREEL LAYOUT
   Add this at the VERY BOTTOM of script.js
   ========================================================== */

(function () {

  function buildReferenceShowreel() {

    const section = document.querySelector("#showreel");
    if (!section) return;

    const shell = section.querySelector(".showreel-shell");
    const copy = section.querySelector(".showreel-copy");
    const art = section.querySelector(".showreel-art");
    const scene = section.querySelector(".showreel-object-scene");
    const stats = section.querySelector(".showreel-stats");

    if (!shell || !copy || !art || !scene || !stats) return;

    /* ------------------------------------------------------
       LEFT SIDE
       ------------------------------------------------------ */

    const eyebrow = copy.querySelector(".eyebrow");
    const heading = copy.querySelector("h2");
    const lead = copy.querySelector(".showreel-lead");
    const trigger = copy.querySelector(".showreel-trigger");

    if (eyebrow) {
      eyebrow.textContent = "WHO WE ARE";
    }

    if (heading) {
      heading.innerHTML =
        'CREATIVITY<br>MEETS<br><span>STRATEGY.</span>';
    }

    if (lead) {
      lead.textContent =
        "We combine creative thinking with a strong production mindset—building work that is visually engaging, strategically relevant, and executable in the real world.";
    }

    if (trigger) {

      trigger.innerHTML = `
        <span class="showreel-play">▶</span>
        <span>WATCH OUR SHOWREEL</span>
        <span aria-hidden="true">↗</span>
      `;

    }


    /* ------------------------------------------------------
       CENTER — FEATURED PROJECT
       ------------------------------------------------------ */

    if (!scene.querySelector(".featured-project-label")) {

      const label = document.createElement("div");

      label.className =
        "featured-project-label";

      label.textContent =
        "FEATURED PROJECT";

      scene.appendChild(label);

    }


    /* REAL MP4 CUBE */

    if (!scene.querySelector(".reference-cube-video")) {

      const video =
        document.createElement("video");

      video.className =
        "reference-cube-video";

      video.src =
        "cube-loop.mp4";

      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;

      video.setAttribute(
        "autoplay",
        ""
      );

      video.setAttribute(
        "loop",
        ""
      );

      video.setAttribute(
        "muted",
        ""
      );

      video.setAttribute(
        "playsinline",
        ""
      );

      video.setAttribute(
        "preload",
        "auto"
      );

      scene.appendChild(video);


      /*
       Safari sometimes needs play()
       after DOM insertion.
      */

      const startVideo = () => {

        const playPromise =
          video.play();

        if (
          playPromise &&
          typeof playPromise.catch === "function"
        ) {

          playPromise.catch(() => {});

        }

      };

      video.addEventListener(
        "canplay",
        startVideo,
        { once:true }
      );

      startVideo();

    }


    /* bottom tagline */

    if (!scene.querySelector(".reference-project-tagline")) {

      const tagline =
        document.createElement("div");

      tagline.className =
        "reference-project-tagline";

      tagline.innerHTML =
        "IDEA <b>•</b> PLAN <b>•</b> CREATE <b>•</b> IMPACT";

      scene.appendChild(tagline);

    }


    /* ------------------------------------------------------
       RIGHT SIDE — SERVICES
       ------------------------------------------------------ */

    let services =
      shell.querySelector(".reference-services");

    if (!services) {

      services =
        document.createElement("div");

      services.className =
        "reference-services";


      services.innerHTML = `

        <article class="reference-service-card">

          <div
            class="reference-service-icon"
            aria-hidden="true"
          >
            ◎
          </div>

          <h3>
            BRAND BUILDING<br>
            &amp; STRATEGY
          </h3>

          <p>
            Concept development, positioning,
            narrative, and campaign direction.
          </p>

        </article>


        <article class="reference-service-card">

          <div
            class="reference-service-icon"
            aria-hidden="true"
          >
            ♧
          </div>

          <h3>
            CREATIVE DIGITAL<br>
            SOLUTION
          </h3>

          <p>
            Content, visual communication,
            digital activation, and audience
            experience.
          </p>

        </article>


        <article class="reference-service-card">

          <div
            class="reference-service-icon"
            aria-hidden="true"
          >
            ▷
          </div>

          <h3>
            EVENT &amp; CAMPAIGN<br>
            PRODUCTION
          </h3>

          <p>
            Planning, creative direction,
            execution, and documentation.
          </p>

        </article>

      `;


      /*
       Insert directly after center artwork.
       CSS grid then positions it on the right.
      */

      art.insertAdjacentElement(
        "afterend",
        services
      );

    }


    /* ------------------------------------------------------
       STATS
       ------------------------------------------------------ */

    const statItems =
      stats.querySelectorAll(":scope > div");

    const statData = [

      {
        number:"100+",
        label:"EVENTS PRODUCED"
      },

      {
        number:"50+",
        label:"BRANDS TRUSTED"
      },

      {
        number:"15+",
        label:"YEARS OF EXPERIENCE"
      },

      {
        number:"1",
        label:"VISION : IMPACT"
      }

    ];


    statItems.forEach(
      (item,index) => {

        if (!statData[index]) return;

        const strong =
          item.querySelector("strong");

        const span =
          item.querySelector("span");

        if (strong) {
          strong.textContent =
            statData[index].number;
        }

        if (span) {
          span.textContent =
            statData[index].label;
        }

      }
    );


    /* ------------------------------------------------------
       REMOVE DUPLICATE ABOUT SECTION
       ------------------------------------------------------

       Reference already includes WHO WE ARE inside showreel.
       We hide the old About section so it isn't repeated.
       Navigation #about will point to this new section.
       ------------------------------------------------------ */

    const oldAbout =
      document.querySelector("#about");

    if (oldAbout) {

      oldAbout.style.display =
        "none";

    }


    /*
     Give this section the About anchor without
     breaking the existing showreel ID.
    */

    if (!document.querySelector("#reference-about-anchor")) {

      const anchor =
        document.createElement("span");

      anchor.id =
        "reference-about-anchor";

      anchor.style.position =
        "absolute";

      anchor.style.top =
        "-90px";

      section.prepend(anchor);

    }


    /*
     Redirect About Us nav link
     to this section.
    */

    document
      .querySelectorAll('a[href="#about"]')
      .forEach(link => {

        link.setAttribute(
          "href",
          "#showreel"
        );

      });

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      buildReferenceShowreel
    );

  } else {

    buildReferenceShowreel();

  }

})();

/* ==========================================================
   CREATIVE JOURNEY — CLEAN FINAL VERSION
   ========================================================== */

(function () {

  function buildCreativeJourney() {

    const existing = document.querySelector("#creativeJourney");

    if (existing) {
      existing.remove();
    }

    const showreel = document.querySelector("#showreel");

    if (!showreel) return;


    const journey = document.createElement("section");

    journey.id = "creativeJourney";


    journey.innerHTML = `

      <div class="journey-shell">


        <div class="journey-top">


          <div class="journey-copy">

            <p class="journey-eyebrow">
              → &nbsp; OUR CREATIVE JOURNEY
            </p>


            <h2 class="journey-title">

              WE DON'T JUST
              <br>

              CREATE EVENTS.

              <br>

              <span>
                WE DESIGN EXPERIENCES
                <br>
                PEOPLE REMEMBER.
              </span>

            </h2>


            <p class="journey-intro">

              Every project starts with an insight,
              becomes an idea, and evolves into an
              experience built to connect brands
              with real people.

            </p>

          </div>


          <div
            class="journey-image"
            aria-hidden="true"
          ></div>


        </div>



        <div class="journey-flow">


          <article class="journey-step">

            <div class="journey-number">
              01
            </div>

            <div class="journey-node">
              <span class="journey-dot"></span>
            </div>

            <h3>
              INSIGHT
            </h3>

            <p>
              We explore audience, culture,
              and market data to uncover
              meaningful opportunities.
            </p>

            <div class="journey-icon">
              ◉
            </div>

          </article>



          <article class="journey-step">

            <div class="journey-number">
              02
            </div>

            <div class="journey-node">
              <span class="journey-dot"></span>
            </div>

            <h3>
              BIG IDEA
            </h3>

            <p>
              We turn insight into a powerful
              creative idea that has relevance
              and emotional impact.
            </p>

            <div class="journey-icon">
              ♧
            </div>

          </article>



          <article class="journey-step">

            <div class="journey-number">
              03
            </div>

            <div class="journey-node">
              <span class="journey-dot"></span>
            </div>

            <h3>
              EXPERIENCE DESIGN
            </h3>

            <p>
              We design the experience journey,
              touchpoints, and interactions
              that engage and inspire.
            </p>

            <div class="journey-icon">
              ✎
            </div>

          </article>



          <article class="journey-step">

            <div class="journey-number">
              04
            </div>

            <div class="journey-node">
              <span class="journey-dot"></span>
            </div>

            <h3>
              EXECUTION
            </h3>

            <p>
              We bring the idea to life with
              precise planning, production,
              and flawless execution.
            </p>

            <div class="journey-icon">
              ⚙
            </div>

          </article>



          <article class="journey-step">

            <div class="journey-number">
              05
            </div>

            <div class="journey-node">
              <span class="journey-dot"></span>
            </div>

            <h3>
              IMPACT
            </h3>

            <p>
              We measure results, audience
              response, and long-term impact
              for real growth.
            </p>

            <div class="journey-icon">
              ◎
            </div>

          </article>


        </div>



        <div class="journey-bottom">


          <div
            class="journey-bottom-image"
            aria-hidden="true"
          ></div>


          <div class="journey-bottom-copy">

            <h3>
              IDEAS ARE ONLY THE BEGINNING.

              <span>
                WE MAKE THEM HAPPEN.
              </span>
            </h3>

          </div>


        </div>


      </div>

    `;


    showreel.insertAdjacentElement(
      "afterend",
      journey
    );

  }


  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      buildCreativeJourney
    );

  } else {

    buildCreativeJourney();

  }

})();
