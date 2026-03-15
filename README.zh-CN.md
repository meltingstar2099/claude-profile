# claude-profile

创建和管理隔离的 Claude Code 配置。不同终端可以同时运行不同配置。

## 安装

```bash
npm install -g claude-profile
```

## 使用

### 创建空白配置

```bash
claude-profile create my-profile
```

在 `~/.claude-profiles/my-profile/` 下生成：
- `CLAUDE.md`（空白）
- `rules/`
- `hooks/`
- `skills/`

自行编辑这些文件来定制你的配置。

### 克隆当前配置

```bash
claude-profile clone my-profile
```

将 `~/.claude/` 下的配置（CLAUDE.md、rules、hooks、skills、settings.json、plugins）复制到新 profile。

### 使用指定配置启动 Claude Code

```bash
claude-profile run my-profile
```

以该 profile 的配置启动 Claude Code。你原来的 `~/.claude/` 不受任何影响。

传递额外参数给 Claude Code：

```bash
claude-profile run my-profile -p "hello"
claude-profile run my-profile --model opus
```

### 删除配置

```bash
claude-profile delete my-profile
claude-profile delete my-profile --force  # 跳过确认
```

## 原理

利用 Claude Code 官方支持的两个特性：

- `CLAUDE_CONFIG_DIR` — 重定向配置目录
- `--setting-sources "user,project,local"` — 阻止 `~/.claude/` 的内容泄漏到 profile 中

每个 profile 是一个完全隔离的配置目录。多个终端可以同时运行不同 profile。你原来的 `~/.claude/` 永远不会被修改。

## 并行使用

```bash
# 终端 1
claude-profile run profile-a

# 终端 2
claude-profile run profile-b

# 终端 3（原始配置）
claude
```

三者完全独立，互不干扰。

## 许可证

MIT
