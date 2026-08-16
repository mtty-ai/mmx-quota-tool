# mmx-quota-tool

MiniMax token-plan quota dock for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) web.

Shows a drop-shape icon + 5h **usage %** in the conversation input area (next to the model selector). Click for a detail panel listing every model's 5h & weekly usage, reset countdown, and absolute numbers. Auto-hides when the active default model is not a MiniMax model.

![demo placeholder](https://placehold.co/600x80/222/eee?text=MiniMax+5h+78%25+%E2%97%89)

## Install

```sh
dsh plugin --profile web add github:mtty-ai/mmx-quota-tool
```

Then restart `dsh web` once.

### Manual install (development)

```sh
git clone https://github.com/mtty-ai/mmx-quota-tool
cd mmx-quota-tool
# copy or link the package into your profile's node_modules
cp -R . ~/.dsh/profiles/web/node_modules/mmx-quota-tool/
```

Then add the row to `~/.dsh/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: mmx-quota-tool
      name: mmx-quota-tool
```

## Configuration

This plugin requires a MiniMax API key. Export it before launching `dsh web`:

```sh
export MMX_API_KEY='sk-cp-your-key-here'
dsh web
```

Or put it in your shell rc (`~/.zshrc`, `~/.bashrc`).

Optional environment variables:

| Var                   | Default                              | Purpose                                |
| --------------------- | ------------------------------------ | -------------------------------------- |
| `MMX_API_KEY`         | *(required)*                         | MiniMax Bearer + x-api-key             |
| `MMX_REGION`          | `cn`                                 | `cn` (api.minimaxi.com) or `global` (api.minimax.io) |
| `MMX_REFRESH_MS`      | `60000`                              | Host poll interval against upstream    |
| `MMX_POLL_INTERVAL_MS`| `5000`                               | *(client bundle)* Client fetch interval|

The client bundle polls the host every 5 s so model-switch visibility is
within 5 s; the actual upstream fetch runs every `MMX_REFRESH_MS`.

## Behavior

- The dock appears in the conversation input area (`conversation.input.left`),
  adjacent to the model selector.
- Icon is a drop/water shape, filled by 5h **usage** % (lower bar = better):
  - `< 50%` green
  - `< 80%` yellow
  - `≥ 80%` red
- Click toggles a detail panel; mouse-leave the dock or panel closes it.
- Shift+click forces an immediate upstream refresh.
- The dock is hidden entirely when the active default model is not a MiniMax
  model — matched providers `minimax / minimax-cn / minimax-global / MiniMax*`
  or model prefixes `MiniMax- / minimax-`.
- Model name labels are translated to Chinese (通用 / 视频 / 图像 / 音频 /
  语音 / 音乐 / 视觉 / 向量 / 实时 / 长文本).

## Architecture

| Half   | File                  | Responsibility                                       |
| ------ | --------------------- | ---------------------------------------------------- |
| Host   | `src/index.js`        | 60 s upstream poll + exposes two HTTP routes          |
| Client | `client/client.js`    | 5 s poll + mounts the dock UI in `conversation.input.left` |

The host registers two routes on the profile's `webServer`:

- `GET  /api/mmx-quota-tool/quota`    — current snapshot
- `POST /api/mmx-quota-tool/refresh`  — force refresh

Returns `{ rows, lastFetchedAt, lastError, lastStatus, model, isMmx,
refreshIntervalMs }`.

The client polls `quota` and renders `null` when `isMmx === false`, so
switching to a non-MiniMax model hides the dock within 5 s.

## Files

```
.
├── README.md
├── LICENSE
├── package.json             # dsh.bundle + dsh.client declaration + exports
├── cordis.patch.yml         # dsh bundle patch (registers the row)
├── src/index.js             # host: HTTP routes + 60s upstream poll
└── client/client.js         # browser: 5s poll + React UI + injected <style>
```

## License

MIT