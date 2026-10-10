// Runs the grammar tests. The scripts of raw blocks embed VS Code's shell
// grammar (source.shell), which is taken from the local VS Code installation
// rather than copied into this repository. VSCODE_SHELL_GRAMMAR overrides the
// search.

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const relative =
  "extensions/shellscript/syntaxes/shell-unix-bash.tmLanguage.json";
const candidates = [
  process.env.VSCODE_SHELL_GRAMMAR,
  `/usr/share/code/resources/app/${relative}`,
  `/usr/lib/code/${relative}`,
  `/opt/visual-studio-code/resources/app/${relative}`,
  `/usr/share/codium/resources/app/${relative}`,
  `/Applications/Visual Studio Code.app/Contents/Resources/app/${relative}`,
].filter(Boolean);

const shell = candidates.find((path) => existsSync(path));
if (!shell) {
  console.error(
    "VS Code's shell grammar was not found; set VSCODE_SHELL_GRAMMAR to " +
      `the path of ${relative} in a VS Code installation.`,
  );
  process.exit(2);
}

const result = spawnSync(
  "npx",
  [
    "vscode-tmgrammar-test",
    "-g", "syntaxes/dottr.tmLanguage.json",
    "-g", shell,
    "test/grammar/*.dotfile",
  ],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
