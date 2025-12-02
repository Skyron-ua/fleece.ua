/* ========== CONFIG ========== */
const CONFIG = {
  PRICE: 999,
  PRODUCT_NAME: "PolarFleece — чоловічий костюм",
  CONTACT: {
    TG_USERNAME: "Skyron_ua",
    VIBER_PHONE: "+380733337278",
    VIBER_WEB: "https://viber.me/Skyron_ua",
    SUPPORT_PHONE: "+380733337278"
  },
  // Примеры имён файлов: замените на реальные названия ваших 4:5 картинок
  COLORS: [
    { id: "black", name: "Чорний", hex: "#0b0b0b", images: ["images/1.png","images/2.png"], price: 999 },
    { id: "anthracite", name: "Антрацит", hex: "#616267", images: ["images/10.png","images/11.png"], price: 999 },
    { id: "beige", name: "Беж", hex: "#d6c7b1", images: ["images/20.png","images/21.png"], price: 999 },
    { id: "emerald", name: "Смарагд", hex: "#00a86b", images: ["images/50.png"], price: 999 }
  ],
  DELIVERY_TEXT: "Доставка: Нова Пошта, 1–3 дні"
};

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const encode = s => encodeURIComponent(s);

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
  if ($("#priceValue")) $("#priceValue").textContent = `${CONFIG.PRICE} грн`;
  if ($("#supportPhone")) {
    $("#supportPhone").textContent = CONFIG.CONTACT.SUPPORT_PHONE.replace(/\+?380?/, '+380 ');
    $("#supportPhone").href = `tel:${CONFIG.CONTACT.SUPPORT_PHONE}`;
  }

  const swatches = $("#swatches");
  const catalogGrid = $("#catalogGrid");
  const colorSelect = $("#colorSelect");

  CONFIG.COLORS.forEach((c, i) => {
    // swatch
    const sw = document.createElement("button");
    sw.className = "swatch";
    sw.style.background = c.hex;
    sw.dataset.id = c.id;
    sw.title = c.name;
    if (i === 0) sw.classList.add("active");
    swatches && swatches.appendChild(sw);

    // catalog card
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${c.images[0]}" alt="${c.name}">
      <div class="meta">
        <div class="name">${CONFIG.PRODUCT_NAME}</div>
        <div class="price">${c.price} грн</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="color:var(--muted);font-size:13px">${c.name}</div>
        <button class="btn btn-small btn-primary" data-color="${c.id}">Вибрати</button>
      </div>
    `;
    catalogGrid && catalogGrid.appendChild(card);

    // select option
    if (colorSelect) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      colorSelect.appendChild(opt);
    }
  });

  setupSwatches();
  bindCatalogButtons();
  selectColor(CONFIG.COLORS[0].id);
  setupForm();
  startCountdown(60 * 59);

  if ($("#tgLink")) $("#tgLink").href = `https://t.me/${CONFIG.CONTACT.TG_USERNAME}`;
  if ($("#viberLink")) $("#viberLink").href = CONFIG.CONTACT.VIBER_WEB;

  // consultation buttons
  const btnTG = $("#btnConsultTG");
  const btnViber = $("#btnConsultViber");
  const greet = "👋 Вітаємо у Skyron.ua. Чим я можу вам допомогти?";

  if (btnTG) btnTG.addEventListener("click", () => {
    const tgUrl = `https://t.me/${CONFIG.CONTACT.TG_USERNAME}?text=${encode(greet)}`;
    window.open(tgUrl, "_blank");
  });

  if (btnViber) btnViber.addEventListener("click", () => {
    // Try viber protocol first (mobile), then web fallback
    const viberProto = `viber://chat?number=${CONFIG.CONTACT.VIBER_PHONE}`;
    const viberWeb = `https://viber.me/${CONFIG.CONTACT.VIBER_PHONE.replace(/[^\d+]/g,'')}?text=${encode(greet)}`;
    // open web link (works in most browsers)
    window.open(viberWeb, "_blank");
  });
});

/* ---------- color & carousel ---------- */
let activeImages = [];
let currentIndex = 0;

function selectColor(id) {
  const color = CONFIG.COLORS.find(c => c.id === id);
  if (!color) return;

  $$(".swatch").forEach(s => s.classList.toggle("active", s.dataset.id === id));

  activeImages = Array.isArray(color.images) && color.images.length ? color.images.slice() : ["images/placeholder_1080x1350.jpg"];
  currentIndex = 0;
  updateMainImage();

  if ($("#summaryColor")) $("#summaryColor").textContent = color.name;
  if ($("#priceValue")) $("#priceValue").textContent = `${color.price} грн`;
  if ($("#colorSelect")) $("#colorSelect").value = id;

  updateCarouselUI();
  updateSummary();
}

function updateMainImage() {
  const main = $("#mainImage");
  if (!main) return;
  main.src = activeImages[currentIndex];
  const color = CONFIG.COLORS.find(c => c.images && c.images.includes(activeImages[currentIndex]));
  main.alt = color ? color.name : CONFIG.PRODUCT_NAME;
  updateCarouselCounter();
}

function updateCarouselUI() {
  const controls = $("#carouselControls");
  const counter = $("#carouselCounter");
  if (!activeImages || activeImages.length <= 1) {
    if (controls) controls.style.display = "none";
    if (counter) counter.style.display = "none";
  } else {
    if (controls) controls.style.display = "flex";
    if (counter) counter.style.display = "block";
  }
  updateCarouselCounter();
}

function updateCarouselCounter(){
  const counter = $("#carouselCounter");
  if(!counter) return;
  counter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
}

const nextBtn = $("#nextImg");
const prevBtn = $("#prevImg");
if (nextBtn) nextBtn.addEventListener("click", () => {
  if (!activeImages || activeImages.length === 0) return;
  currentIndex = (currentIndex + 1) % activeImages.length;
  updateMainImage();
});
if (prevBtn) prevBtn.addEventListener("click", () => {
  if (!activeImages || activeImages.length === 0) return;
  currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
  updateMainImage();
});

function setupSwatches() {
  $$(".swatch").forEach(s => {
    s.addEventListener("click", () => selectColor(s.dataset.id));
  });
}

function bindCatalogButtons() {
  $$("#catalogGrid .btn-primary").forEach(btn => {
    btn.addEventListener("click", () => {
      selectColor(btn.dataset.color);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

/* ---------- form ---------- */
function setupForm() {
  const form = $("#orderForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = gatherForm();
    if (!data) return;

    // Build order text
    const prepay = document.querySelector('input[name="prepay"]:checked')?.value === 'full' ? 'Повна передоплата' : 'Мінімальна передоплата 100 грн';
    const text = `Замовлення:%0AТовар: ${CONFIG.PRODUCT_NAME}%0AКолір: ${data.colorName}%0AЗріст: ${data.height} см%0AВага: ${data.weight} кг%0AК-ть: ${data.qty}%0AОплата: ${prepay}%0AІм'я: ${data.name}%0AТелефон: ${data.phone}%0AАдреса: ${data.address}%0A${CONFIG.DELIVERY_TEXT}`;

    const tgUrl = `https://t.me/${CONFIG.CONTACT.TG_USERNAME}?text=${text}`;

    // open Telegram chat (user will see prefilled message ready to send)
    window.open(tgUrl, "_blank");

    // show result message to user
    const res = $("#formResult");
    if (res) {
      res.textContent = "Заявка підготовлена — відкриваємо Telegram. Підтвердіть відправку у вікні Telegram.";
      setTimeout(() => res.textContent = "", 7000);
    }
  });

  // update summary when fields change
  const height = $("#height");
  const weight = $("#weight");
  const qty = $("#qty");

  [height, weight, qty, $("#colorSelect")].forEach(el => {
    if (!el) return;
    el.addEventListener("input", updateSummary);
    el.addEventListener("change", updateSummary);
  });
}

function gatherForm() {
  const name = ($("#name") && $("#name").value.trim()) || "";
  const phone = ($("#phone") && $("#phone").value.trim()) || "";
  const height = ($("#height") && $("#height").value.trim()) || "";
  const weight = ($("#weight") && $("#weight").value.trim()) || "";
  const qty = Number($("#qty") && $("#qty").value) || 1;
  const address = ($("#address") && $("#address").value.trim()) || "";
  const colorId = ($("#colorSelect") && $("#colorSelect").value) || "";

  if (!name || !phone || !height || !weight || !address || !colorId) {
    alert("Будь ласка, заповніть усі обов'язкові поля.");
    return null;
  }

  const color = CONFIG.COLORS.find(c => c.id === colorId) || { name: "—" };
  return { name, phone, height, weight, qty, address, colorName: color.name };
}

function updateSummary() {
  const qty = Number($("#qty") && $("#qty").value) || 1;
  const height = ($("#height") && $("#height").value) || "—";
  const weight = ($("#weight") && $("#weight").value) || "—";
  const colorName = ($("#colorSelect") && $("#colorSelect").selectedOptions[0] && $("#colorSelect").selectedOptions[0].textContent) || ($("#summaryColor" && $("#summaryColor").textContent) || "—");

  if ($("#summaryHeight")) $("#summaryHeight").textContent = height;
  if ($("#summaryWeight")) $("#summaryWeight").textContent = weight;
  if ($("#summaryColor")) $("#summaryColor").textContent = colorName;
  if ($("#summaryTotal")) $("#summaryTotal").textContent = `${CONFIG.PRICE * qty} грн`;
}

/* ---------- timer ---------- */
function startCountdown(seconds) {
  const el = $("#timer");
  if (!el) return;
  let s = Number(seconds) || 0;

  function tick() {
    if (s <= 0) {
      el.textContent = "00:00:00";
      return;
    }
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    el.textContent = `${hh}:${mm}:${ss}`;
    s = s - 1;
  }

  tick();
  const id = setInterval(() => {
    if (s <= 0) {
      clearInterval(id);
      tick();
    } else {
      tick();
    }
  }, 1000);
}