const { spawn } = require("child_process");
const { validateName, profileDir } = require("./constants");
const fs = require("fs");

function run(name, extraArgs) {
  const error = validateName(name);
  if (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }

  const dir = profileDir(name);

  if (!fs.existsSync(dir)) {
    console.error(`Error: Profile "${name}" not found at ${dir}`);
    console.error(`Run "claude-profile create ${name}" or "claude-profile clone ${name}" first.`);
    process.exit(1);
  }

  const args = ["--setting-sources", "user,project,local", ...extraArgs];

  const child = spawn("claude", args, {
    stdio: "inherit",
    env: {
      ...process.env,
      CLAUDE_CONFIG_DIR: dir,
    },
  });

  child.on("error", (err) => {
    if (err.code === "ENOENT") {
      console.error("Error: 'claude' command not found. Is Claude Code installed?");
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

module.exports = run;
