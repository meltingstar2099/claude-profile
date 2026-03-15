const fs = require("fs");
const path = require("path");
const { PROFILES_DIR, SKELETON_DIRS, validateName, profileDir } = require("./constants");

function create(name) {
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

  // Create profiles root if needed
  fs.mkdirSync(PROFILES_DIR, { recursive: true });

  // Create profile directory
  fs.mkdirSync(dir, { recursive: true });

  // Create skeleton subdirectories
  for (const sub of SKELETON_DIRS) {
    fs.mkdirSync(path.join(dir, sub), { recursive: true });
  }

  // Create empty CLAUDE.md
  fs.writeFileSync(path.join(dir, "CLAUDE.md"), "# Claude Code Profile: " + name + "\n\n");

  console.log(`Profile "${name}" created at ${dir}`);
  console.log("");
  console.log("Directory structure:");
  console.log(`  ${dir}/`);
  console.log(`    CLAUDE.md`);
  for (const sub of SKELETON_DIRS) {
    console.log(`    ${sub}/`);
  }
  console.log("");
  console.log("Usage:");
  console.log(`  claude-profile run ${name}`);
}

module.exports = create;
