const fs = require("fs");
const path = require("path");
const { PROFILES_DIR, CLAUDE_DIR, CLONE_ITEMS, validateName, profileDir } = require("./constants");

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function clone(name) {
  const error = validateName(name);
  if (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }

  const dir = profileDir(name);

  if (fs.existsSync(dir)) {
    console.error(`Error: Profile "${name}" already exists at ${dir}`);
    process.exit(1);
  }

  if (!fs.existsSync(CLAUDE_DIR)) {
    console.error(`Error: Claude Code config directory not found at ${CLAUDE_DIR}`);
    process.exit(1);
  }

  // Create profiles root and profile directory
  fs.mkdirSync(dir, { recursive: true });

  const copied = [];
  const skipped = [];

  for (const item of CLONE_ITEMS) {
    const src = path.join(CLAUDE_DIR, item.name);
    const dest = path.join(dir, item.name);

    if (!fs.existsSync(src)) {
      skipped.push(item.name);
      continue;
    }

    if (item.type === "dir") {
      copyRecursive(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
    copied.push(item.name);
  }

  console.log(`Profile "${name}" cloned from ${CLAUDE_DIR} to ${dir}`);
  console.log("");
  if (copied.length > 0) {
    console.log("Copied:");
    for (const item of copied) {
      console.log(`  ${item}`);
    }
  }
  if (skipped.length > 0) {
    console.log("Skipped (not found in source):");
    for (const item of skipped) {
      console.log(`  ${item}`);
    }
  }
  console.log("");
  console.log("Usage:");
  console.log(`  claude-profile run ${name}`);
}

module.exports = clone;
