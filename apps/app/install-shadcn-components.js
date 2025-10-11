import { spawn } from "child_process";

const components = [
  "button",
  "input",
  "select",
  "card",
  "badge",
  "avatar",
  "dialog",
  "tooltip",
  "table",
  "textarea",
  //
  "spinner",
  "switch",
];

function installComponent(name) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 Installing component: ${name}`);
    const command = `pnpm dlx shadcn@latest add ${name} -o`;
    const child = spawn(command, {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ Successfully installed: ${name}`);
        resolve();
      } else {
        console.error(`❌ Failed to install: ${name} (exit code ${code})`);
        reject(new Error(`Exit code ${code}`));
      }
    });
  });
}

async function run() {
  for (const component of components) {
    try {
      await installComponent(component);
    } catch (err) {
      console.warn(`⚠️ Skipping ${component} due to error.`);
    }
  }

  console.log("\n🎉 All components processed.");
}

run();
