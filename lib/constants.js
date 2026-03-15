const path = require("path");
const os = require("os");

const PROFILES_DIR = path.join(os.homedir(), ".claude-profiles");
const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

// Directories to create for a blank profile
const SKELETON_DIRS = ["rules", "hooks", "skills"];

// Files/dirs to copy when cloning from ~/.claude/
const CLONE_ITEMS = [
  { name: "CLAUDE.md", type: "file" },
  { name: "rules", type: "dir" },
  { name: "hooks", type: "dir" },
  { name: "skills", type: "dir" },
  { name: "settings.json", type: "file" },
  { name: "plugins", type: "dir" },
];

function validateName(name) {
  if (!name) {
    return "Profile name is required.";
  }
  if (!NAME_REGEX.test(name)) {
    return `Invalid profile name "${name}". Only letters, numbers, hyphens, and underscores are allowed.`;
  }
  return null;
}

function profileDir(name) {
  return path.join(PROFILES_DIR, name);
}

module.exports = {
  PROFILES_DIR,
  CLAUDE_DIR,
  NAME_REGEX,
  SKELETON_DIRS,
  CLONE_ITEMS,
  validateName,
  profileDir,
};
