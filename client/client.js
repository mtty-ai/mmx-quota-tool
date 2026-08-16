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
      "  color: rgba(230,230,240,0.95); padding: 3px 8px;",
      "  white-space: nowrap; cursor: pointer; user-select: none;",
      "  border-radius: 8px; border: 1px solid rgba(255,255,255,0.18);",
      "  background: rgba(40,40,48,0.55); position: relative; z-index: 4;",
      "}",
      ".dsh-mmx-quota-dock:hover { background: rgba(60,60,72,0.75); }",
      ".dsh-mmx-quota-dock[data-pending='1'] { opacity: 0.55; }",
      ".dsh-mmx-quota-dock__icon { width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle; }",
      ".dsh-mmx-quota-dock__pct { font-weight:700;color:#fff;font-size:12px;font-variant-numeric:tabular-nums;text-shadow:0 0 2px rgba(0,0,0,0.5);min-width:32px;text-align:left;}",
      ".dsh-mmx-quota-dock__pct.ok { color:#4ade80; }",
      ".dsh-mmx-quota-dock__pct.warn { color:#facc15; }",
      ".dsh-mmx-quota-dock__pct.bad { color:#f87171; }",
      ".dsh-mmx-quota-dock__err { color:#fca5a5;font-size:11px;font-weight:600;}",
      ".dsh-mmx-quota-dock__panel {",
      "  position:absolute; z-index:9999; bottom:100%; left:0; margin-bottom:6px;",
      "  width:460px; max-width:92vw; max-height:80vh; overflow:auto;",
      "  background:rgba(20,20,24,0.98); border:1px solid rgba(255,255,255,0.15);",
      "  border-radius:8px; padding:12px 14px; font:11px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
      "  white-space:pre-wrap; word-break:break-word; box-shadow:0 12px 36px rgba(0,0,0,0.5);",
      "  text-align:left; pointer-events:auto; user-select:text;",
      "}",
      ".dsh-mmx-quota-dock__panel h4 { margin:0 0 10px 0;font-size:12px;color:#fff;font-weight:700; }",
      ".dsh-mmx-quota-dock__panel .row { padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.08); }",
      ".dsh-mmx-quota-dock__panel .row:last-child { border-bottom:none; }",
      ".dsh-mmx-quota-dock__panel .row-name { font-weight:700;color:#93c5fd;margin-bottom:4px;font-size:12px; }",
      ".dsh-mmx-quota-dock__panel .row-stat { display:flex;align-items:center;gap:8px;margin:3px 0; }",
      ".dsh-mmx-quota-dock__panel .row-label { color:rgba(220,220,230,0.6);font-size:10px;min-width:28px; }",
      ".dsh-mmx-quota-dock__panel .bar { display:inline-block;width:80px;height:6px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;vertical-align:middle; }",
      ".dsh-mmx-quota-dock__panel .bar > span { display:block;height:100%; }",
      ".dsh-mmx-quota-dock__panel .row-pct { font-weight:700;color:#fff;min-width:38px;font-variant-numeric:tabular-nums;font-size:11px; }",
      ".dsh-mmx-quota-dock__panel .row-det { color:rgba(220,220,230,0.5);font-size:10px; }",
      ".dsh-mmx-quota-dock__panel .ok   { color:#4ade80; }",
      ".dsh-mmx-quota-dock__panel .err  { color:#fca5a5; }",
      ".dsh-mmx-quota-dock__panel .dim  { color:rgba(220,220,230,0.5); }",
      ".dsh-mmx-quota-dock__panel .head { color:#93c5fd; }",
      ".dsh-mmx-quota-dock__panel .footer { margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:rgba(220,220,230,0.5); }",
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
      if (MODEL_NAME_ZH[base]) return MODEL_NAME_ZH[base] + "（" + base + "）"
      if (base.indexOf("minimax") >= 0) {
        for (var k in MODEL_NAME_ZH) {
          if (base.indexOf(k) >= 0) return MODEL_NAME_ZH[k] + "（" + k + "）"
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
      if (cls === "ok") return "#22c55e"
      if (cls === "warn") return "#eab308"
      return "#ef4444"
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
      var fillColor = fillColorByClass(cls)
      var bgColor = "rgba(255,255,255,0.06)"
      var safe = Math.max(0, Math.min(100, pct))
      var fillH = Math.round((safe / 100) * 14)
      return React.createElement("svg", {
        className: "dsh-mmx-quota-dock__icon",
        width: 16, height: 16, viewBox: "0 0 18 18",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-label": "MiniMax 5h usage",
      },
        React.createElement("path", {
          d: "M9 1 C 9 1, 4 7, 4 11.5 A 5 5 0 0 0 14 11.5 C 14 7, 9 1, 9 1 Z",
          fill: bgColor,
          stroke: "rgba(255,255,255,0.35)",
          "stroke-width": "1.2",
        }),
        React.createElement("clipPath", { id: "mmxqt-drop-clip-nm" },
          React.createElement("path", { d: "M9 1 C 9 1, 4 7, 4 11.5 A 5 5 0 0 0 14 11.5 C 14 7, 9 1, 9 1 Z" }),
        ),
        React.createElement("rect", {
          x: 0, y: 17 - fillH, width: 18, height: fillH,
          fill: fillColor, "clip-path": "url(#mmxqt-drop-clip-nm)",
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
        React.createElement("div", { className: "row-name" }, displayName),
        React.createElement("div", { className: "row-stat" },
          React.createElement("span", { className: "row-label" }, "5h"),
          React.createElement("span", { className: "bar" },
            React.createElement("span", { style: { width: Math.max(0, Math.min(100, usage5h)) + "%", background: fillColorByClass(cls5h) } }),
          ),
          React.createElement("span", { className: "row-pct " + cls5h }, usage5h + "%"),
          React.createElement("span", { className: "row-det" }, "已用 (剩 " + r.interval_remaining_pct + "%)"),
        ),
        React.createElement("div", { className: "row-stat" },
          React.createElement("span", { className: "row-label" }, "周"),
          React.createElement("span", { className: "bar" },
            React.createElement("span", { style: { width: Math.max(0, Math.min(100, usageWeek)) + "%", background: fillColorByClass(clsWeek) } }),
          ),
          React.createElement("span", { className: "row-pct " + clsWeek }, usageWeek + "%"),
          React.createElement("span", { className: "row-det" }, "已用 (剩 " + r.weekly_remaining_pct + "%)"),
        ),
        React.createElement("div", { className: "row-det", style: { marginTop: "4px" } },
          "5h: 用 " + r.interval_used + "/" + r.interval_total + (reset5h ? ", " + reset5h + " 后重置" : ""),
          React.createElement("br", null),
          "周: 用 " + r.weekly_used + "/" + r.weekly_total + (resetWeek ? ", " + resetWeek + " 后重置" : ""),
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
        onClick: function (e) { e.stopPropagation() },
        onMouseDown: function (e) { e.stopPropagation() },
        onMouseLeave: onPanelMouseLeave,
      },
        React.createElement("h4", null, "MiniMax Token Plan · " + rows.length + " 个模型"),
        rows.map(function (r, idx) {
          return React.createElement(RowDetails, { key: r.name + ":" + idx, row: r })
        }),
        React.createElement("div", { className: "footer" },
          snapshot.lastFetchedAt ? React.createElement("span", null, "更新于: " + new Date(snapshot.lastFetchedAt).toLocaleTimeString() + "  ·  ") : null,
          React.createElement("span", { className: "dim" }, "点击图标关闭 · Shift+点击刷新"),
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