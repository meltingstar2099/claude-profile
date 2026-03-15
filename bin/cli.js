#!/usr/bin/env node

const { program } = require("commander");
const create = require("../lib/create");
const clone = require("../lib/clone");
const run = require("../lib/run");
const del = require("../lib/delete");

// Handle "run" manually to allow transparent passthrough of all args to claude
const rawArgs = process.argv.slice(2);
if (rawArgs[0] === "run") {
  const name = rawArgs[1];
  if (!name || name.startsWith("-")) {
    console.error("Usage: claude-profile run <name> [claude args...]");
    process.exit(1);
  }
  const extraArgs = rawArgs.slice(2);
  run(name, extraArgs);
} else {
  program
    .name("claude-profile")
    .description("Create and manage isolated Claude Code configuration profiles")
    .version("1.0.0");

  program
    .command("create <name>")
    .description("Create a new blank profile with skeleton directories")
    .action((name) => {
      create(name);
    });

  program
    .command("clone <name>")
    .description("Clone current ~/.claude/ config into a new profile")
    .action((name) => {
      clone(name);
    });

  program
    .command("run <name> [args...]")
    .description("Launch Claude Code with the specified profile");

  program
    .command("delete <name>")
    .description("Delete a profile")
    .option("-f, --force", "Skip confirmation prompt")
    .action((name, options) => {
      del(name, options);
    });

  program.parse();
}
