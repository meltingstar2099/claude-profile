# claude-profile

Create and manage isolated Claude Code configuration profiles. Run different profiles in different terminals simultaneously.

## Install

```bash
npm install -g claude-profile
```

## Usage

### Create a blank profile

```bash
claude-profile create thinking
```

Creates `~/.claude-profiles/thinking/` with:
- `CLAUDE.md` (empty)
- `rules/`
- `hooks/`
- `skills/`

Edit these files to customize your profile.

### Clone your current config

```bash
claude-profile clone coding
```

Copies your existing `~/.claude/` config (CLAUDE.md, rules, hooks, skills, settings.json, plugins) into a new profile.

### Run Claude Code with a profile

```bash
claude-profile run thinking
```

Launches Claude Code using the profile's configuration. Your original `~/.claude/` config is untouched.

Pass extra arguments to Claude Code:

```bash
claude-profile run thinking -p "hello"
claude-profile run thinking --model opus
```

### Delete a profile

```bash
claude-profile delete thinking
claude-profile delete thinking --force  # skip confirmation
```

## How it works

Uses two official Claude Code features:

- `CLAUDE_CONFIG_DIR` — redirects the config directory
- `--setting-sources "user,project,local"` — prevents `~/.claude/` from leaking into the profile

Each profile is a complete, isolated config directory. Multiple terminals can run different profiles simultaneously. Your original `~/.claude/` is never modified.

## Parallel usage

```bash
# Terminal 1
claude-profile run thinking

# Terminal 2
claude-profile run coding

# Terminal 3 (original config)
claude
```

All three run independently with their own configurations.

## License

MIT
