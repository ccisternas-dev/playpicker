const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
};
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const filename = path.resolve(
    root,
    "." +
      url.pathname.replace(/^\/playpicker/, "").replace(/\/$/, "/index.html"),
  );
  if (!filename.startsWith(root + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const content = await fs.readFile(filename);
    response.writeHead(200, {
      "Content-Type": mime[path.extname(filename)] || "text/plain",
    });
    response.end(content);
  } catch {
    response.writeHead(404).end();
  }
});
let browser;
async function audit(page, label) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const result = await page.evaluate(async () =>
    axe.run(document, {
      runOnly: {
        type: "tag",
        values: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ],
      },
    }),
  );
  assert.deepEqual(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
    [],
    label,
  );
  console.log("axe passed:", label);
}
async function settle(page) {
  await page.waitForFunction(() => !busy);
}
async function run() {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}/playpicker/`;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base);
  await page.locator(".swipe-card").waitFor();
  const source = await fs.readFile(path.join(root, "app.js"), "utf8");
  const translationKeys = [
    ...source.matchAll(/\bt\(\s*(["'])(.*?)\1\s*\)/g),
  ].map((m) => m[2]);
  assert.deepEqual(
    await page.evaluate(
      (keys) => keys.filter((key) => !(key in SPANISH)),
      translationKeys,
    ),
    [],
    "Dynamic translation coverage",
  );
  assert.deepEqual(
    await page.evaluate(() =>
      [...document.querySelectorAll("[data-i18n]")]
        .map((n) => n.dataset.i18n)
        .filter((key) => !(key in SPANISH)),
    ),
    [],
    "Static translation coverage",
  );
  await page.evaluate(() => {
    for (const activity of ACTIVITIES) {
      const translated = SPANISH_ACTIVITIES[activity.id];
      for (const field of ["title", "description", "badge", "tip"])
        if (!translated?.[field])
          throw Error(`Missing ${activity.id}.${field}`);
      for (const field of ["steps", "materials"])
        if (translated[field].length !== activity[field].length)
          throw Error(`Incomplete ${activity.id}.${field}`);
    }
  });
  await page.keyboard.press("Tab");
  assert.equal(
    await page
      .locator(".skip-link")
      .evaluate((e) => e === document.activeElement),
    true,
  );
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator("main").evaluate((e) => e === document.activeElement),
    true,
  );
  for (const locale of ["en", "es"]) {
    if ((await page.locator("html").getAttribute("lang")) !== locale)
      await page.locator("#language-toggle").click();
    await audit(page, `${locale} discovery`);
    await page.screenshot({
      path: path.join(root, "test-results", `${locale}-desktop.png`),
      fullPage: true,
    });
    await page.locator("#filter-toggle").click();
    await audit(page, `${locale} filters`);
    await page
      .locator("#search")
      .fill(locale === "es" ? "carton" : "cardboard");
    assert.equal(await page.locator(".swipe-card").count(), 1);
    await page.locator("#search").fill("no-results-xyz");
    await audit(page, `${locale} empty search`);
    await page.locator("#reset").click();
    await page.locator("#filter-toggle").click();
    await page.locator(".card-details").click();
    await audit(page, `${locale} activity dialog`);
    await page.locator(".dialog-save").click();
    await page.keyboard.press("Escape");
    await page.waitForFunction(() =>
      document.activeElement?.matches(".swipe-card"),
    );
    await page.locator("#saved").click();
    await audit(page, `${locale} saved collection`);
    await page.locator(".card-open").first().click();
    await page.locator(".dialog-save").click();
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement?.id === "saved");
    await audit(page, `${locale} empty collection`);
    await page.locator("#discover").click();
    await page.locator("#install-help").click();
    await audit(page, `${locale} installation dialog`);
    // Native dialog contains tab focus and restores it to the opener.
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      assert.equal(
        await page
          .locator("#install-dialog")
          .evaluate((e) => e.contains(document.activeElement)),
        true,
      );
    }
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => document.activeElement?.id === "install-help",
    );
  }
  await page.locator("#pass").focus();
  await page.keyboard.press("Enter");
  await settle(page);
  assert.equal(
    await page
      .locator(".swipe-card")
      .evaluate((e) => e === document.activeElement),
    true,
    "Focus follows keyboard pass",
  );
  await page.locator("#undo").click();
  assert.equal(
    await page
      .locator(".swipe-card")
      .evaluate((e) => e === document.activeElement),
    true,
    "Focus follows undo",
  );
  await page.locator("#like").click();
  await settle(page);
  assert.equal(await page.locator("#saved-count").textContent(), "1");
  await page.locator("#language-toggle").click();
  assert.equal(await page.locator("#saved-count").textContent(), "1");
  await page.locator("#filter-toggle").click();
  await page.locator("#setting").selectOption("Outdoors");
  await page.locator("#language-toggle").click();
  assert.equal(await page.locator("#setting").inputValue(), "Outdoors");
  await page.locator("#reset").click();
  await page.locator("#filter-toggle").click();
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("lang"), "es");
  assert.equal(await page.locator("#saved-count").textContent(), "1");
  assert.equal(
    await page.evaluate(() => message("remaining", 1)),
    "1 idea por descubrir",
  );
  assert.equal(
    await page.evaluate(() => message("remaining", 2)),
    "2 ideas por descubrir",
  );
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Reflow ${width}`,
    );
    await page.locator("#filter-toggle").click();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Filter reflow ${width}`,
    );
    await page.locator("#filter-toggle").click();
  }
  await page.setViewportSize({ width: 320, height: 900 });
  // User text enlargement and the WCAG text-spacing values must not clip cards.
  await page.addStyleTag({
    content:
      "html{font-size:200%!important} *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}",
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "200% text with spacing at 320px",
  );
  assert.equal(
    await page
      .locator(".swipe-card")
      .evaluate((e) => e.scrollHeight <= e.clientHeight + 2),
    true,
    "No clipped card text",
  );
  await audit(page, "Spanish 320px enlarged text");
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await page.locator(".swipe-card").waitFor();
  await page.locator("#language-toggle").click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await context.setOffline(false);
  await page.locator("#filter-toggle").click();
  await page.locator("#search").fill("paper rockets");
  await page.locator("#filter-toggle").click();
  await page.locator("#pass").focus();
  await page.keyboard.press("Enter");
  await settle(page);
  assert.equal(
    await page
      .locator("#deck-restart")
      .evaluate((e) => e === document.activeElement),
    true,
    "Focus at deck exhaustion",
  );
  // Control targets, escaped activity content, and the non-drag alternatives remain usable.
  await page.locator("#deck-restart").click();
  assert.equal(
    await page
      .locator(".swipe-card")
      .evaluate((e) => e === document.activeElement),
    true,
    "Restart restores focus",
  );
  await page.reload();
  const unsafeTitle = '<img src=x onerror=alert(1)> "quoted" & text';
  await page.evaluate((title) => {
    ACTIVITIES[0].title = title;
    render();
  }, unsafeTitle);
  await page.locator("#saved").click();
  assert.equal(
    await page.locator(".card h2").first().textContent(),
    unsafeTitle,
  );
  assert.equal(
    await page.locator("#activity-grid img").count(),
    0,
    "Activity text is not interpreted as HTML",
  );
  await page.locator(".card-open").first().click();
  await page.keyboard.press("Escape");
  await page.locator(".card .save-button").first().click();
  assert.equal(
    await page.locator("#saved").evaluate((e) => e === document.activeElement),
    true,
    "Removing the last saved card restores focus",
  );
  await page.locator("#discover").click();
  await page.locator("#filter-toggle").click();
  assert.deepEqual(
    await page.evaluate(() =>
      [...document.querySelectorAll("button, input, select")]
        .filter((e) => e.checkVisibility())
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width < 43.9 || r.height < 43.9;
        })
        .map((e) => e.id || e.className),
    ),
    [],
    "44px app controls",
  );
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(base);
  await touchPage.locator(".swipe-card").waitFor();
  const session = await touchContext.newCDPSession(touchPage);
  async function touchSwipe(distance, canceled = false) {
    const box = await touchPage.locator(".swipe-card").boundingBox();
    const x = box.x + box.width / 2,
      y = box.y + 110;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 12; i++)
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + (distance * i) / 12, y }],
      });
    await session.send("Input.dispatchTouchEvent", {
      type: canceled ? "touchCancel" : "touchEnd",
      touchPoints: [],
    });
    await settle(touchPage);
  }
  await touchSwipe(25);
  assert.equal(
    await touchPage.locator(".card-details").getAttribute("data-open"),
    "cardboard-town",
  );
  await touchSwipe(120, true);
  assert.equal(
    await touchPage.locator(".card-details").getAttribute("data-open"),
    "cardboard-town",
  );
  await touchSwipe(-140);
  await touchPage.waitForFunction(
    () =>
      document.querySelector(".card-details").dataset.open === "nature-crowns",
  );
  await touchSwipe(140);
  assert.equal(await touchPage.locator("#saved-count").textContent(), "1");
  await touchPage.screenshot({
    path: path.join(root, "test-results", "touch-mobile.png"),
    fullPage: true,
  });
  await touchContext.close();
  assert.deepEqual(errors, [], "No browser errors");
  await page.screenshot({
    path: path.join(root, "test-results", "mobile.png"),
    fullPage: true,
  });
  // Storage denial must not prevent browsing or switching languages.
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw Error("denied");
    };
    Storage.prototype.setItem = () => {
      throw Error("denied");
    };
  });
  const fallback = await blocked.newPage();
  await fallback.goto(base);
  await fallback.locator("#language-toggle").click();
  assert.equal(await fallback.locator("html").getAttribute("lang"), "es");
  await fallback.locator("#like").click();
  await fallback.waitForFunction(() => !busy);
  assert.equal(await fallback.locator("#saved-count").textContent(), "1");
  await blocked.close();
  console.log(
    "PASS: translations, keyboard/focus, filters, collection, reflow, spacing, reduced motion, offline and unavailable storage.",
  );
}
run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    server.close();
  });
