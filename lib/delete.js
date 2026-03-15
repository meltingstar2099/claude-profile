const fs = require("fs");
const readline = require("readline");
const { validateName, profileDir } = require("./constants");

function promptConfirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

async function del(name, options) {
  const error = validateName(name);
  if (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }

  const dir = profileDir(name);

  if (!fs.existsSync(dir)) {
    console.error(`Error: Profile "${name}" not found at ${dir}`);
    process.exit(1);
  }

  if (!options.force) {
    const confirmed = await promptConfirm(
      `Delete profile "${name}" at ${dir}? This cannot be undone. (y/N) `
    );
    if (!confirmed) {
      console.log("Cancelled.");
      return;
    }
  }

  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`Profile "${name}" deleted.`);
}

module.exports = del;
