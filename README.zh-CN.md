# claude-profile

[English](README.md)

创建和管理隔离的 Claude Code 配置。不同终端可以同时运行不同配置。

## 为什么需要这个？

Claude Code 的配置存储在 `~/.claude/` —— 全局只有一套。但你可能需要：

- 一个用于**研究**的配置，一个用于**写代码**的配置，规则完全不同
- 多个终端同时运行 Claude Code，每个使用不同的配置
- 在不影响现有配置的情况下，安全地尝试新配置

`claude-profile` 解决这个问题。每个 profile 是一个完全隔离的 Claude Code 配置。你原来的 `~/.claude/` 永远不会被修改。

## 安装

```bash
npm install -g claude-profile
```

需要已安装 [Node.js](https://nodejs.org/) 和 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)。

## 命令

`<name>` 是你自己取的任意名字，只要是字母、数字、下划线、连字符就行。

| 命令 | 作用 |
|------|------|
| `claude-profile create <name>` | 从零创建空白 profile |
| `claude-profile clone <name>` | 克隆 `~/.claude/` 到新 profile |
| `claude-profile run <name>` | 用指定 profile 启动 Claude Code |
| `claude-profile delete <name> [--force]` | 删除 profile |

---

### `claude-profile create <name>`

从零开始创建一个空白 profile。适合你想要一套全新的、和原始配置完全无关的规则。

```bash
claude-profile create fresh-start
```

生成的目录结构：

```
~/.claude-profiles/fresh-start/
  CLAUDE.md          ← 空白，你自己填写
  rules/             ← 空目录
  hooks/             ← 空目录
  skills/            ← 空目录
```

然后编辑这些文件来定义这个 profile 的行为。目录结构和 `~/.claude/` 完全一样——`~/.claude/` 里能放什么，这里就能放什么。

### `claude-profile clone <name>`

克隆你当前的 `~/.claude/` 配置，生成一个副本作为新 profile。适合你想在现有配置的基础上做修改。

```bash
claude-profile clone my-fork
```

复制的内容：

| 会复制 | 不会复制 |
|--------|----------|
| CLAUDE.md | projects/（项目记忆） |
| rules/ | history.jsonl |
| hooks/ | cache/ |
| skills/ | downloads/ |
| settings.json | session-env/ |
| plugins/ | |

适合你想要一个以当前配置为起点的新 profile，然后在此基础上修改。

**注意：** `clone` 始终从 `~/.claude/`（你的原始配置）复制，不支持从一个 profile 复制到另一个 profile。

### `claude-profile run <name>`

使用指定 profile 的配置启动 Claude Code。

```bash
claude-profile run <name>
```

效果和直接运行 `claude` 一样，但配置读取自 `~/.claude-profiles/<name>/` 而不是 `~/.claude/`。

可以在 profile 名后面传递任何 Claude Code 参数：

```bash
claude-profile run <name> -p "hello"          # 打印模式
claude-profile run <name> --model opus         # 指定模型
claude-profile run <name> -c                   # 继续上次对话
```

### `claude-profile delete <name>`

删除一个 profile 及其所有内容。

```bash
claude-profile delete <name>           # 会要求确认
claude-profile delete <name> --force   # 跳过确认
```

只会删除 `~/.claude-profiles/` 下的 profile，永远不会碰你的 `~/.claude/`。

## 并行使用

核心优势：同时运行多个不同配置的 Claude Code 实例。

```bash
# 终端 1 — profile A
claude-profile run profile-a

# 终端 2 — profile B
claude-profile run profile-b

# 终端 3 — 你原来的 ~/.claude/ 配置
claude
```

三个会话完全独立。不同的 CLAUDE.md、不同的 rules、不同的 MCP servers、不同的 plugins。互不干扰。

## 原理

利用 Claude Code 官方支持的两个特性：

- **`CLAUDE_CONFIG_DIR`** 环境变量 — 让 Claude Code 从指定目录读取配置，而不是 `~/.claude/`
- **`--setting-sources "user,project,local"`** — 阻止原始 `~/.claude/` 的配置泄漏到 profile 会话中

当你运行 `claude-profile run <name>` 时，等价于：

```bash
CLAUDE_CONFIG_DIR=~/.claude-profiles/<name> claude --setting-sources "user,project,local"
```

## 安全性

- 你的 `~/.claude/` **永远不会被任何命令修改**
- 你的 `~/.zshrc` / `~/.bashrc` **永远不会被触碰**
- 所有 profile 数据都在 `~/.claude-profiles/` 内 — 删除这个目录就一切恢复原状
- 认证信息是共享的（存储在系统钥匙串中，不在 `~/.claude/` 内），新 profile 不需要重新登录

## 许可证

MIT
