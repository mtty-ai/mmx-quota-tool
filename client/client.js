window.__ModuleLoader__.load({
  id: "mmx-quota-tool",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var React = require("react")

    var name = "mmx-quota-tool"
    var inject = ["timer", "slots"]

    var CSS = [
      ".dsh-mmx-quota-dock {",
      "  display: inline-flex; align-items: center; gap: 6px;",
      "  font: 12px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
      "  color: var(--dsw-alias-label-primary, #1f2328); padding: 3px 8px;",
      "  white-space: nowrap; cursor: pointer; user-select: none;",
      "  border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,0.12));",
      "  background: var(--dsw-alias-bg-layer-2, rgba(255,255,255,0.6));",
      "  position: relative; z-index: 4; transition: background-color 0.15s ease;",
      "}",
      ".dsh-mmx-quota-dock:hover { background: var(--dsw-alias-bg-layer-3, rgba(0,0,0,0.05)); border-color: var(--dsw-alias-border-l3, rgba(0,0,0,0.16)); }",
      "body[data-ds-dark-theme] .dsh-mmx-quota-dock { border-color:rgba(255,255,255,0.18); }",
      "body[data-ds-dark-theme] .dsh-mmx-quota-dock:hover { border-color:rgba(255,255,255,0.28); }",
      ".dsh-mmx-quota-dock[data-pending='1'] { opacity: 0.55; }",
      ".dsh-mmx-quota-dock__icon { width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle; color:var(--dsw-alias-state-success-primary,#16a34a); }",
      ".dsh-mmx-quota-dock__icon--ok   { color:var(--dsw-alias-state-success-primary,#16a34a); }",
      ".dsh-mmx-quota-dock__icon--warn { color:var(--dsw-alias-state-warn-primary,#b45309); }",
      ".dsh-mmx-quota-dock__icon--bad  { color:var(--dsw-alias-state-error-primary,#dc2626); }",
      ".dsh-mmx-quota-dock__icon-body { fill:color-mix(in srgb, currentColor 22%, transparent); stroke:currentColor; stroke-width:1.4; }",
      "body[data-ds-dark-theme] .dsh-mmx-quota-dock__icon-body { fill:color-mix(in srgb, currentColor 32%, transparent); stroke-width:1.5; }",
      ".dsh-mmx-quota-dock__icon-fill { fill:currentColor; }",
      ".dsh-mmx-quota-dock__pct { font-weight:700;font-size:12px;font-variant-numeric:tabular-nums;min-width:32px;text-align:left;}",
      ".dsh-mmx-quota-dock__pct.ok   { color:var(--dsw-alias-state-success-primary,#16a34a); }",
      ".dsh-mmx-quota-dock__pct.warn { color:var(--dsw-alias-state-warn-primary,#b45309); }",
      ".dsh-mmx-quota-dock__pct.bad  { color:var(--dsw-alias-state-error-primary,#dc2626); }",
      ".dsh-mmx-quota-dock__err { color:#dc2626;font-size:11px;font-weight:600;}",
      "body[data-ds-dark-theme] .dsh-mmx-quota-dock__err { color:#f87171; }",
      ".dsh-mmx-quota-dock__panel {",
      "  z-index:100; box-sizing:border-box;",
      "  border:1px solid var(--dsw-alias-border-l2, rgba(0,0,0,0.12));",
      "  background:var(--dsw-specific-menu, var(--dsw-alias-bg-overlay, #ffffff));",
      "  width:264px; max-width:92vw; max-height:80vh; overflow:auto;",
      "  box-shadow:var(--dsw-shadow-lv3, 0 8px 24px rgba(0,0,0,0.12));",
      "  color:var(--dsw-alias-label-secondary, #6b7280); cursor:default;",
      "  border-radius:12px; padding:12px; font-size:12px; line-height:20px;",
      "  position:absolute; bottom:calc(100% + 8px); left:0;",
      "  pointer-events:auto; user-select:text;",
      "}",
      "body[data-ds-dark-theme] .dsh-mmx-quota-dock__panel { border-color:rgba(255,255,255,0.16); }",
      ".dsh-mmx-quota-dock__panel-header {",
      "  display:flex; align-items:center; gap:6px;",
      "  font-weight:500; color:var(--dsw-alias-label-primary, #1f2328);",
      "}",
      ".dsh-mmx-quota-dock__panel-header-meta {",
      "  margin-left:auto; font-weight:400; font-size:11px;",
      "  color:var(--dsw-alias-label-tertiary, #9ca3af); font-variant-numeric:tabular-nums;",
      "}",
      ".dsh-mmx-quota-dock__panel-headline {",
      "  color:var(--dsw-alias-label-tertiary, #9ca3af); margin-top:2px;",
      "}",
      ".dsh-mmx-quota-dock__panel-list { margin:10px 0 0; }",
      ".dsh-mmx-quota-dock__panel .row {",
      "  display:flex; justify-content:space-between; align-items:center;",
      "  gap:12px; padding:2px 0;",
      "}",
      ".dsh-mmx-quota-dock__panel .row-name {",
      "  font-weight:500; color:var(--dsw-alias-label-primary, #1f2328);",
      "  font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;",
      "  max-width:96px; flex-shrink:1;",
      "}",
      ".dsh-mmx-quota-dock__panel .row-stats { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }",
      ".dsh-mmx-quota-dock__panel .stat { display:flex; align-items:center; gap:8px; }",
      ".dsh-mmx-quota-dock__panel .stat-label {",
      "  flex:0 0 24px; font-size:10px; font-weight:600;",
      "  color:var(--dsw-alias-label-tertiary, #9ca3af); text-align:center;",
      "}",
      ".dsh-mmx-quota-dock__panel .bar {",
      "  width:64px; height:4px;",
      "  background:var(--dsw-alias-interactive-bg-hover, #f3f4f6);",
      "  border-radius:999px; overflow:hidden;",
      "}",
      ".dsh-mmx-quota-dock__panel .bar > span { display:block; height:100%; border-radius:1px; min-width:2px; transition:width 0.3s ease; }",
      ".dsh-mmx-quota-dock__panel .stat-pct {",
      "  flex:0 0 36px; text-align:right;",
      "  font-weight:500; font-size:11px; font-variant-numeric:tabular-nums;",
      "}",
      ".dsh-mmx-quota-dock__panel .stat-pct.ok   { color:var(--dsw-alias-state-success-primary,#16a34a); }",
      ".dsh-mmx-quota-dock__panel .stat-pct.warn { color:var(--dsw-alias-state-warn-primary,#b45309); }",
      ".dsh-mmx-quota-dock__panel .stat-pct.bad  { color:var(--dsw-alias-state-error-primary,#dc2626); }",
      ".dsh-mmx-quota-dock__panel .stat-reset {",
      "  flex:0 0 38px; text-align:right; font-size:10px;",
      "  color:var(--dsw-alias-label-tertiary, #9ca3af); font-variant-numeric:tabular-nums;",
      "}",
      ".dsh-mmx-quota-dock__panel .row-warn {",
      "  margin-top:8px; padding:6px 8px;",
      "  color:#dc2626; font-size:11px; line-height:16px;",
      "  background:rgba(220,38,38,0.08);",
      "  border-radius:6px;",
      "}",
      "body[data-ds-dark-theme] .dsh-mmx-quota-dock__panel .row-warn { color:#f87171; background:rgba(248,113,113,0.15); }",
      ".dsh-mmx-quota-dock__panel-footer {",
      "  margin-top:10px; padding-top:8px;",
      "  border-top:1px solid var(--dsw-alias-border-l2, #e5e7eb);",
      "  display:flex; justify-content:space-between; align-items:center;",
      "  font-size:10px; color:var(--dsw-alias-label-tertiary, #9ca3af);",
      "}",
      ".dsh-mmx-quota-dock__panel-footer .hint { font-variant-numeric:tabular-nums; }",
    ].join("\n")

    var MODEL_NAME_ZH = {
      general: "通用", video: "视频", image: "图像", audio: "音频", speech: "语音",
      music: "音乐", vision: "视觉", embedding: "向量", realtime: "实时", longcontext: "长文本",
    }
    function modelDisplayName(rawName) {
      if (!rawName) return "未知"
      var n = String(rawName).toLowerCase()
      var parts = n.split("/")
      var base = parts[parts.length - 1]
      if (MODEL_NAME_ZH[base]) return MODEL_NAME_ZH[base]
      if (base.indexOf("minimax") >= 0) {
        for (var k in MODEL_NAME_ZH) {
          if (base.indexOf(k) >= 0) return MODEL_NAME_ZH[k]
        }
      }
      return base
    }
    function pctClassByUsage(pct) {
      if (pct < 50) return "ok"
      if (pct < 80) return "warn"
      return "bad"
    }
    function fillColorByClass(cls) {
      // Reference the DSH design-system state colors so the chip adapts to
      // light/dark/auto themes. Variables are defined on :root by the dsh
      // shell; if absent we fall back to bright green so the dock is
      // always legible.
      if (cls === "ok") return "var(--dsw-alias-state-success-primary, #16a34a)"
      if (cls === "warn") return "var(--dsw-alias-state-warn-primary, #b45309)"
      return "var(--dsw-alias-state-error-primary, #dc2626)"
    }
    function formatRemaining(ms) {
      if (!ms || ms <= 0) return ""
      var totalSec = Math.floor(ms / 1000)
      var days = Math.floor(totalSec / 86400)
      var hours = Math.floor((totalSec % 86400) / 3600)
      var mins = Math.floor((totalSec % 3600) / 60)
      if (days > 0) return days + "d" + hours + "h"
      if (hours > 0) return hours + "h" + mins + "m"
      return mins + "m"
    }

    function QuotabarIcon(props) {
      var pct = props.pct
      var cls = props.cls || "ok"
      var safe = Math.max(0, Math.min(100, pct))
      var fillH = Math.round((safe / 100) * 13)
      // The whole icon uses currentColor, which the dock element sets via
      // .ok / .warn / .bad → state-success / state-warn / state-error CSS
      // variables. No JS-computed colors: theme switches just work.
      return React.createElement("svg", {
        className: "dsh-mmx-quota-dock__icon dsh-mmx-quota-dock__icon--" + cls,
        width: 16, height: 16, viewBox: "0 0 18 18",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-label": "MiniMax 5h usage",
      },
        React.createElement("path", {
          className: "dsh-mmx-quota-dock__icon-body",
          d: "M9 1 C 9 1, 4 7, 4 11.5 A 5 5 0 0 0 14 11.5 C 14 7, 9 1, 9 1 Z",
        }),
        React.createElement("clipPath", { id: "mmxqt-drop-clip-nm" },
          React.createElement("path", { d: "M9 1 C 9 1, 4 7, 4 11.5 A 5 5 0 0 0 14 11.5 C 14 7, 9 1, 9 1 Z" }),
        ),
        React.createElement("rect", {
          className: "dsh-mmx-quota-dock__icon-fill",
          x: 0, y: 16 - fillH, width: 18, height: fillH + 1,
          "clip-path": "url(#mmxqt-drop-clip-nm)",
        }),
      )
    }

    function RowDetails(props) {
      var r = props.row
      var displayName = modelDisplayName(r.name)
      var usage5h = r.interval_used_pct
      var usageWeek = r.weekly_used_pct
      var cls5h = pctClassByUsage(usage5h)
      var clsWeek = pctClassByUsage(usageWeek)
      var reset5h = formatRemaining(r.interval_remaining_ms)
      var resetWeek = formatRemaining(r.weekly_remaining_ms)
      return React.createElement("div", { className: "row" },
        React.createElement("div", { className: "row-name", title: r.name }, displayName),
        React.createElement("div", { className: "row-stats" },
          React.createElement("div", { className: "stat" },
            React.createElement("span", { className: "stat-label" }, "5h"),
            React.createElement("span", { className: "bar" },
              React.createElement("span", { style: { width: Math.max(0, Math.min(100, usage5h)) + "%", background: fillColorByClass(cls5h) } }),
            ),
            React.createElement("span", { className: "stat-pct " + cls5h }, usage5h + "%"),
            React.createElement("span", { className: "stat-reset" }, reset5h ? reset5h + "后" : "—"),
          ),
          React.createElement("div", { className: "stat" },
            React.createElement("span", { className: "stat-label" }, "周"),
            React.createElement("span", { className: "bar" },
              React.createElement("span", { style: { width: Math.max(0, Math.min(100, usageWeek)) + "%", background: fillColorByClass(clsWeek) } }),
            ),
            React.createElement("span", { className: "stat-pct " + clsWeek }, usageWeek + "%"),
            React.createElement("span", { className: "stat-reset" }, resetWeek ? resetWeek + "后" : "—"),
          ),
        ),
      )
    }

    function QuotaIcon(props) {
      var ctxRef = props.ctxRef
      var hooks = props.hooks
      var cssText = props.css
      var _useState = hooks.useState, _useEffect = hooks.useEffect

      var _s = _useState(null)
      var snapshot = _s[0], setSnapshot = _s[1]
      var _p = _useState(false)
      var pending = _p[0], setPending = _p[1]
      var _o = _useState(false)
      var open = _o[0], setOpen = _o[1]

      _useEffect(function () {
        if (!cssText) return undefined
        var id = "dsh-mmx-quota-tool-style"
        if (document.getElementById(id)) return undefined
        var el = document.createElement("style")
        el.id = id
        el.textContent = cssText
        document.head.appendChild(el)
        return function () {
          var n = document.getElementById(id)
          if (n && n.parentNode) n.parentNode.removeChild(n)
        }
      }, [])

      function load() {
        return fetch("/api/mmx-quota-tool/quota", { cache: "no-store" })
          .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json() })
          .then(function (body) {
            setSnapshot(body || { rows: [], lastFetchedAt: 0, lastError: "no payload", lastStatus: null, model: null, isMmx: false })
          })
          .catch(function (err) {
            setSnapshot({ rows: [], lastFetchedAt: 0, lastError: String(err && err.message ? err.message : err), lastStatus: null, model: null, isMmx: false })
          })
      }
      function refreshNow() {
        if (pending) return
        setPending(true)
        return fetch("/api/mmx-quota-tool/refresh", { method: "POST", cache: "no-store" })
          .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json() })
          .then(function (body) {
            setSnapshot(body || { rows: [], lastFetchedAt: 0, lastError: "no payload", lastStatus: null, model: null, isMmx: false })
          })
          .catch(function (err) {
            setSnapshot(function (prev) {
              return Object.assign({}, prev || {}, { lastError: String(err && err.message ? err.message : err) })
            })
          })
          .then(function () { setPending(false) })
      }

      _useEffect(function () {
        load()
        var t = setInterval(function () { load() }, 5000)
        return function () { clearInterval(t) }
      }, [])

      if (snapshot && snapshot.isMmx === false) return null

      function onClick(e) {
        e.preventDefault(); e.stopPropagation()
        if (e.shiftKey) refreshNow()
        else setOpen(function (v) { return !v })
      }
      function onKeyDown(e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(function (v) { return !v }) }
        if (e.key === "Escape") { setOpen(false) }
      }
      function onMouseLeave() {
        setTimeout(function () { setOpen(function (current) { return current ? false : current }) }, 80)
      }
      function onPanelMouseLeave() { setOpen(false) }

      if (!snapshot) {
        return React.createElement("div", {
          className: "dsh-mmx-quota-dock", onClick: onClick, onKeyDown: onKeyDown, onMouseLeave: onMouseLeave,
          role: "button", tabIndex: 0,
          "data-pending": pending ? "1" : "0",
          title: "MiniMax 用量 · 加载中",
        },
          React.createElement(QuotabarIcon, { pct: 0, cls: "ok" }),
        )
      }
      var rows = Array.isArray(snapshot.rows) ? snapshot.rows : []
      var hasData = rows.length > 0 && rows.every(function (r) { return r.interval_used_pct !== null && r.weekly_used_pct !== null })
      if (!hasData) {
        return React.createElement("div", {
          className: "dsh-mmx-quota-dock", onClick: onClick, onKeyDown: onKeyDown, onMouseLeave: onMouseLeave,
          role: "button", tabIndex: 0,
          "data-pending": pending ? "1" : "0",
          title: "MiniMax 用量 · " + (snapshot.lastError || "未取到") + " · Shift+点击刷新",
        },
          React.createElement(QuotabarIcon, { pct: 0, cls: "bad" }),
          React.createElement("span", { className: "dsh-mmx-quota-dock__err" }, "!"),
        )
      }
      var worst = rows[0]
      for (var i = 1; i < rows.length; i++) {
        if (rows[i].interval_used_pct > worst.interval_used_pct) worst = rows[i]
      }
      var usage5h = worst.interval_used_pct
      var cls = pctClassByUsage(usage5h)

      var panel = open ? React.createElement("div", {
        className: "dsh-mmx-quota-dock__panel",
        role: "dialog",
        "aria-label": "MiniMax Token Plan 用量详情",
        onClick: function (e) { e.stopPropagation() },
        onMouseDown: function (e) { e.stopPropagation() },
        onMouseLeave: onPanelMouseLeave,
      },
        React.createElement("div", { className: "dsh-mmx-quota-dock__panel-header" },
          React.createElement("span", null, "MiniMax 用量"),
          React.createElement("span", { className: "dsh-mmx-quota-dock__panel-header-meta" }, "Token Plan · " + rows.length + " 个模型"),
        ),
        React.createElement("div", { className: "dsh-mmx-quota-dock__panel-headline" },
          snapshot.model ? (snapshot.model.model + " · " + usage5h + "% 5h 已用") : "当前默认模型",
        ),
        React.createElement("div", { className: "dsh-mmx-quota-dock__panel-list" },
          rows.map(function (r, idx) {
            return React.createElement(RowDetails, { key: r.name + ":" + idx, row: r })
          }),
        ),
        snapshot.lastError ? React.createElement("div", { className: "row-warn" },
          "⚠ " + snapshot.lastError,
        ) : null,
        React.createElement("div", { className: "dsh-mmx-quota-dock__panel-footer" },
          React.createElement("span", { className: "hint" },
            snapshot.lastFetchedAt ? "更新 " + new Date(snapshot.lastFetchedAt).toLocaleTimeString() : "—",
          ),
          React.createElement("span", { className: "hint" }, "Shift+点击刷新"),
        ),
      ) : null

      return React.createElement("div", {
        className: "dsh-mmx-quota-dock", onClick: onClick, onKeyDown: onKeyDown, onMouseLeave: onMouseLeave,
        role: "button", tabIndex: 0,
        "data-pending": pending ? "1" : "0",
        title: "点击查看详情 · Shift+点击刷新",
      },
        React.createElement(QuotabarIcon, { pct: usage5h, cls: cls }),
        React.createElement("span", { className: "dsh-mmx-quota-dock__pct " + cls }, usage5h + "%"),
        panel,
      )
    }

    function apply(ctx) {
      ctx.slots.inject("conversation.input.left", function () {
        ctx.slots.register(
          { name: "conversation.input.left", id: "mmx-quota", order: 100, label: "MiniMax 剩余配额" },
          function (props) {
            return React.createElement(QuotaIcon, {
              ctxRef: ctx,
              css: CSS,
              hooks: { useState: React.useState, useEffect: React.useEffect },
              session: props.session || null,
              input: props.input || null,
            })
          },
        )
      })
    }

    exports.name = name
    exports.inject = inject
    exports.apply = apply
    return module.exports
  },
})