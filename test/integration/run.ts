// Runs the integration tests in VS Code with this extension loaded. VS Code is
// downloaded into .vscode-test unless VSCODE_EXECUTABLE_PATH names an
// installed VS Code. dottr-lsp must be on PATH.

import * as path from "node:path";
import { runTests } from "@vscode/test-electron";

async function main(): Promise<void> {
  const extensionDevelopmentPath = path.resolve(__dirname, "../../..");
  await runTests({
    extensionDevelopmentPath,
    extensionTestsPath: path.resolve(__dirname, "suite/index"),
    vscodeExecutablePath: process.env.VSCODE_EXECUTABLE_PATH || undefined,
    launchArgs: [
      path.resolve(extensionDevelopmentPath, "test/integration/workspace"),
      "--disable-extensions",
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
