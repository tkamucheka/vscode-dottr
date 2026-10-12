# vscode-dottr

Visual Studio Code support for [dottr](https://github.com/tkamucheka/dottr)
manifests (`*.dotfile`).

* Highlighting, including the scripts of `shell` blocks, as shell or
  PowerShell scripts
* Diagnostics as you type
* Go to definition, references, rename, and document and workspace symbols
  for units and variables
* Hover, with the values of variables and the dependencies of units
* Completion of keywords, unit names, variables, and block snippets
* Formatting
* Comment toggling, auto-closing quotes and `@{...}`, and indentation of
  blocks

Everything but highlighting and editing is provided by the dottr language
server, `dottr-lsp`.

## Installation

Requirements: VS Code 1.91 or later, and `dottr-lsp`, which is installed with
dottr:

```
curl -fsSL https://raw.githubusercontent.com/tkamucheka/dottr/main/install.sh | sh
```

Build the extension package and install it (requires Node.js):

```
git clone https://github.com/tkamucheka/vscode-dottr.git
cd vscode-dottr
npm ci
npm run package
code --install-extension vscode-dottr-0.1.0.vsix
```

## Configuration

| Setting | Default | Meaning |
|---------|---------|---------|
| `dottr.server.path` | `""` | Path of `dottr-lsp`; if empty, `dottr-lsp` is found in `PATH`. |
| `dottr.trace.server` | `"off"` | Logs the communication with the server in the output channel: `off`, `messages`, or `verbose`. |

To format manifests on save, add to `settings.json`:

```json
"[dottr]": {
  "editor.formatOnSave": true
}
```

The command **dottr: Restart Language Server** restarts the server, for
example after upgrading dottr.

## Known Issues

Two constructs in shell scripts are highlighted incorrectly from the point
where they occur to the end of the file: a heredoc whose terminator is
indented with the block, and an unterminated shell string. Diagnostics and
the other features of the language server are unaffected.

## Development

```
npm run build              # bundle src/ into dist/extension.js
npm test                   # type check and grammar tests
npm run test:integration   # run the extension in VS Code; needs dottr-lsp
```

The grammar tests use the shell and PowerShell grammars of the installed VS
Code; set `VSCODE_SHELL_GRAMMAR` to its `shell-unix-bash.tmLanguage.json`
and `VSCODE_POWERSHELL_GRAMMAR` to its `powershell.tmLanguage.json` if they
are not found. The integration tests download VS Code into `.vscode-test` unless
`VSCODE_EXECUTABLE_PATH` names an installed one, and open a VS Code window.

## License

MIT; see [LICENSE](LICENSE).
