// =============================
// FIFF — Enterprise SPA + Theme
// =============================

const TELEGRAM = "https://t.me/marzzXD";

const PAGES = ["home", "vps", "panel", "about"];

const ORDER_PRESETS = {
  vps: (planName) => ({
    kicker: "ORDER • VPS",
    title: planName ? `VPS Package — ${planName}` : "VPS Package",
    desc:
      "VPS adalah fondasi untuk bot Telegram, panel hosting, API, dan web app. " +
      "Kalau kamu ingin layanan yang stabil dan terlihat profesional, mulai dari VPS yang tepat. " +
      "Saya bantu pilih paket yang sesuai pemakaian supaya kamu tidak buang biaya untuk resource yang tidak terpakai.",
    list: [
      "Lokasi Singapore/Asia (latency lebih enak untuk ID)",
      "NVMe SSD (akses cepat, respon lebih stabil)",
      "Cocok untuk Bot Telegram, Panel Pterodactyl, API, Web",
      "Support Telegram untuk arahan dasar & best practice",
      "Upgrade mudah saat traffic atau service bertambah"
    ],
    note:
      "Catatan: paket terbaik itu yang sesuai kebutuhan. Kalau targetnya bot kecil, fokus stabil & jaringan. " +
      "Kalau targetnya panel ramai/multi-service, pilih yang punya headroom agar tidak cepat kehabisan resource.",
    tgText: `Halo marzz, saya mau order VPS${planName ? " (" + planName + ")" : ""}.`
  }),

  panel: (planName) => ({
    kicker: "ORDER • PANEL",
    title: planName ? `Panel Hosting — ${planName}` : "Panel Hosting",
    desc:
      "Panel Pterodactyl membuat pengelolaan bot dan aplikasi terasa rapi: start/stop, logs, dan resource limit. " +
      "Cocok untuk kamu yang ingin terlihat serius—baik untuk dipakai pribadi maupun dijadikan layanan/reseller.",
    list: [
      "Manajemen server lebih rapi: kontrol, log, dan monitoring",
      "Cocok untuk Node App, Bot Telegram, dan service kecil",
      "Lebih gampang scale saat user bertambah",
      "Mengurangi ketergantungan SSH (lebih aman & nyaman)",
      "Support Telegram jika butuh arahan penggunaan"
    ],
    note:
      "Catatan: panel itu meningkatkan impresi. Untuk jualan, orang lebih percaya kalau sistem kamu terlihat rapi dan terstruktur. " +
      "Panel membantu kamu menjaga layanan tetap stabil dan mudah di-maintain.",
    tgText: `Halo marzz, saya mau order Panel${planName ? " (" + planName + ")" : ""}.`
  })
};

// -----------------------------
// Helpers
// -----------------------------
function qs(sel, el = document) { return el.querySelector(sel); }
function qsa(sel, el = document) { return [...el.querySelectorAll(sel)]; }

function setActiveNav(page){
  qsa("[data-nav]").forEach(btn => {
    const isActive = btn.getAttribute("data-nav") === page;
    btn.classList.toggle("is-active", isActive);
    btn.classList.toggle("is-current", isActive); // for sidebar items
  });
}

function showPage(page){
  if (!PAGES.includes(page)) page = "home";

  qsa(".page").forEach(p => p.classList.remove("is-visible"));
  const el = qs(`#page-${page}`);
  if (el) el.classList.add("is-visible");

  // top nav active
  qsa(".nav .nav-pill").forEach(b => b.classList.remove("is-active"));
  const topBtn = qs(`.nav .nav-pill[data-nav="${page}"]`);
  if (topBtn) topBtn.classList.add("is-active");

  // sidebar active
  qsa(".sidebar .side-item").forEach(b => b.classList.remove("is-current"));
  const sideBtn = qs(`.sidebar .side-item[data-nav="${page}"]`);
  if (sideBtn) sideBtn.classList.add("is-current");

  // update hash
  history.replaceState(null, "", `#${page}`);
}

// -----------------------------
// Theme
// -----------------------------
function getSavedTheme(){
  return localStorage.getItem("fiff_theme") || "dark";
}

function setTheme(mode){
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("fiff_theme", mode);
}

function toggleTheme(){
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}

// -----------------------------
// Order Modal
// -----------------------------
const modal = qs("#orderModal");
const modalKicker = qs("#modalKicker");
const modalTitle = qs("#modalTitle");
const modalDesc = qs("#modalDesc");
const modalList = qs("#modalList");
const modalNote = qs("#modalNote");
const modalTelegram = qs("#modalTelegram");

function openOrder(type, planName){
  const presetFactory = ORDER_PRESETS[type];
  if (!presetFactory) return;

  const data = presetFactory(planName);

  modalKicker.textContent = data.kicker;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;

  modalList.innerHTML = "";
  data.list.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    modalList.appendChild(li);
  });

  modalNote.textContent = data.note;

  const msg = encodeURIComponent(data.tgText);
  modalTelegram.href = `${TELEGRAM}?text=${msg}`;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  // tiny focus effect
  document.body.style.overflow = "hidden";
}

function closeOrder(){
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Close events
qsa("[data-close]").forEach(el => el.addEventListener("click", closeOrder));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeOrder();
});

// -----------------------------
// Bind nav + actions
// -----------------------------
function bind(){
  // nav click
  qsa("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.nav));
  });

  // CTA button
  qs("#ctaBtn").addEventListener("click", () => {
    showPage("vps");
    setTimeout(() => openOrder("vps"), 160);
  });

  // theme
  qs("#themeBtn").addEventListener("click", toggleTheme);

  // open order
  qsa("[data-open-order]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-open-order");
      const plan = btn.getAttribute("data-plan") || null;
      openOrder(type, plan);
    });
  });

  // brand keyboard
  qs(".brand").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") showPage("home");
  });
}

// -----------------------------
// Fake latency (visual premium)
// -----------------------------
function startLatency(){
  const el = qs("#latencyText");
  if (!el) return;

  let base = 18 + Math.round(Math.random() * 24);
  el.textContent = String(base);

  setInterval(() => {
    const drift = (Math.random() * 8) - 4;
    base = Math.max(12, Math.min(55, Math.round(base + drift)));
    el.textContent = String(base);
  }, 1400);
}

// -----------------------------
// Init
// -----------------------------
(function init(){
  setTheme(getSavedTheme());

  bind();
  startLatency();

  const hash = (location.hash || "#home").replace("#", "");
  showPage(PAGES.includes(hash) ? hash : "home");
})();