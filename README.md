# claude-profile

[中文说明](README.zh-CN.md)

Create and manage isolated Claude Code configuration profiles. Run different profiles in different terminals simultaneously.

## Why?

Claude Code reads its configuration from `~/.claude/` — one global config for everything. But you might want:

- A **research** profile with one set of rules, and a **coding** profile with another
- Multiple terminals running Claude Code with completely different configurations at the same time
- A way to experiment with new configs without touching your working setup

`claude-profile` solves this. Each profile is a fully isolated Claude Code configuration. Your original `~/.claude/` is never modified.

## Install

```bash
npm install -g claude-profile
```

Requires [Node.js](https://nodejs.org/) and [Claude Code](https://docs.anthropic.com/en/docs/claude-code) to be installed.

## Commands

### `claude-profile create <name>`

Creates a new blank profile with empty skeleton files.

```bash
claude-profile create my-profile
```

This creates `~/.claude-profiles/my-profile/` with:

```
~/.claude-profiles/my-profile/
  CLAUDE.md          ← empty, you fill it in
  rules/             ← empty directory
  hooks/             ← empty directory
  skills/            ← empty directory
```

You then edit these files to define the profile's behavior. The structure is the same as `~/.claude/` — anything you can put in `~/.claude/`, you can put here.

### `claude-profile clone <name>`

Creates a new profile by copying your current `~/.claude/` configuration.

```bash
claude-profile clone my-profile
```

This copies the following from `~/.claude/` into the new profile:

| Copied | Not copied |
|--------|------------|
| CLAUDE.md | projects/ (project memory) |
| rules/ | history.jsonl |
| hooks/ | cache/ |
| skills/ | downloads/ |
| settings.json | session-env/ |
| plugins/ | |

Use this when you want a new profile that starts as a copy of your current setup, then modify it from there.

**Note:** `clone` always copies from `~/.claude/` (your original config). It does not copy from one profile to another.

### `claude-profile run <name>`

Launches Claude Code using the specified profile's configuration.

```bash
claude-profile run my-profile
```

This opens an interactive Claude Code session, just like running `claude` — but it reads configuration from `~/.claude-profiles/my-profile/` instead of `~/.claude/`.

You can pass any Claude Code arguments after the profile name:

```bash
claude-profile run my-profile -p "hello"          # print mode
claude-profile run my-profile --model opus         # use a specific model
claude-profile run my-profile -c                   # continue last session
```

### `claude-profile delete <name>`

Deletes a profile and all its contents.

```bash
claude-profile delete my-profile           # asks for confirmation
claude-profile delete my-profile --force   # no confirmation
```

This only deletes profiles in `~/.claude-profiles/`. It will never touch your original `~/.claude/` config.

## Parallel usage

The main advantage: run multiple Claude Code instances with different configs at the same time.

```bash
# Terminal 1 — profile A
claude-profile run profile-a

# Terminal 2 — profile B
claude-profile run profile-b

# Terminal 3 — your original ~/.claude/ config
claude
```

All three sessions are fully independent. Different CLAUDE.md, different rules, different MCP servers, different plugins. No interference.

## How it works

Uses two official Claude Code features:

- **`CLAUDE_CONFIG_DIR`** environment variable — tells Claude Code to read config from a different directory instead of `~/.claude/`
- **`--setting-sources "user,project,local"`** — prevents your original `~/.claude/` config from leaking into the profile session

When you run `claude-profile run my-profile`, it's equivalent to:

```bash
CLAUDE_CONFIG_DIR=~/.claude-profiles/my-profile claude --setting-sources "user,project,local"
```

## Safety

- Your original `~/.claude/` is **never modified** by any command
- Your `~/.zshrc` / `~/.bashrc` is **never touched**
- All profile data lives in `~/.claude-profiles/` — delete that directory and everything is gone
- Authentication is shared (stored in system keychain, not in `~/.claude/`), so new profiles don't need to log in again

## License

MIT
