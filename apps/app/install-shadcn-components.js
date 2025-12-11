import { spawn } from "child_process";

const components = [
  "avatar",
  "badge",
  "button",
  "card",
  "dialog",
  "input",
  "pagination",
  "select",
  "slider",
  "spinner",
  "switch",
  "table",
  "textarea",
  "tooltip",
];

function installComponent(name, index) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 Installing component: ${name}, ${index} of ${components.length}`);
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
  for (const [index, component] of components.entries()) {
    try {
      await installComponent(component, index);
    } catch (err) {
      console.warn(`⚠️ Skipping ${component} due to error.`);
    }
  }

  console.log("\n🎉 All components processed.");
}

run();
