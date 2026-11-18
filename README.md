# dsh-karpathy-guidelines

A DeepSeek Harness plugin that adds the `karpathy-guidelines` skill: four
behavioral rules for coding work, derived from
[Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876)
on LLM coding pitfalls. It is a DSH adaptation of
[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills).

The skill covers:

1. **Think Before Coding** — state assumptions, surface tradeoffs, ask when unclear.
2. **Simplicity First** — minimum code, no speculative abstractions or options.
3. **Surgical Changes** — touch only what the request needs, clean up only your own orphans.
4. **Goal-Driven Execution** — turn tasks into verifiable success criteria and loop until they pass.

## Install

- **Plugin market** — open **Plugins** → **Plugin market** (the `dshmarket` tab)
  and search for **Karpathy guidelines**. On hosts without that tab, use
  **Plugins** → **Discover** with a configured plugin index instead.
- **Local directory** — open **Plugins** → **Add plugin** and choose this directory.
- **Command line** — `dsh plugin --profile <profile> add github:echo-ix/dsh-andrej-karpathy`

Installing enables the bundle, which inserts the `karpathy-guidelines` row. The
skill joins the session skill catalog right away, and an open session receives a
replacement catalog.

## Use

The catalog always carries the skill's name and a short description. The full
instructions enter the context only when they are loaded: the model calls the
`skill` tool, or you type `/karpathy-guidelines` in a message. To turn it off,
disable the bundle in **Plugins**; its catalog entry and row disappear.

## What it changes

- Adds one skill to the catalog. It adds no tools, commands, UI, or configuration.
- The skill body is read once when the bundle activates. Edit
  `skill/karpathy-guidelines.md` and restart DSH to change the text.
- The plugin has no dependencies, no build step, and runs no install scripts.
- It does not replace project instructions in `AGENTS.md` or `CLAUDE.md`; those
  still apply alongside it.

## 中文说明

这个插件把 Karpathy 的四条编码准则做成了 DSH 的按需技能 `karpathy-guidelines`：
先想再写、保持简单、外科手术式修改、以可验证目标推进。在 **插件** → **插件市场**
里搜索安装（或 **插件** → **发现** 配合索引源），也可以在 **插件** → **添加插件**
中选择本目录。技能正文只在加载时进入上下文（目录里始终有技能名和一段说明），
也可以用 `/karpathy-guidelines` 直接加载；关闭插件后条目与插件行都会消失。它不会取代
项目里的 `AGENTS.md` / `CLAUDE.md`。

## Source and license

Guidelines and text are from
[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills),
MIT licensed. The DSH packaging keeps that license; see `LICENSE`.
