// VS Code extension for dottr manifests: starts the dottr-lsp language server
// for documents of the language "dottr". Highlighting is provided by the
// TextMate grammar declared in package.json.

import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

/** The server program: dottr.server.path, or dottr-lsp on PATH. */
function serverCommand(): string {
  const configured = vscode.workspace
    .getConfiguration("dottr")
    .get<string>("server.path", "")
    .trim();
  return configured !== "" ? configured : "dottr-lsp";
}

async function startClient(): Promise<void> {
  const command = serverCommand();
  // No transport is given: vscode-languageclient would otherwise pass
  // --stdio, and dottr-lsp takes no arguments. Standard input and output
  // are used either way.
  const serverOptions: ServerOptions = {
    run: { command },
    debug: { command },
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: "dottr" }],
  };

  // The client id "dottr" makes the setting dottr.trace.server effective.
  const started = new LanguageClient("dottr", "dottr", serverOptions, clientOptions);
  try {
    await started.start();
    client = started;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const choice = await vscode.window.showErrorMessage(
      `dottr: cannot start the language server '${command}' (${reason}). ` +
        "Install dottr, which provides dottr-lsp, or set dottr.server.path.",
      "Open Settings",
    );
    if (choice === "Open Settings") {
      await vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "dottr.server.path",
      );
    }
  }
}

async function stopClient(): Promise<void> {
  const running = client;
  client = undefined;
  if (running) {
    await running.stop();
  }
}

async function restartClient(): Promise<void> {
  await stopClient();
  await startClient();
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand("dottr.restartServer", restartClient),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("dottr.server.path")) {
        void restartClient();
      }
    }),
  );
  await startClient();
}

export async function deactivate(): Promise<void> {
  await stopClient();
}
