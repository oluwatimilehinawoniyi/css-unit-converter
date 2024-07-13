import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const hoverProvider = vscode.languages.registerHoverProvider(
    ["css", "scss", "less"],
    {
      provideHover(document, position, token) {
        const config = vscode.workspace.getConfiguration("cssUnitConverter");
        const showAsComment = config.get<boolean>("showAsComment", false);

        const range = document.getWordRangeAtPosition(
          position,
          /\d+(px|em|rem|%|vh|vw)/
        );
        if (range) {
          const word = document.getText(range);
          const conversion = convertUnits(word);

          if (showAsComment) {
            const edit = new vscode.WorkspaceEdit();
            const commentPosition = new vscode.Position(
              range.end.line,
              range.end.character
            );
            edit.insert(document.uri, commentPosition, ` /* ${conversion} */`);
            vscode.workspace.applyEdit(edit);
          }

          return new vscode.Hover(conversion);
        }
        return null;
      },
    }
  );

  context.subscriptions.push(hoverProvider);
}
type CSSUnit = "px" | "em" | "rem";

function convertUnits(value: string): string {
  const unit = value.match(/[a-z%]+/i)?.[0];
  if (!unit) {
    return "Invalid unit";
  }

  const number = parseFloat(value);

  const conversions: { [key in CSSUnit]: string } = {
    px: `${number}px = ${(number / 16).toFixed(2)}rem / ${(number / 16).toFixed(2)}em / ${number * 0.264583}cm`,
    em: `${number}em = ${number * 16}px / ${number}rem`,
    rem: `${number}rem = ${number * 16}px / ${number}em`,
  };

  if (!isCSSUnit(unit)) {
    return "No conversion available";
  }

  return conversions[unit];
}

function isCSSUnit(unit: string): unit is CSSUnit {
  return ["px", "em", "rem"].includes(unit);
}

export function deactivate() {}
