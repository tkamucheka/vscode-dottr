import * as assert from "node:assert";
import * as path from "node:path";
import * as vscode from "vscode";

const manifest = path.resolve(
  __dirname,
  "../../../../test/integration/workspace/packages.dotfile",
);

/** Polls until value returns a defined result. */
async function waitFor<T>(value: () => T | undefined, ms = 30000): Promise<T> {
  const deadline = Date.now() + ms;
  for (;;) {
    const result = value();
    if (result !== undefined) {
      return result;
    }
    if (Date.now() > deadline) {
      throw new Error("timed out");
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

function hoverText(hovers: vscode.Hover[]): string {
  return hovers
    .flatMap((hover) => hover.contents)
    .map((content) => (typeof content === "string" ? content : content.value))
    .join("\n");
}

suite("dottr", () => {
  test("language, diagnostics, hover, and formatting", async () => {
    const document = await vscode.workspace.openTextDocument(manifest);
    await vscode.window.showTextDocument(document);
    assert.strictEqual(document.languageId, "dottr");

    const diagnostics = await waitFor(() => {
      const found = vscode.languages.getDiagnostics(document.uri);
      return found.length > 0 ? found : undefined;
    });
    assert.match(diagnostics[0].message, /unit `missing` is not declared/);

    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      "vscode.executeHoverProvider",
      document.uri,
      new vscode.Position(2, 9),
    );
    assert.match(hoverText(hovers), /local ROOT = /);

    const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
      "vscode.executeFormatDocumentProvider",
      document.uri,
      { tabSize: 2, insertSpaces: true },
    );
    assert.strictEqual(edits.length, 1);
    assert.match(edits[0].newText, /^pkg git\n/);
  });
});
