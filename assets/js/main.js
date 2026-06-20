/* ===== Thai Lee — main.js (vanilla, guarded) ===== */
(function () {
  "use strict";

  /* ---- Preloader (always ends display:none; 1.2s fallback) ---- */
  var preloader = document.getElementById("preloader");
  function hidePre() {
    if (!preloader) return;
    preloader.classList.add("hide");
    setTimeout(function () { if (preloader) preloader.style.display = "none"; }, 520);
  }
  window.addEventListener("load", hidePre);
  setTimeout(hidePre, 1200); // safety fallback

  /* ---- Sticky nav shrink ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add("shrink");
    else header.classList.remove("shrink");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu (full-screen) ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  var mmClose = document.getElementById("mmClose");
  var lastFocus = null;

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add("open"); });
    if (burger) burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (mmClose) mmClose.focus();
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(function () { menu.hidden = true; }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (mmClose) mmClose.addEventListener("click", closeMenu);
  if (menu) {
    menu.querySelectorAll(".mm-links a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Scroll reveal (IntersectionObserver + fallback) ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  // hard safety: if anything still hidden after 2.5s, show it
  setTimeout(function () {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { el.classList.add("in"); });
  }, 2500);

  /* ---- Lightbox ---- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");
  var lbLast = null;

  function openLb(src, cap, alt) {
    if (!lb) return;
    lbLast = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || cap || "";
    lbCap.textContent = cap || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }
  function closeLb() {
    if (!lb) return;
    lb.hidden = true;
    lbImg.src = "";
    document.body.style.overflow = "";
    if (lbLast && lbLast.focus) lbLast.focus();
  }
  document.querySelectorAll(".g-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = btn.querySelector("img");
      openLb(btn.getAttribute("data-img"), btn.getAttribute("data-cap"), img ? img.alt : "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

  /* ---- Esc closes overlays ---- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (lb && !lb.hidden) closeLb();
      if (menu && menu.classList.contains("open")) closeMenu();
    }
  });

  /* ---- Toast ---- */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.hidden = true; }, 350);
    }, 4200);
  }

  /* ---- Reservation/Order form (demo: validate + summary + localStorage) ---- */
  var form = document.getElementById("reserveForm");
  var summary = document.getElementById("summary");
  var summaryList = document.getElementById("summaryList");

  function setError(field, msg) {
    var wrap = field.closest(".field");
    var err = form.querySelector('.err[data-for="' + field.id + '"]');
    if (wrap) wrap.classList.toggle("invalid", !!msg);
    if (err) err.textContent = msg || "";
  }

  function validate() {
    var ok = true;
    var name = form.name, phone = form.phone, guests = form.guests, type = form.type, date = form.date, time = form.time;
    if (!name.value.trim()) { setError(name, "فضلًا اكتب الاسم"); ok = false; } else setError(name, "");
    var digits = phone.value.replace(/\D/g, "");
    if (digits.length < 9) { setError(phone, "رقم جوال غير صحيح"); ok = false; } else setError(phone, "");
    if (!guests.value) { setError(guests, "اختر عدد الضيوف"); ok = false; } else setError(guests, "");
    if (!type.value) { setError(type, "اختر نوع الطلب"); ok = false; } else setError(type, "");
    if (!date.value) { setError(date, "اختر التاريخ"); ok = false; } else setError(date, "");
    if (!time.value) { setError(time, "اختر الوقت"); ok = false; } else setError(time, "");
    return ok;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstInvalid = form.querySelector(".field.invalid input, .field.invalid select");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      var data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        guests: form.guests.value,
        type: form.type.value,
        date: form.date.value,
        time: form.time.value,
        notes: form.notes.value.trim(),
        savedAt: new Date().toISOString()
      };

      // localStorage (demo only)
      try {
        var key = "thaiLeeReservations";
        var arr = JSON.parse(localStorage.getItem(key) || "[]");
        arr.push(data);
        localStorage.setItem(key, JSON.stringify(arr));
      } catch (err) { /* storage may be unavailable; ignore */ }

      // build summary
      if (summaryList) {
        var rows = [
          ["الاسم", data.name],
          ["الجوال", data.phone],
          ["نوع الطلب", data.type],
          ["عدد الضيوف", data.guests],
          ["التاريخ", data.date],
          ["الوقت", data.time]
        ];
        if (data.notes) rows.push(["ملاحظات", data.notes]);
        summaryList.innerHTML = rows.map(function (r) {
          return "<dt>" + r[0] + "</dt><dd>" + escapeHtml(r[1]) + "</dd>";
        }).join("");
      }
      if (summary) summary.hidden = false;
      showToast("تم استلام طلبك (تجريبي) ✓ سنحفظ نسخة على جهازك");
      form.reset();
      if (summary) summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // inline clear on input
    form.querySelectorAll("input,select,textarea").forEach(function (el) {
      el.addEventListener("input", function () { setError(el, ""); });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---- Year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
