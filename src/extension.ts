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
          /\d+(\.\d+)?(px|em|rem|%|vh|vw)/
        );

        // Check if the position is inside a comment
        if (range && !isPositionInComment(range.start, document)) {
          const word = document.getText(range);
          const conversion = convertUnits(word);

          if (showAsComment) {
            const edit = new vscode.WorkspaceEdit();
            const lineText = document.lineAt(range.end.line).text;
            const commentMatch = lineText.match(/\/\*.*\*\//);

            // Remove existing comment if present
            if (commentMatch) {
              const commentRange = new vscode.Range(
                new vscode.Position(range.end.line, commentMatch.index!),
                new vscode.Position(
                  range.end.line,
                  commentMatch.index! + commentMatch[0].length
                )
              );
              edit.delete(document.uri, commentRange);
              vscode.workspace.applyEdit(edit);
            }

            // Insert new comment after the semicolon or at the end of the line
            let commentPosition;
            if (lineText.trim().endsWith(";")) {
              commentPosition = new vscode.Position(
                range.end.line,
                lineText.length
              );
              edit.insert(
                document.uri,
                commentPosition,
                ` /* ${conversion} */`
              );
            } else {
              commentPosition = new vscode.Position(
                range.end.line,
                range.end.character
              );
              edit.insert(
                document.uri,
                commentPosition,
                `; /* ${conversion} */`
              );
            }
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
    px: `${number}px = ${(number / 16).toFixed(2)}rem / ${(number / 16).toFixed(
      2
    )}em / ${(number * 0.264583).toFixed(2)}cm`,
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

function isPositionInComment(
  position: vscode.Position,
  document: vscode.TextDocument
): boolean {
  const text = document.getText();
  const offset = document.offsetAt(position);
  const before = text.substring(0, offset);
  const after = text.substring(offset);

  const isInsideComment = (str: string) => {
    const openComment = str.lastIndexOf("/*");
    const closeComment = str.lastIndexOf("*/");
    return openComment > closeComment;
  };

  return isInsideComment(before) && !isInsideComment(after);
}

export function deactivate() {}
