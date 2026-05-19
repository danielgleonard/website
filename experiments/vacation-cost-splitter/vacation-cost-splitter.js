const TOTAL = 3950.44;
let partnerShare = 1.00;
let premiumShare = 2.00;
let trundles = ["Dan","Robbie","Kenneth","Trey","Chris","Sam","Justin"];

function totalPpl() { return trundles.length + 4; }

function calcCosts(ps, pr) {
  const ts = trundles.length + 1 + 2*ps + pr;
  const cpp = TOTAL / ts;
  return {small:cpp, partner:ps*cpp, transatlantic:cpp, premium:pr*cpp, cpp};
}

function removePerson(idx) {
  trundles.splice(idx, 1);
  buildGrid();
}

function addPerson() {
  const inp = document.getElementById("new-name");
  const name = inp.value.trim();
  if (!name) return;
  trundles.push(name);
  inp.value = "";
  buildGrid();
}

function buildGrid() {
  const costs = calcCosts(partnerShare, premiumShare);
  const maxAmt = Math.max(costs.small, costs.partner, costs.premium);
  const evenly = TOTAL / totalPpl();

  document.getElementById("base-rate").textContent = "$" + costs.cpp.toFixed(2);
  document.getElementById("guest-label").textContent = totalPpl() + " people · even split";
  document.getElementById("even-split").textContent = "$" + evenly.toFixed(2);
  document.getElementById("couple-label").textContent = partnerShare.toFixed(2) + "× each";
  document.getElementById("premium-label").textContent = premiumShare.toFixed(2) + "×";

  function diffMeta(amount) {
    const d = amount - evenly;
    return {
      str: (d >= 0 ? "+" : "−") + "$" + Math.abs(d).toFixed(0) + " vs even",
      color: d > 0.5 ? "var(--color-text-danger)" : d < -0.5 ? "var(--color-text-success)" : "var(--color-text-tertiary)"
    };
  }

  function barW(amount) { return Math.round(amount / maxAmt * 100); }

  function soloCard(id, name, badge, bg, txt, bar, amount, mult, locked) {
    const dm = diffMeta(amount);
    return `<div class="pcard">
      <p style="font-size:14px;font-weight:500;margin:0 0 6px;color:var(--color-text-primary);">${name}</p>
      <span class="badge" style="background:${bg};color:${txt};">${badge}</span>
      <p style="font-size:21px;font-weight:500;margin:10px 0 2px;color:var(--color-text-primary);" id="amount-${id}">$${amount.toFixed(2)}</p>
      <p style="font-size:11px;color:var(--color-text-tertiary);margin:0;">
        <span id="mult-${id}">${mult.toFixed(2)}×${locked?" 🔒":""}</span>
        &nbsp;<span id="diff-${id}" style="color:${dm.color};">${dm.str}</span>
      </p>
      <div class="bar-track"><div class="bar-fill" id="bar-${id}" style="width:${barW(amount)}%;background:${bar};"></div></div>
    </div>`;
  }

  const trundleCards = trundles.map((name, idx) => {
    const dm = diffMeta(costs.small);
    return `<div class="pcard">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <p style="font-size:14px;font-weight:500;margin:0;color:var(--color-text-primary);">${name}</p>
        <button class="remove-btn" onclick="removePerson(${idx})" title="Remove ${name}" aria-label="Remove ${name}">×</button>
      </div>
      <span class="badge" style="background:var(--color-background-success);color:var(--color-text-success);">trundle/sofa bed</span>
      <p style="font-size:21px;font-weight:500;margin:10px 0 2px;color:var(--color-text-primary);" id="amount-t${idx}">$${costs.small.toFixed(2)}</p>
      <p style="font-size:11px;color:var(--color-text-tertiary);margin:0;">
        1.00× &nbsp;<span id="diff-t${idx}" style="color:${dm.color};">${dm.str}</span>
      </p>
      <div class="bar-track"><div class="bar-fill" id="bar-t${idx}" style="width:${barW(costs.small)}%;background:#1D9E75;"></div></div>
    </div>`;
  }).join("");

  const coupleAmt = costs.partner * 2;
  const cdm = diffMeta(coupleAmt / 2);
  const coupleCard = `<div class="couple-card">
    <div style="flex:1;min-width:0;">
      <p style="font-size:15px;font-weight:500;margin:0 0 6px;color:var(--color-text-primary);">Austin &amp; Kelly</p>
      <span class="badge" style="background:var(--color-background-info);color:var(--color-text-info);">master bedroom</span>
      <div class="bar-track"><div class="bar-fill" id="bar-couple" style="width:${barW(costs.partner)}%;background:#378ADD;"></div></div>
    </div>
    <div style="text-align:right;flex-shrink:0;">
      <p style="font-size:11px;color:var(--color-text-tertiary);margin:0 0 4px;" id="couple-mult-note">${partnerShare.toFixed(2)}× each · 2 people</p>
      <p style="font-size:24px;font-weight:500;margin:0;color:var(--color-text-primary);" id="couple-amount">$${coupleAmt.toFixed(2)}</p>
      <p style="font-size:11px;color:var(--color-text-tertiary);margin:4px 0 0;">
        <span id="couple-each">$${costs.partner.toFixed(2)}</span> each
        &nbsp;<span id="couple-diff" style="color:${cdm.color};">${cdm.str}</span>
      </p>
    </div>
  </div>`;

  const fixedCards = [
    soloCard("adam",  "Adam",        "✈ transatlantic", "var(--color-background-secondary)", "var(--color-text-secondary)", "#888780", costs.transatlantic, 1.00, true),
    soloCard("lucas", "Lucas's Dad", "private room",     "var(--color-background-warning)",   "var(--color-text-warning)",   "#EF9F27", costs.premium,       premiumShare, false),
  ].join("");

  document.getElementById("people-grid").innerHTML = trundleCards + coupleCard + fixedCards;

  const tot = trundles.length*costs.small + 2*costs.partner + costs.transatlantic + costs.premium;
  document.getElementById("total-check").textContent = "$" + tot.toFixed(2);
}

function updateAmounts() {
  const costs = calcCosts(partnerShare, premiumShare);
  const maxAmt = Math.max(costs.small, costs.partner, costs.premium);
  const evenly = TOTAL / totalPpl();

  document.getElementById("base-rate").textContent = "$" + costs.cpp.toFixed(2);
  document.getElementById("even-split").textContent = "$" + evenly.toFixed(2);
  document.getElementById("couple-label").textContent = partnerShare.toFixed(2) + "× each";
  document.getElementById("premium-label").textContent = premiumShare.toFixed(2) + "×";

  function setDiff(id, amount) {
    const d = amount - evenly;
    const el = document.getElementById("diff-" + id);
    if (!el) return;
    el.textContent = (d >= 0 ? "+" : "−") + "$" + Math.abs(d).toFixed(0) + " vs even";
    el.style.color = d > 0.5 ? "var(--color-text-danger)" : d < -0.5 ? "var(--color-text-success)" : "var(--color-text-tertiary)";
  }
  function setBar(id, amount) {
    const el = document.getElementById("bar-" + id);
    if (el) el.style.width = Math.round(amount / maxAmt * 100) + "%";
  }

  trundles.forEach((_, idx) => {
    const aEl = document.getElementById("amount-t" + idx);
    if (aEl) aEl.textContent = "$" + costs.small.toFixed(2);
    setDiff("t" + idx, costs.small);
    setBar("t" + idx, costs.small);
  });

  const coupleAmt = costs.partner * 2;
  const coupleDiff = costs.partner - evenly;
  const caEl = document.getElementById("couple-amount");
  const ceEl = document.getElementById("couple-each");
  const cdEl = document.getElementById("couple-diff");
  const cnEl = document.getElementById("couple-mult-note");
  if (caEl) caEl.textContent = "$" + coupleAmt.toFixed(2);
  if (ceEl) ceEl.textContent = "$" + costs.partner.toFixed(2);
  if (cdEl) {
    cdEl.textContent = (coupleDiff >= 0 ? "+" : "−") + "$" + Math.abs(coupleDiff).toFixed(0) + " vs even";
    cdEl.style.color = coupleDiff > 0.5 ? "var(--color-text-danger)" : coupleDiff < -0.5 ? "var(--color-text-success)" : "var(--color-text-tertiary)";
  }
  if (cnEl) cnEl.textContent = partnerShare.toFixed(2) + "× each · 2 people";
  setBar("couple", costs.partner);

  ["adam","lucas"].forEach(id => {
    const amt = id === "adam" ? costs.transatlantic : costs.premium;
    const aEl = document.getElementById("amount-" + id);
    const mEl = document.getElementById("mult-" + id);
    if (aEl) aEl.textContent = "$" + amt.toFixed(2);
    if (mEl && id === "lucas") mEl.textContent = premiumShare.toFixed(2) + "×";
    setDiff(id, amt);
    setBar(id, amt);
  });

  const tot = trundles.length*costs.small + 2*costs.partner + costs.transatlantic + costs.premium;
  document.getElementById("total-check").textContent = "$" + tot.toFixed(2);
}

function doSummary() {
  const costs = calcCosts(partnerShare, premiumShare);
  const lines = [
    ...trundles.map(n => n + ": $" + costs.small.toFixed(2) + " (trundle/sofa bed)"),
    "Austin & Kelly (combined): $" + (costs.partner*2).toFixed(2) + " ($" + costs.partner.toFixed(2) + " each — master bedroom)",
    "Adam: $" + costs.transatlantic.toFixed(2) + " (transatlantic concession, base rate)",
    "Lucas's Dad: $" + costs.premium.toFixed(2) + " (private room)",
  ];
  sendPrompt("Write a friendly, clear message I can paste into a group chat to share this vacation rental split:\n\n" + lines.join("\n") + "\n\nTotal: $3,950.44. Keep it warm and casual, briefly note why amounts differ.");
}

document.getElementById("couple-slider").addEventListener("input", e => { partnerShare = parseFloat(e.target.value); updateAmounts(); });
document.getElementById("premium-slider").addEventListener("input", e => { premiumShare = parseFloat(e.target.value); updateAmounts(); });
document.getElementById("new-name").addEventListener("keydown", e => { if (e.key === "Enter") addPerson(); });

buildGrid();

"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/scripts/mcp-app-helper.ts
  var app2 = /* @__PURE__ */ (() => {
    let nextId = 100;
    return {
      sendRequest({ method, params }) {
        const id = nextId++;
        window.parent.postMessage({ jsonrpc: "2.0", id, method, params }, "*");
        return new Promise((resolve, reject) => {
          window.addEventListener(
            "message",
            function listener(event) {
              if (event.data?.id === id) {
                window.removeEventListener("message", listener);
                if (event.data?.result) {
                  resolve(event.data.result);
                } else if (event.data?.error) {
                  const e = event.data.error;
                  reject(
                    new Error(
                      typeof e === "string" ? e : e.message || JSON.stringify(e)
                    )
                  );
                }
              }
            }
          );
        });
      },
      sendNotification({ method, params }) {
        window.parent.postMessage({ jsonrpc: "2.0", method, params }, "*");
      },
      attachFiles(files) {
        window.parent.postMessage({ type: "anthropic:attach-files", files }, "*");
      },
      onNotification(method, handler) {
        window.addEventListener(
          "message",
          function listener(event) {
            if (event.data?.method === method) {
              handler(event.data.params);
            }
          }
        );
      },
      async requestDisplayMode({ mode }) {
        return this.sendRequest({
          method: "ui/request-display-mode",
          params: { mode }
        });
      },
      setupAutoResize() {
        new ResizeObserver(() => {
          const { body, documentElement: html } = document;
          const htmlStyle = getComputedStyle(html);
          const rect = body.getBoundingClientRect();
          const width = Math.ceil(rect.width);
          const height = Math.ceil(
            rect.height + (parseFloat(htmlStyle.borderTop) || 0) + (parseFloat(htmlStyle.borderBottom) || 0)
          );
          this.sendNotification({
            method: "ui/notifications/size-changed",
            params: { width, height }
          });
        }).observe(document.body);
      }
    };
  })();
  window.app = app2;

  // src/scripts/streaming-morph.ts
  function createStreamingRenderer2(options = {}) {
    const {
      stripScripts = false,
      widgetName = "Widget",
      shouldRender = () => true,
      onFirstRender
    } = options;
    let didFirstRender = false;
    const markFirstRender2 = () => {
      if (!didFirstRender) {
        didFirstRender = true;
        onFirstRender?.();
      }
    };
    let parserModules = null;
    let morphdomModule = null;
    let streamingParser = null;
    let prevCode = "";
    async function renderPartial(container2, code) {
      if (!code) return;
      if (!parserModules || !morphdomModule) {
        try {
          const [htmlparser2, domhandler, domSerializer, morphdom] = await Promise.all([
            import("https://esm.sh/htmlparser2@9.1.0"),
            import("https://esm.sh/domhandler@5.0.3"),
            import("https://esm.sh/dom-serializer@2.0.0"),
            import("https://esm.sh/morphdom@2.7.4")
          ]);
          parserModules = {
            Parser: htmlparser2.Parser,
            DomHandler: domhandler.DomHandler,
            render: domSerializer.default
          };
          morphdomModule = morphdom.default;
        } catch (err) {
          console.warn(
            `[${widgetName}] CDN failed, falling back to innerHTML:`,
            err
          );
          container2.innerHTML = code;
          markFirstRender2();
          return;
        }
      }
      if (code.length < prevCode.length || !streamingParser) {
        const handler = new parserModules.DomHandler();
        streamingParser = {
          parser: new parserModules.Parser(handler, {
            decodeEntities: false,
            lowerCaseAttributeNames: false,
            lowerCaseTags: false,
            recognizeSelfClosing: true
          }),
          handler,
          write(chunk) {
            this.parser.write(chunk);
          },
          serialize() {
            return parserModules.render(this.handler.root.children, {
              encodeEntities: false
            });
          }
        };
        prevCode = "";
      }
      const newChunk = code.substring(prevCode.length);
      if (newChunk) {
        streamingParser.write(newChunk);
        prevCode = code;
      }
      let serialized = streamingParser.serialize();
      if (serialized) {
        if (stripScripts) {
          serialized = serialized.replace(/<script[\s\S]*?<\/script>/gi, "");
        }
        if (shouldRender(serialized)) {
          const tempContainer = container2.cloneNode(false);
          tempContainer.innerHTML = serialized;
          morphdomModule(container2, tempContainer, { childrenOnly: true });
          markFirstRender2();
        }
      }
    }
    return { renderPartial };
  }
  window.createStreamingRenderer = createStreamingRenderer2;

  // src/scripts/clipboard-copy.ts
  var htmlToImage = null;
  async function loadHtmlToImage() {
    if (!htmlToImage) {
      htmlToImage = await import("https://esm.sh/html-to-image@1.11.11");
    }
    return htmlToImage;
  }
  async function copyToClipboard2(_container) {
    const lib = await loadHtmlToImage();
    const target = document.body;
    const width = target.scrollWidth || 700;
    const height = target.scrollHeight || 400;
    const blob = await lib.toBlob(target, {
      pixelRatio: 2,
      width,
      height,
      filter: (node) => !(node instanceof HTMLElement && (node.id === "action-btns" || node.id === "copy-toast"))
    });
    if (!blob) throw new Error("Failed to create PNG");
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": Promise.resolve(blob) })
      ]);
    } else {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    }
  }
  window.copyToClipboard = copyToClipboard2;

  // src/scripts/host-init.ts
  function initHostContext2(result) {
    const hostContext = result.hostContext;
    if (!hostContext) return;
    const styles = hostContext.styles;
    if (!styles) return;
    const css = styles.css;
    if (css?.fonts) {
      const fontStyle = document.getElementById("mcp-host-fonts");
      if (fontStyle) {
        fontStyle.textContent = css.fonts;
      }
    }
    const variables = styles.variables;
    if (variables) {
      const style = document.createElement("style");
      style.id = "mcp-host-variables";
      style.textContent = ":root {\n" + Object.entries(variables).map(([key, value]) => "  " + key + ": " + value + ";").join("\n") + "\n}";
      document.head.appendChild(style);
    }
    applyHostStrings(hostContext._hostStrings);
  }
  function applyHostStrings(hostStrings) {
    if (!hostStrings || typeof hostStrings !== "object") return;
    const strings = hostStrings;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = key ? strings[key] : void 0;
      if (val && val.trim()) el.textContent = val;
    });
    window.__hostStrings = strings;
  }
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (data?.method === "ui/notifications/host-context-changed") {
      applyHostStrings(data.params?._hostStrings);
    }
  });
  window.initHostContext = initHostContext2;

  // src/scripts/send-prompt.ts
  window.sendPrompt = function sendPrompt(text) {
    app.sendRequest({
      method: "ui/message",
      params: { role: "user", content: [{ type: "text", text }] }
    });
  };

  // src/scripts/elicitation.ts
  var selectedFiles = /* @__PURE__ */ new Map();
  var submittedKey;
  var FADE_MS = 150;
  function cssStringEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }
  function fingerprint(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i) | 0;
    return `elicit-submitted:${s.length}:${h.toString(36)}`;
  }
  function escapeHtml(s) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return s.replace(/[&<>"']/g, (c) => map[c]);
  }
  function renderFileTile(container2, name, file) {
    const tile = document.createElement("div");
    tile.className = "elicit-file-tile";
    const dot = file.name.lastIndexOf(".");
    const ext = dot > 0 && file.name.length - dot <= 6 ? file.name.slice(dot + 1).toUpperCase() : "FILE";
    tile.innerHTML = `
    <button type="button" class="remove" aria-label="Remove ${escapeHtml(file.name)}">×</button>
    <div class="name">${escapeHtml(file.name)}</div>
    <div class="badge">${escapeHtml(ext)}</div>
  `;
    tile.querySelector(".remove")?.addEventListener("click", () => {
      const list = selectedFiles.get(name);
      if (list) {
        const idx = list.indexOf(file);
        if (idx >= 0) list.splice(idx, 1);
      }
      tile.remove();
    });
    container2.appendChild(tile);
  }
  function renderSubmittedSummary(form, answers, skipped) {
    const summary = document.createElement("div");
    summary.className = "elicit-summary";
    const appendRow = (label, parts) => {
      const row = document.createElement("div");
      row.className = "elicit-summary-row";
      if (label !== void 0) {
        const q = document.createElement("span");
        q.className = "elicit-summary-q";
        q.textContent = label;
        row.appendChild(q);
      }
      for (const part of parts) {
        const a = document.createElement("span");
        a.className = "elicit-summary-a";
        a.textContent = part;
        row.appendChild(a);
      }
      summary.appendChild(row);
    };
    const nonEmpty = (v) => {
      if (v === void 0 || v === "") return void 0;
      if (Array.isArray(v)) return v.length ? v.join(", ") : void 0;
      return v;
    };
    if (skipped) {
      appendRow(void 0, ["Skipped — proceeding with defaults."]);
    } else {
      const seen = /* @__PURE__ */ new Set();
      form.querySelectorAll(".elicit-group").forEach((group) => {
        const label = group.querySelector(".elicit-question")?.textContent?.trim();
        const parts = [];
        group.querySelectorAll("[data-name]").forEach((el) => {
          const name = el.dataset.name;
          if (!name || seen.has(name)) return;
          seen.add(name);
          const v = nonEmpty(answers[name]);
          if (v !== void 0) parts.push(v);
          const other = nonEmpty(answers[`${name}_other`]);
          if (other !== void 0) {
            seen.add(`${name}_other`);
            parts.push(other);
          }
        });
        if (parts.length) appendRow(label, parts);
      });
      for (const [name, value] of Object.entries(answers)) {
        if (seen.has(name)) continue;
        const v = nonEmpty(value);
        if (v !== void 0) appendRow(name, [v]);
      }
      if (summary.childElementCount === 0) {
        appendRow(void 0, ["Submitted with defaults."]);
      }
    }
    form.querySelector(".elicit-body")?.replaceChildren(summary);
  }
  function wireElicitation() {
    const form = document.querySelector("form.elicit");
    if (!form) return;
    selectedFiles.clear();
    let submitted = false;
    form.addEventListener("submit", (e) => e.preventDefault());
    submittedKey = fingerprint(form.innerHTML);
    try {
      const stored = sessionStorage.getItem(submittedKey);
      if (stored) {
        form.classList.add("elicit-submitted", "elicit-restored");
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && "answers" in parsed && "skipped" in parsed) {
          renderSubmittedSummary(
            form,
            parsed.answers,
            parsed.skipped
          );
        }
        return;
      }
    } catch {
    }
    form.querySelectorAll(".elicit-pills").forEach((container2) => {
      const isMulti = container2.dataset.multi === "true";
      const name = container2.dataset.name;
      container2.querySelectorAll(".elicit-pill").forEach((p) => p.setAttribute("aria-pressed", "false"));
      container2.addEventListener("click", (e) => {
        const pill = e.target.closest(
          ".elicit-pill"
        );
        if (!pill) return;
        if (!isMulti) {
          container2.querySelectorAll(".elicit-pill[aria-pressed]").forEach((p) => {
            if (p !== pill) p.setAttribute("aria-pressed", "false");
          });
        }
        const nowSelected = pill.getAttribute("aria-pressed") !== "true";
        pill.setAttribute("aria-pressed", String(nowSelected));
        if (name) {
          const otherInput = form.querySelector(
            `.elicit-other[data-for="${cssStringEscape(name)}"]`
          );
          if (otherInput) {
            const otherPillSelected = container2.querySelector(
              '.elicit-pill[data-other][aria-pressed="true"]'
            ) !== null;
            otherInput.hidden = !otherPillSelected;
            if (otherPillSelected) {
              otherInput.focus();
            }
          }
        }
      });
    });
    form.querySelectorAll(".elicit-files[data-name]").forEach((container2) => {
      const name = container2.dataset.name;
      selectedFiles.set(name, []);
      const dropzone = container2.querySelector(".elicit-dropzone");
      const input = dropzone?.querySelector("input[type='file']");
      if (!dropzone || !input) return;
      if (dropzone.tagName !== "LABEL") {
        dropzone.addEventListener("click", (e) => {
          if (e.target === input) return;
          input.click();
        });
      }
      input.addEventListener("change", () => {
        const files = Array.from(input.files ?? []);
        for (const file of files) {
          const entry = {
            name: file.name,
            size: file.size,
            type: file.type,
            raw: file
          };
          selectedFiles.get(name).push(entry);
          renderFileTile(container2, name, entry);
        }
        input.value = "";
      });
    });
    form.querySelector(".elicit-submit")?.addEventListener("click", () => {
      if (submitted) return;
      submitted = true;
      window.submitElicitation(collectElicitAnswers());
    });
    form.querySelector(".elicit-skip")?.addEventListener("click", () => {
      if (submitted) return;
      submitted = true;
      window.submitElicitation({}, { skipped: true });
    });
  }
  function collectElicitAnswers() {
    const form = document.querySelector("form.elicit");
    if (!form) return {};
    const answers = {};
    form.querySelectorAll(".elicit-pills[data-name]").forEach((container2) => {
      const name = container2.dataset.name;
      const isMulti = container2.dataset.multi === "true";
      const selected = Array.from(
        container2.querySelectorAll(
          ".elicit-pill[aria-pressed='true']"
        )
      ).map((p) => p.dataset.value ?? p.textContent?.trim() ?? "");
      answers[name] = isMulti ? selected : selected[0] ?? "";
      const otherInput = form.querySelector(
        `.elicit-other[data-for="${cssStringEscape(name)}"]`
      );
      if (otherInput && !otherInput.hidden && otherInput.value.trim()) {
        answers[`${name}_other`] = otherInput.value.trim();
      }
    });
    for (const [name, files] of selectedFiles) {
      if (files.length === 0) continue;
      answers[name] = files.map((f) => `${f.name} (attached)`);
    }
    form.querySelectorAll(
      "[data-name]:not(.elicit-pills):not(.elicit-other):not(.elicit-files)"
    ).forEach((el) => {
      const name = el.dataset.name;
      if (name && el.value.trim()) {
        answers[name] = el.value.trim();
      }
    });
    return answers;
  }
  window.submitElicitation = function submitElicitation(answers, options = {}) {
    const skipped = options.skipped ?? false;
    const form = document.querySelector("form.elicit");
    const title = form?.querySelector(".elicit-header > span")?.textContent?.trim();
    if (form) {
      form.classList.add("elicit-transitioning");
      const swap = () => {
        if (!form.isConnected) return;
        form.classList.add("elicit-submitted");
        renderSubmittedSummary(form, answers, skipped);
        form.classList.remove("elicit-transitioning");
      };
      setTimeout(swap, FADE_MS);
    }
    const persistSubmitted = () => {
      if (!submittedKey) return;
      try {
        sessionStorage.setItem(
          submittedKey,
          JSON.stringify({ answers, skipped })
        );
      } catch {
        try {
          sessionStorage.setItem(submittedKey, "1");
        } catch {
        }
      }
    };
    if (skipped) {
      window.sendPrompt(
        "(Skipped the form — proceed with defaults or ask me in plain text)"
      );
      persistSubmitted();
      return;
    }
    const rawFiles = [];
    for (const list of selectedFiles.values()) {
      for (const f of list) rawFiles.push(f.raw);
    }
    const humanizeKey = (k) => {
      let suffix = "";
      if (k.endsWith("_other")) {
        k = k.slice(0, -"_other".length);
        suffix = " (other)";
      } else if (k.endsWith("_file")) {
        k = k.slice(0, -"_file".length);
        suffix = " file";
      } else if (k.endsWith("_text")) {
        k = k.slice(0, -"_text".length);
      }
      const words = k.replace(/_/g, " ");
      return words.charAt(0).toUpperCase() + words.slice(1) + suffix;
    };
    const FOLD_AT = 200;
    const prefix = title ? `${title} — ` : "";
    const pairs = [];
    const folds = [];
    for (const [k, v] of Object.entries(answers)) {
      if (v === "" || Array.isArray(v) && v.length === 0) continue;
      const raw = Array.isArray(v) ? v.join(", ") : v;
      const label = humanizeKey(k);
      if (raw.length > FOLD_AT) {
        pairs.push(`${label}: (${raw.length} chars — see below)`);
        folds.push(`[${label}]
${raw}`);
      } else {
        const flat = raw.replace(/\r?\n/g, " / ");
        const value = flat.length > 80 ? `"${flat}"` : flat;
        pairs.push(`${label}: ${value}`);
      }
    }
    let payload = pairs.length === 0 ? `${prefix}proceeding with defaults.` : `${prefix}${pairs.join(" · ")}`;
    if (folds.length > 0) {
      payload += `

--- Full content ---
${folds.join("\n\n")}`;
    }
    if (rawFiles.length > 0) {
      window.parent.postMessage(
        { type: "anthropic:elicit-submit", text: payload, files: rawFiles },
        "*"
      );
    } else {
      window.sendPrompt(payload);
      persistSubmitted();
    }
  };
  window.collectElicitAnswers = collectElicitAnswers;
  window._wireElicitation = wireElicitation;

  // src/scripts/open-link.ts
  window.openLink = function openLink(url) {
    return app.sendRequest({
      method: "ui/open-link",
      params: { url }
    });
  };
  document.getElementById("vis-container").addEventListener("click", (e) => {
    const anchor = e.target?.closest?.("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#") || href.startsWith("javascript:")) return;
    let url;
    try {
      url = new URL(href, window.location.href).href;
    } catch {
      return;
    }
    if (!/^https?:/.test(url)) return;
    e.preventDefault();
    window.openLink(url);
  });

  // src/scripts/svg-text-occlusion.ts
  function fixSvgTextOcclusion2(container2) {
    try {
      const svg = container2.querySelector("svg");
      if (!svg) return;
      const NS = "http://www.w3.org/2000/svg";
      const PAD_X = 4;
      const PAD_Y = 2;
      const MIN_CONNECTOR_LEN = 15;
      const textRects = [];
      svg.querySelectorAll("text").forEach((t) => {
        if (t.closest("defs, mask, clipPath, marker")) return;
        try {
          const bb = t.getBBox();
          if (bb.width < 1 || bb.height < 1) return;
          textRects.push({
            x: bb.x - PAD_X,
            y: bb.y - PAD_Y,
            w: bb.width + 2 * PAD_X,
            h: bb.height + 2 * PAD_Y
          });
        } catch {
        }
      });
      if (!textRects.length) return;
      const candidates = [];
      svg.querySelectorAll("line, path, polyline").forEach((el) => {
        if (el.closest("defs, mask, clipPath, marker")) return;
        if (el.tagName.toLowerCase() === "path") {
          const fill = el.getAttribute("fill") || getComputedStyle(el).fill;
          if (fill && fill !== "none" && fill !== "transparent" && !/^rgba\([^)]*,\s*0\)$/.test(fill))
            return;
        }
        const geom = el;
        try {
          const len = geom.getTotalLength();
          if (len < MIN_CONNECTOR_LEN) return;
          candidates.push({ el: geom, len });
        } catch {
        }
      });
      if (!candidates.length) return;
      const inRect = (px, py, r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
      const intersecting = [];
      for (const { el, len } of candidates) {
        const step = Math.max(2, len / 80);
        let hit = false;
        for (let d = 0; d <= len && !hit; d += step) {
          const pt = el.getPointAtLength(d);
          for (const r of textRects) {
            if (inRect(pt.x, pt.y, r)) {
              hit = true;
              break;
            }
          }
        }
        if (hit) intersecting.push(el);
      }
      if (!intersecting.length) return;
      let defs = svg.querySelector(":scope > defs");
      if (!defs) {
        defs = document.createElementNS(NS, "defs");
        svg.insertBefore(defs, svg.firstChild);
      }
      const maskId = `imagine-text-gaps-${Math.random().toString(36).slice(2, 8)}`;
      const mask = document.createElementNS(NS, "mask");
      mask.setAttribute("id", maskId);
      mask.setAttribute("maskUnits", "userSpaceOnUse");
      const vb = (svg.getAttribute("viewBox") || "").trim().split(/[\s,]+/).map(Number);
      const [vx, vy, vw, vh] = vb.length === 4 && vb.every((n) => Number.isFinite(n)) ? vb : (() => {
        const bb = svg.getBBox();
        return [bb.x, bb.y, bb.width, bb.height];
      })();
      const bg = document.createElementNS(NS, "rect");
      bg.setAttribute("x", String(vx));
      bg.setAttribute("y", String(vy));
      bg.setAttribute("width", String(vw));
      bg.setAttribute("height", String(vh));
      bg.setAttribute("fill", "white");
      mask.appendChild(bg);
      for (const r of textRects) {
        const hole = document.createElementNS(NS, "rect");
        hole.setAttribute("x", String(r.x));
        hole.setAttribute("y", String(r.y));
        hole.setAttribute("width", String(r.w));
        hole.setAttribute("height", String(r.h));
        hole.setAttribute("fill", "black");
        hole.setAttribute("rx", "2");
        mask.appendChild(hole);
      }
      defs.appendChild(mask);
      for (const el of intersecting) {
        el.setAttribute("mask", `url(#${maskId})`);
      }
    } catch {
    }
  }
  window.fixSvgTextOcclusion = fixSvgTextOcclusion2;

  // src/scripts/svg-clip-fix.ts
  function fixSvgClipping2(container2) {
    try {
      const svg = container2.querySelector("svg");
      if (!svg) return;
      const vb = svg.getAttribute("viewBox");
      if (!vb) return;
      const [vbX, vbY, vbW, vbH] = vb.split(/[\s,]+/).map(Number);
      if (![vbX, vbY, vbW, vbH].every(Number.isFinite)) return;
      if (vbW < 100 || vbH < 100) return;
      let maxX = -Infinity;
      let maxY = -Infinity;
      svg.querySelectorAll(
        ":scope > :not(defs):not(style):not(title):not(desc):not(metadata)"
      ).forEach((el) => {
        try {
          const bb = el.getBBox();
          if (bb.width < 0.5 && bb.height < 0.5) return;
          maxX = Math.max(maxX, bb.x + bb.width);
          maxY = Math.max(maxY, bb.y + bb.height);
        } catch {
        }
      });
      const PAD = 10;
      const vbRight = vbX + vbW;
      const vbBottom = vbY + vbH;
      let newW = vbW;
      if (maxX !== -Infinity && maxX + PAD > vbRight + 1) {
        newW = maxX + PAD - vbX;
      }
      let newH = vbH;
      if (maxY !== -Infinity && maxY + PAD > vbBottom + 1) {
        newH = maxY + PAD - vbY;
      }
      if (newW !== vbW || newH !== vbH) {
        svg.setAttribute(
          "viewBox",
          `${vbX} ${vbY} ${round(newW)} ${round(newH)}`
        );
        const hAttr = svg.getAttribute("height");
        if (hAttr && newH !== vbH) {
          const px = parseFloat(hAttr);
          if (Number.isFinite(px)) {
            svg.setAttribute("height", String(round(px * (newH / vbH))));
          }
        }
      }
      svg.style.maxWidth = `${round(newW)}px`;
      svg.style.display = "block";
      svg.style.marginInline = "auto";
    } catch {
    }
  }
  function round(n) {
    return Math.round(n * 100) / 100;
  }
  globalThis.fixSvgClipping = fixSvgClipping2;

  // src/scripts/svg-text-edge-fix.ts
  function fixSvgTextEdgeClip2(container2) {
    try {
      const svg = container2.querySelector("svg");
      if (!svg) return;
      const vb = svg.getAttribute("viewBox");
      if (!vb) return;
      const [vbX, , vbW] = vb.split(/[\s,]+/).map(Number);
      if (!Number.isFinite(vbX) || !Number.isFinite(vbW)) return;
      const vbRight = vbX + vbW;
      const byKey = /* @__PURE__ */ new Map();
      svg.querySelectorAll("text").forEach((text) => {
        if (text.closest("svg") !== svg) return;
        if (text.closest("g[transform]")) return;
        if (text.hasAttribute("transform")) return;
        if (text.querySelector("tspan[x]")) return;
        const p = text.parentElement;
        if (p && p !== svg) {
          const hasBox = Array.from(
            p.querySelectorAll(
              ":scope > rect, :scope > circle, :scope > ellipse"
            )
          ).some((shape) => {
            try {
              return shape.getBBox().width > 10;
            } catch {
              return true;
            }
          });
          if (hasBox) return;
        }
        const anchor = text.getAttribute("text-anchor") || getComputedStyle(text).textAnchor || "start";
        if (anchor !== "start" && anchor !== "end") return;
        let bb;
        try {
          bb = text.getBBox();
        } catch {
          return;
        }
        if (bb.width < 1) return;
        const xAttr = text.getAttribute("x");
        if (!xAttr || /[\s,]/.test(xAttr)) return;
        const x = parseFloat(xAttr);
        if (!Number.isFinite(x)) return;
        const overflow = anchor === "start" ? bb.x + bb.width - vbRight : vbX - bb.x;
        const key = `${anchor}:${x}`;
        const group = byKey.get(key) ?? [];
        group.push({ text, x, anchor, overflow, width: bb.width });
        byKey.set(key, group);
      });
      byKey.forEach((group) => {
        const overflowing = group.filter((g) => g.overflow > 2);
        if (!overflowing.length) return;
        const worst = overflowing.reduce(
          (a, b) => a.overflow > b.overflow ? a : b
        );
        if (worst.overflow > worst.width * 0.5) return;
        const shift = group[0].anchor === "start" ? -worst.overflow : worst.overflow;
        group.forEach(
          ({ text, x }) => text.setAttribute("x", String(round2(x + shift)))
        );
      });
    } catch {
    }
  }
  function round2(n) {
    return Math.round(n * 100) / 100;
  }
  globalThis.fixSvgTextEdgeClip = fixSvgTextEdgeClip2;

  // src/scripts/widget-main.ts
  var IMPLEMENTATION = { name: "visualize widget", version: "1.0.0" };
  var container = document.getElementById("vis-container");
  var isSvgCode = (code) => code.trimStart().startsWith("<svg");
  var hasSvgVisuals = (code) => code && /<(rect|circle|ellipse|line|polyline|polygon|path|text|image|use|g|foreignObject)[\s>]/i.test(
    code.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<defs[\s\S]*?<\/defs>/gi, "")
  );
  var hasHtmlVisuals = (code) => code && code.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<!--[\s\S]*?-->/g, "").trim().length > 0;
  var executeScripts = async () => {
    const scripts = Array.from(container.querySelectorAll("script"));
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach(
        (attr) => newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      const hasSrc = newScript.hasAttribute("src");
      const loaded = hasSrc ? new Promise((resolve) => {
        newScript.onload = () => resolve();
        newScript.onerror = () => resolve();
      }) : Promise.resolve();
      oldScript.parentNode?.replaceChild(newScript, oldScript);
      await loaded;
    }
  };
  var vizTitle = "visualize";
  var iframeStartTime = performance.now();
  var firstRenderSent = false;
  var sendTiming = (event) => app.sendNotification({
    method: "notifications/message",
    params: {
      level: "info",
      logger: `viz:timing:${event}`,
      data: { iframe_ms: Math.round(performance.now() - iframeStartTime) }
    }
  });
  var sendAction = (action) => app.sendNotification({
    method: "notifications/message",
    params: { level: "info", logger: `viz:action:${action}`, data: { action } }
  });
  var markFirstRender = () => {
    if (!firstRenderSent) {
      firstRenderSent = true;
      sendTiming("firstrender");
    }
  };
  var svgRenderer = createStreamingRenderer({
    widgetName: "VisualizeWidget-SVG",
    shouldRender: hasSvgVisuals,
    onFirstRender: markFirstRender
  });
  var htmlRenderer = createStreamingRenderer({
    widgetName: "VisualizeWidget-HTML",
    stripScripts: true,
    shouldRender: hasHtmlVisuals,
    onFirstRender: markFirstRender
  });
  var renderFinal = async (code) => {
    container.classList.remove("streaming");
    if (isSvgCode(code)) {
      if (hasSvgVisuals(code)) {
        container.innerHTML = code;
        markFirstRender();
        fixSvgTextEdgeClip(container);
        fixSvgClipping(container);
        fixSvgTextOcclusion(container);
      }
    } else {
      if (hasHtmlVisuals(code)) {
        container.innerHTML = code;
        markFirstRender();
        await executeScripts();
        container.classList.remove("scripts-loading");
        window._wireElicitation();
        fixSvgTextEdgeClip(container);
        fixSvgClipping(container);
        fixSvgTextOcclusion(container);
      }
    }
    window.dispatchEvent(
      new CustomEvent("viz:complete", {
        detail: { code, title: vizTitle }
      })
    );
    sendTiming("complete");
  };
  var renderPartialCode = (code) => {
    container.classList.add("streaming");
    if (isSvgCode(code)) {
      void svgRenderer.renderPartial(container, code);
    } else {
      void htmlRenderer.renderPartial(container, code);
      if (code.includes("<script") && hasHtmlVisuals(code)) {
        container.classList.add("scripts-loading");
      }
    }
  };
  var nextRequestId = 1;
  async function connectToHost() {
    try {
      window.addEventListener("message", (event) => {
        try {
          const data = event.data;
          if (data && data.jsonrpc === "2.0") {
            if (data.id === 1 && data.result) {
              initHostContext(data.result);
              window.parent.postMessage(
                {
                  jsonrpc: "2.0",
                  method: "ui/notifications/initialized",
                  params: {}
                },
                "*"
              );
            }
          }
        } catch (err) {
          console.error("[VisualizeWidget] Error handling message:", err);
        }
      });
      app.onNotification("ui/notifications/tool-input-partial", (params) => {
        const args = params?.arguments ?? {};
        if (typeof args.title === "string" && args.title) vizTitle = args.title;
        const code = args.widget_code ?? args.code;
        if (code) renderPartialCode(code);
      });
      app.onNotification("ui/notifications/tool-input", (params) => {
        const args = params?.arguments ?? {};
        if (typeof args.title === "string" && args.title) vizTitle = args.title;
        const code = args.widget_code ?? args.code;
        if (code) {
          void renderFinal(code);
          if (!document.querySelector("form.elicit")) {
            document.getElementById("action-btns")?.removeAttribute("hidden");
          }
        }
      });
      window.parent.postMessage(
        {
          jsonrpc: "2.0",
          id: nextRequestId++,
          method: "ui/initialize",
          params: {
            protocolVersion: "2025-11-21",
            appInfo: IMPLEMENTATION,
            appCapabilities: {}
          }
        },
        "*"
      );
      app.setupAutoResize();
      const hostStr = (key) => {
        const s = window.__hostStrings;
        const v = s?.[key];
        return v && v.trim() ? v : void 0;
      };
      const FREEZE_PROPS = [
        "fill",
        "stroke",
        "color",
        "stroke-width",
        "stroke-dasharray",
        "stroke-linecap",
        "stroke-linejoin",
        "opacity",
        "font-family",
        "font-size",
        "font-weight",
        "font-style",
        "text-anchor",
        "dominant-baseline"
      ];
      const freezeSvgForDownload = () => {
        const live = container.querySelector("svg");
        if (!live) return null;
        const clone = live.cloneNode(true);
        if (!clone.hasAttribute("xmlns")) {
          clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        }
        clone.style.removeProperty("max-width");
        clone.style.removeProperty("display");
        clone.style.removeProperty("margin-inline");
        const liveEls = live.querySelectorAll("*");
        const cloneEls = clone.querySelectorAll("*");
        for (let i = 0; i < liveEls.length; i++) {
          const el = liveEls[i];
          const out = cloneEls[i];
          if (el.closest("defs, marker, mask, clipPath, pattern, symbol")) {
            continue;
          }
          const cs = getComputedStyle(el);
          const decls = [];
          for (const p of FREEZE_PROPS) {
            const v = cs.getPropertyValue(p);
            if (!v) continue;
            if (v.startsWith("url(")) continue;
            if (v === "normal") continue;
            if (v === "none" && p === "stroke-dasharray") continue;
            decls.push(`${p}:${v}`);
          }
          if (decls.length) {
            const existing = out.getAttribute("style");
            out.setAttribute(
              "style",
              existing ? `${existing};${decls.join(";")}` : decls.join(";")
            );
          }
          out.removeAttribute("class");
        }
        clone.querySelectorAll("style, script").forEach((n) => n.remove());
        return new XMLSerializer().serializeToString(clone);
      };
      const downloadBtn = document.getElementById("download-btn");
      const downloadIconEl = document.getElementById("download-icon");
      const downloadLabelEl = downloadBtn?.querySelector(".more-item-label");
      const downloadIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M16.5 13C16.7761 13 17 13.2239 17 13.5V15.5C17 16.3284 16.3284 17 15.5 17H4.5C3.67157 17 3 16.3284 3 15.5V13.5C3 13.2239 3.22386 13 3.5 13C3.77614 13 4 13.2239 4 13.5V15.5C4 15.7761 4.22386 16 4.5 16H15.5C15.7761 16 16 15.7761 16 15.5V13.5C16 13.2239 16.2239 13 16.5 13ZM10 3C10.2761 3 10.5 3.22386 10.5 3.5V12.1855L13.626 8.66797C13.8094 8.46166 14.1256 8.44275 14.332 8.62598C14.5383 8.80936 14.5573 9.12563 14.374 9.33203L10.374 13.832L10.2949 13.9033C10.21 13.9654 10.107 14 10 14C9.85718 14 9.72086 13.9388 9.62598 13.832L5.62598 9.33203L5.56738 9.25C5.45079 9.04872 5.48735 8.78653 5.66797 8.62598C5.84854 8.46567 6.1127 8.46039 6.29883 8.59961L6.37402 8.66797L9.5 12.1855V3.5C9.5 3.22386 9.72386 3 10 3Z"></path></svg>';
      const downloadCheckIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="var(--color-text-success, #265b19)"><path d="M15.1883 5.10908C15.3699 4.96398 15.6346 4.96153 15.8202 5.11592C16.0056 5.27067 16.0504 5.53125 15.9403 5.73605L15.8836 5.82003L8.38354 14.8202C8.29361 14.9279 8.16242 14.9925 8.02221 14.9989C7.88203 15.0051 7.74545 14.9526 7.64622 14.8534L4.14617 11.3533L4.08172 11.2752C3.95384 11.0811 3.97542 10.817 4.14617 10.6463C4.31693 10.4755 4.58105 10.4539 4.77509 10.5818L4.85321 10.6463L7.96556 13.7586L15.1161 5.1794L15.1883 5.10908Z"></path></svg>';
      if (downloadIconEl) downloadIconEl.innerHTML = downloadIcon;
      window.addEventListener("viz:complete", (ev) => {
        const detail = ev.detail;
        const code = detail?.code;
        const title = detail?.title || "visualize";
        if (!code || !downloadBtn || !downloadIconEl || !downloadLabelEl) return;
        const isSvg = code.trimStart().startsWith("<svg");
        const ext = isSvg ? "svg" : "html";
        const mime = isSvg ? "image/svg+xml" : "text/html";
        downloadBtn.onclick = async () => {
          try {
            sendAction("download");
            const res = await app.sendRequest({
              method: "ui/download-file",
              params: {
                contents: [
                  {
                    type: "resource",
                    resource: {
                      uri: `file:///${title}.${ext}`,
                      mimeType: mime,
                      text: isSvg ? freezeSvgForDownload() ?? code : code
                    }
                  }
                ]
              }
            });
            if (!res?.isError) {
              const restore = downloadLabelEl.textContent;
              downloadIconEl.innerHTML = downloadCheckIcon;
              downloadLabelEl.textContent = hostStr("grabDone") ?? "Downloaded";
              setTimeout(() => {
                downloadIconEl.innerHTML = downloadIcon;
                downloadLabelEl.textContent = restore;
              }, 1500);
            }
          } catch {
          }
        };
      });
      const copyBtn = document.getElementById("copy-btn");
      const copyIconEl = document.getElementById("copy-icon");
      const copyLabelEl = copyBtn?.querySelector(".more-item-label");
      const copyIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M12.5 3C13.3284 3 14 3.67157 14 4.5V6H15.5C16.3284 6 17 6.67157 17 7.5V15.5C17 16.3284 16.3284 17 15.5 17H7.5C6.67157 17 6 16.3284 6 15.5V14H4.5C3.67157 14 3 13.3284 3 12.5V4.5C3 3.67157 3.67157 3 4.5 3H12.5ZM14 12.5C14 13.3284 13.3284 14 12.5 14H7V15.5C7 15.7761 7.22386 16 7.5 16H15.5C15.7761 16 16 15.7761 16 15.5V7.5C16 7.22386 15.7761 7 15.5 7H14V12.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5V12.5C4 12.7761 4.22386 13 4.5 13H12.5C12.7761 13 13 12.7761 13 12.5V4.5C13 4.22386 12.7761 4 12.5 4H4.5Z"></path></svg>';
      const copyCheckIcon = '<svg width="20" height="20" viewBox="0 0 20 20" fill="var(--color-text-success, #265b19)"><path d="M15.1883 5.10908C15.3699 4.96398 15.6346 4.96153 15.8202 5.11592C16.0056 5.27067 16.0504 5.53125 15.9403 5.73605L15.8836 5.82003L8.38354 14.8202C8.29361 14.9279 8.16242 14.9925 8.02221 14.9989C7.88203 15.0051 7.74545 14.9526 7.64622 14.8534L4.14617 11.3533L4.08172 11.2752C3.95384 11.0811 3.97542 10.817 4.14617 10.6463C4.31693 10.4755 4.58105 10.4539 4.77509 10.5818L4.85321 10.6463L7.96556 13.7586L15.1161 5.1794L15.1883 5.10908Z"></path></svg>';
      if (copyIconEl) copyIconEl.innerHTML = copyIcon;
      if (copyBtn && copyIconEl && copyLabelEl) {
        copyBtn.onclick = async () => {
          try {
            sendAction("copy");
            await copyToClipboard(container);
            const restore = copyLabelEl.textContent;
            copyIconEl.innerHTML = copyCheckIcon;
            copyLabelEl.textContent = hostStr("clipDone") ?? "Copied";
            setTimeout(() => {
              copyIconEl.innerHTML = copyIcon;
              copyLabelEl.textContent = restore;
            }, 1500);
          } catch (_err) {
            const toast = document.getElementById("copy-toast");
            toast.textContent = "Copy failed — try from claude.ai in browser";
            toast.classList.add("visible");
            setTimeout(() => toast.classList.remove("visible"), 3e3);
          }
        };
      }
    } catch (err) {
      console.error("[VisualizeWidget] Failed to connect:", err);
    }
  }
  connectToHost();
})();
