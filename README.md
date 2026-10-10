# vscode-dottr

Visual Studio Code support for [dottr](https://github.com/tkamucheka/dottr)
manifests (`*.dotfile`): highlighting, including the shell scripts of
`shell` blocks, and diagnostics, navigation, rename, hover, completion, and
formatting through the dottr language server, `dottr-lsp`.

## Installation

Requirements: VS Code 1.91 or later, and `dottr-lsp` on `PATH`. `dottr-lsp`
is installed with dottr:

```
curl -fsSL https://raw.githubusercontent.com/tkamucheka/dottr/main/install.sh | sh
```

Build and install the extension from this repository (requires Node.js):

```
npm ci
npm run package
code --install-extension vscode-dottr-0.1.0.vsix
```

## Configuration

| Setting | Default | Meaning |
|---------|---------|---------|
| `dottr.server.path` | `""` | Path of `dottr-lsp`; if empty, `dottr-lsp` is found on `PATH`. |
| `dottr.trace.server` | `"off"` | Traces the communication with the server in the output channel: `off`, `messages`, or `verbose`. |

To format manifests on save, add to `settings.json`:

```json
"[dottr]": {
  "editor.formatOnSave": true
}
```

The command **dottr: Restart Language Server** restarts the server, for
example after installing a new version of dottr.

## Highlighting

Highlighting uses a TextMate grammar. The scripts of `shell` blocks are
highlighted with VS Code's shell grammar. Two cases are highlighted
incorrectly, because a TextMate grammar cannot remove the indentation of a
block before the shell grammar sees it: a heredoc whose terminator is
indented with the block, and an unterminated shell string. Both continue to
the end of the file; the language server is unaffected.

## Development

```
npm run build              # bundle src/ into dist/extension.js
npm test                   # type check and grammar tests
npm run test:integration   # run the extension in VS Code; needs dottr-lsp
```

The grammar tests use the shell grammar of the local VS Code installation;
set `VSCODE_SHELL_GRAMMAR` if it is not found. The integration tests
download VS Code into `.vscode-test`, unless `VSCODE_EXECUTABLE_PATH` names
an installed one, and open a VS Code window.
