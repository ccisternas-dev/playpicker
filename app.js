const $ = (selector) => document.querySelector(selector);
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
function announce(text) {
  const region = $("#activity-dialog").open
    ? $("#dialog-status")
    : $("#deck-announcement");
  region.textContent = text;
}
function focusDeck() {
  ($(".swipe-card") || $("#deck-restart") || $("#discover")).focus();
}
let activityTrigger = null;
let activityTriggerId = null;
let saved = new Set();
let storageAvailable = true;
try {
  const stored = JSON.parse(localStorage.getItem("playpicker-saved") || "[]");
  if (Array.isArray(stored))
    saved = new Set(stored.filter((id) => ACTIVITIES.some((a) => a.id === id)));
} catch {
  storageAvailable = false;
}
let category = "All";
let collection = false;
const seen = new Set();
const history = [];
let busy = false;
let suppressClickUntil = 0;
function filteredActivities() {
  const query = normalizeSearch($("#search").value.trim());
  const age = Number($("#age").value);
  return ACTIVITIES.map(localizeActivity).filter(
    (a) =>
      (!collection || saved.has(a.id)) &&
      (category === "All" || a.category === category) &&
      (!query ||
        normalizeSearch(
          [a.title, a.description, t(a.category), ...a.materials].join(" "),
        ).includes(query)) &&
      (!age || (age >= a.age[0] && age <= a.age[1])) &&
      (!$("#time").value || a.time <= Number($("#time").value)) &&
      (!$("#setting").value || a.setting === $("#setting").value) &&
      (!$("#mess").value || a.mess === $("#mess").value),
  );
}
function render() {
  const activities = filteredActivities();
  $("#saved-count").textContent = saved.size;
  $("#result-count").textContent = message("collection", activities.length);
  $("#browse-title").textContent = collection
    ? t("Your next little adventures")
    : t("Your next “let’s do that!”");
  $("#discover").classList.toggle("active", !collection);
  $("#saved").classList.toggle("active", collection);
  $("#discover").setAttribute("aria-pressed", String(!collection));
  $("#saved").setAttribute("aria-pressed", String(collection));
  document.querySelectorAll(".chip").forEach((c) => {
    c.classList.toggle("selected", c.dataset.category === category);
    c.setAttribute("aria-pressed", String(c.dataset.category === category));
  });
  $("#activity-grid").innerHTML = activities
    .map(
      (a) =>
        `<article class="card"><button class="save-button ${saved.has(a.id) ? "is-saved" : ""}" data-save="${escapeHTML(a.id)}" aria-label="${escapeHTML(textMessage(saved.has(a.id) ? "Unsave {title}" : "Save {title}", { title: a.title }))}" aria-pressed="${saved.has(a.id)}">${saved.has(a.id) ? "♥" : "♡"}</button><button class="card-open" data-open="${escapeHTML(a.id)}" aria-label="${escapeHTML(textMessage("View {title}", { title: a.title }))}"><div class="card-art" style="background:${a.color}">${illustration(a)}<span class="card-badge">${escapeHTML(a.badge)}</span></div><div class="card-body"><span class="card-category">${escapeHTML(t(a.category))}</span><h2>${escapeHTML(a.title)}</h2><p class="card-description">${escapeHTML(a.description)}</p><div class="card-meta"><span>◷ ${a.time} min</span><span>♧ ${escapeHTML(textMessage("Age range: {range} years", { range: a.age.join("–") }))}</span><span>${a.setting === "Outdoors" ? "☀" : "⌂"} ${escapeHTML(t(a.setting))}</span></div></div></button></article>`,
    )
    .join("");
  $("#activity-grid").hidden = !collection;
  $("#swipe-discovery").hidden = collection;
  $("#empty").hidden = !collection || activities.length > 0;
  renderDeck();
  const activeFilters =
    ["search", "age", "time", "setting", "mess"].filter(
      (id) => $("#" + id).value,
    ).length + (category !== "All" ? 1 : 0);
  $("#filter-count").textContent = activeFilters ? `(${activeFilters})` : "";
  $("#empty-message").textContent =
    collection && !saved.size
      ? t("Tap a heart on any activity to keep it here for another day.")
      : t(
          "No activities match just yet. Try a different filter or explore them all.",
        );
}
function toast(message, shouldAnnounce = true) {
  $("#toast").textContent = message;
  if (shouldAnnounce) announce(message);
}
function toggleSave(id) {
  saved.has(id) ? saved.delete(id) : saved.add(id);
  try {
    localStorage.setItem("playpicker-saved", JSON.stringify([...saved]));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  toast(
    storageAvailable
      ? saved.has(id)
        ? t("Saved for another little adventure ♡")
        : t("Removed from your collection")
      : t(
          "Your change is available for this visit only. Browser storage is unavailable.",
        ),
  );
  render();
  const button = $(".dialog-save");
  if (button && button.dataset.save === id) {
    button.textContent = saved.has(id)
      ? t("♥ Saved to my collection")
      : t("♡ Save to my collection");
    button.setAttribute("aria-pressed", String(saved.has(id)));
  }
}
function openActivity(id) {
  const original = ACTIVITIES.find((a) => a.id === id);
  const a = original && localizeActivity(original);
  if (!a) return;
  activityTrigger = document.activeElement;
  activityTriggerId = id;
  $("#dialog-content").innerHTML =
    `<div class="dialog-art" style="background:${a.color}">${illustration(a)}</div><div class="dialog-body"><span class="eyebrow">${escapeHTML(t(a.category))}</span><h2 id="dialog-title">${escapeHTML(a.title)}</h2><p>${escapeHTML(a.description)}</p><div class="detail-tags"><span>◷ ${escapeHTML(textMessage("Duration: {count} minutes", { count: new Intl.NumberFormat(language).format(a.time) }))}</span><span>${escapeHTML(textMessage("Age range: {range} years", { range: a.age.join("–") }))}</span><span>${escapeHTML(t(a.setting))}</span><span>${t(a.mess + " mess")}</span></div><h3>${t("Gather a few things")}</h3><ul>${a.materials.map((m) => `<li>${escapeHTML(m)}</li>`).join("")}</ul><h3>${t("Let’s make it happen")}</h3><ol>${a.steps.map((s) => `<li>${escapeHTML(s)}</li>`).join("")}</ol><p class="tip"><strong>${t("A little grown-up note")}</strong><br>${escapeHTML(a.tip)}</p><button class="primary dialog-save" data-save="${escapeHTML(a.id)}" aria-pressed="${saved.has(a.id)}">${saved.has(a.id) ? t("♥ Saved to my collection") : t("♡ Save to my collection")}</button></div>`;
  $("#dialog-status").textContent = "";
  $("#activity-dialog").showModal();
  $("#activity-dialog").scrollTop = 0;
  document.body.classList.add("modal-open");
}
function resetFilters() {
  ["search", "age", "time", "setting", "mess"].forEach(
    (id) => ($("#" + id).value = ""),
  );
  category = "All";
  render();
}
["search", "age", "time", "setting", "mess"].forEach((id) =>
  $("#" + id).addEventListener(id === "search" ? "input" : "change", () => {
    render();
    announce($("#result-count").textContent);
  }),
);
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  const save = e.target.closest("[data-save]");
  const chip = e.target.closest("[data-category]");
  if (open && Date.now() > suppressClickUntil && !busy)
    openActivity(open.dataset.open);
  if (save && !busy) {
    const id = save.dataset.save;
    toggleSave(id);
    if (!$("#activity-dialog").open) {
      const replacement = document.querySelector(`.card [data-save="${id}"]`);
      (replacement || $("#saved")).focus();
    }
  }
  if (chip) {
    category = chip.dataset.category;
    render();
    announce($("#result-count").textContent);
  }
});
$("#reset").addEventListener("click", () => {
  resetFilters();
  announce($("#result-count").textContent);
});
$("#empty-reset").addEventListener("click", () => {
  collection = false;
  resetFilters();
  focusDeck();
});
$("#discover").addEventListener("click", () => {
  collection = false;
  render();
});
$("#saved").addEventListener("click", () => {
  collection = true;
  resetFilters();
  $(".browse").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
});

$(".close-dialog").addEventListener("click", () =>
  $("#activity-dialog").close(),
);
$("#activity-dialog").addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (
    activityTrigger?.isConnected &&
    !activityTrigger.disabled &&
    activityTrigger.checkVisibility()
  )
    activityTrigger.focus();
  else {
    const replacement = document.querySelector(
      `[data-open="${activityTriggerId}"]`,
    );
    if (collection && replacement?.checkVisibility()) replacement.focus();
    else if (collection) $("#saved").focus();
    else focusDeck();
  }
});
$("#activity-dialog").addEventListener("click", (e) => {
  if (e.target === $("#activity-dialog")) {
    const r = e.target.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      e.target.close();
  }
});

function remainingActivities() {
  return filteredActivities().filter(
    (a) => !seen.has(a.id) && !saved.has(a.id),
  );
}
function renderDeck() {
  const remaining = remainingActivities();
  const a = remaining[0];
  $("#undo").disabled = !history.length || busy;
  ["pass", "like", "details"].forEach(
    (id) => ($("#" + id).disabled = !a || busy),
  );
  if (collection) return;
  $("#result-count").textContent = message("remaining", remaining.length);
  if (!a) {
    const hasMatches = filteredActivities().length > 0;
    $("#deck").innerHTML =
      `<div class="deck-empty"><span> ${hasMatches ? "♡" : "✳"}</span><h2>${hasMatches ? t("A little inspiration, collected.") : t("Let’s try a different mix.")}</h2><p>${hasMatches ? t("You’ve explored these ideas. Your favorites are waiting in your collection.") : t("No ideas match these filters. Give your next adventure a little more room.")}</p><button class="primary" id="deck-restart">${hasMatches ? t("Revisit passed activities") : t("Reset filters")}</button><button class="text-button" id="deck-collection">${t("View my collection →")}</button></div>`;
    $("#deck-restart").addEventListener("click", () => {
      if (hasMatches) {
        seen.clear();
        history.length = 0;
        if (!remainingActivities().length) {
          collection = true;
          resetFilters();
          $("#saved").focus();
          return;
        }
        render();
      } else resetFilters();
      focusDeck();
    });
    $("#deck-collection").addEventListener("click", () => {
      collection = true;
      resetFilters();
      $("#saved").focus();
    });
    return;
  }
  $("#deck").innerHTML =
    `<div class="stack-card stack-back" aria-hidden="true"></div><div class="stack-card stack-middle" aria-hidden="true"></div><article class="swipe-card" aria-label="${escapeHTML(a.title)}" tabindex="0" aria-describedby="swipe-help"><div class="swipe-visual" style="background:${a.color}"><span class="swipe-category">${escapeHTML(t(a.category))}</span><span class="swipe-stamp save-stamp" aria-hidden="true">${t("LOVE IT")}</span><span class="swipe-stamp pass-stamp" aria-hidden="true">${t("NOT TODAY")}</span>${illustration(a)}<span class="swipe-badge">✧ &nbsp; ${escapeHTML(a.badge)}</span></div><div class="swipe-body"><span class="swipe-kicker">${t("A LITTLE CREATIVITY GOES A LONG WAY")}</span><h2>${escapeHTML(a.title)}</h2><p>${escapeHTML(a.description)}</p><div class="swipe-tags"><span>◷ ${a.time} min</span><span>♧ ${escapeHTML(textMessage("Age range: {range} years", { range: a.age.join("–") }))}</span><span>${a.setting === "Outdoors" ? "☀" : "⌂"} ${escapeHTML(t(a.setting))}</span><span>✳ ${t(a.mess + " mess")}</span></div><button class="card-details" data-open="${escapeHTML(a.id)}">${t("See what you’ll need")} <span>↗</span></button></div><span class="sr-only" id="swipe-help">${t("Use the left arrow to pass or right arrow to save. Use the buttons below as an alternative to swiping.")}</span></article>`;
  bindSwipe($(".swipe-card"));
}
function persistSaved() {
  try {
    localStorage.setItem("playpicker-saved", JSON.stringify([...saved]));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
}
async function choose(direction) {
  const a = remainingActivities()[0];
  const card = $(".swipe-card");
  if (!a || !card || busy || collection || $("#activity-dialog").open) return;
  busy = true;
  const restoreFocus =
    card.contains(document.activeElement) ||
    document.activeElement === card ||
    ["pass", "like"].includes(document.activeElement.id);
  ["pass", "like", "details", "undo"].forEach(
    (id) => ($("#" + id).disabled = true),
  );
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.style.transition = reduceMotion
    ? "none"
    : "transform 240ms ease, opacity 240ms ease";
  card.style.transform = `translateX(${direction === "save" ? 1 : -1}00%) rotate(${direction === "save" ? 18 : -18}deg)`;
  card.style.opacity = "0";
  if (!reduceMotion) await new Promise((resolve) => setTimeout(resolve, 240));
  history.push({ id: a.id, direction, wasSaved: saved.has(a.id) });
  seen.add(a.id);
  if (direction === "save") {
    saved.add(a.id);
    persistSaved();
    toast(
      storageAvailable
        ? t("It’s a little match! Saved to your collection ♥")
        : t(
            "Your change is available for this visit only. Browser storage is unavailable.",
          ),
      false,
    );
  }
  busy = false;
  render();
  const status = message(
    direction === "save" ? "saved" : "passed",
    remainingActivities().length,
    { title: a.title },
  );
  announce(
    direction === "save" && !storageAvailable
      ? status +
          " " +
          t(
            "Your change is available for this visit only. Browser storage is unavailable.",
          )
      : status,
  );
  if (restoreFocus) focusDeck();
}
function bindSwipe(card) {
  let drag = null;
  const reset = () => {
    card.style.transform = "";
    card.style.transition = "";
    card.classList.remove("dragging");
    card.querySelectorAll(".swipe-stamp").forEach((s) => (s.style.opacity = 0));
  };
  card.addEventListener("pointerdown", (e) => {
    if (
      busy ||
      !e.isPrimary ||
      (e.pointerType === "mouse" && e.button !== 0) ||
      e.target.closest("button")
    )
      return;
    drag = {
      x: e.clientX,
      y: e.clientY,
      id: e.pointerId,
      dx: 0,
      horizontal: false,
    };
  });
  card.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x,
      dy = e.clientY - drag.y;
    if (!drag.horizontal && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
      drag = null;
      reset();
      return;
    }
    if (!drag.horizontal && Math.abs(dx) > 10) {
      drag.horizontal = true;
      card.setPointerCapture(e.pointerId);
      card.classList.add("dragging");
    }
    if (!drag.horizontal) return;
    drag.dx = dx;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`;
    $(".save-stamp").style.opacity = dx > 0 ? Math.min(dx / 100, 1) : 0;
    $(".pass-stamp").style.opacity = dx < 0 ? Math.min(-dx / 100, 1) : 0;
  });
  card.addEventListener("pointerup", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { dx, horizontal } = drag;
    drag = null;
    if (card.hasPointerCapture(e.pointerId))
      card.releasePointerCapture(e.pointerId);
    if (horizontal) suppressClickUntil = Date.now() + 400;
    if (Math.abs(dx) > Math.min(90, card.offsetWidth * 0.24))
      choose(dx > 0 ? "save" : "pass");
    else reset();
  });
  card.addEventListener("pointercancel", () => {
    drag = null;
    reset();
  });
  card.addEventListener("lostpointercapture", (e) => {
    if (e.target === card && drag) {
      drag = null;
      reset();
    }
  });
  card.addEventListener("keydown", (e) => {
    if (e.target !== card) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      choose(e.key === "ArrowRight" ? "save" : "pass");
    }
  });
}
$("#pass").addEventListener("click", () => choose("pass"));
$("#like").addEventListener("click", () => choose("save"));
$("#details").addEventListener("click", () => {
  const a = remainingActivities()[0];
  if (a && !busy) openActivity(a.id);
});
$("#undo").addEventListener("click", () => {
  if (busy || !history.length) return;
  const last = history.pop();
  seen.delete(last.id);
  if (last.direction === "save" && !last.wasSaved) {
    saved.delete(last.id);
    persistSaved();
  }
  render();
  focusDeck();
  toast(t("Last swipe undone. Give it another look."));
});
translateStaticPage();
$("#language-toggle").addEventListener("click", () => {
  if (busy) return;
  language = language === "en" ? "es" : "en";
  let preferenceSaved = true;
  try {
    localStorage.setItem("playpicker-language", language);
  } catch {
    preferenceSaved = false;
  }
  translateStaticPage();
  $("#toast").textContent = "";
  $("#deck-announcement").textContent = "";
  render();
  if (!preferenceSaved)
    toast(
      t(
        "Your change is available for this visit only. Browser storage is unavailable.",
      ),
    );
});
$("#filter-toggle").addEventListener("click", () => {
  const open = $("#filter-panel").hidden;
  $("#filter-panel").hidden = !open;
  $("#filter-toggle").setAttribute("aria-expanded", String(open));
});
render();

let installPrompt;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  $("#native-install").hidden = false;
});
$("#install-help").addEventListener("click", () => {
  $("#install-dialog").showModal();
  document.body.classList.add("modal-open");
});
$("#install-close").addEventListener("click", () =>
  $("#install-dialog").close(),
);
$("#install-dialog").addEventListener("close", () =>
  document.body.classList.remove("modal-open"),
);
$("#native-install").addEventListener("click", async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  $("#native-install").hidden = true;
});
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  $("#native-install").hidden = true;
  $("#install-dialog").close();
  toast(t("PlayPicker is ready on your home screen."));
});
if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () =>
    navigator.serviceWorker
      .register("./sw.js")
      .catch(() =>
        console.info("Offline support is unavailable for this visit."),
      ),
  );
}

// Keep Tab within the modal, including dialogs with only a close control.
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...dialog.querySelectorAll(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]',
      ),
    ].filter((node) => node.checkVisibility());
    const first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
