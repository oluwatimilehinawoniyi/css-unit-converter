"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
function activate(context) {
  const hoverProvider = vscode.languages.registerHoverProvider(
    ["css", "scss", "less"],
    {
      provideHover(document, position, token) {
        const config = vscode.workspace.getConfiguration("cssUnitConverter");
        const showAsComment = config.get("showAsComment", false);
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
      }
    }
  );
  context.subscriptions.push(hoverProvider);
}
function convertUnits(value) {
  const unit = value.match(/[a-z%]+/i)?.[0];
  if (!unit) {
    return "Invalid unit";
  }
  const number = parseFloat(value);
  const conversions = {
    px: `${number}px = ${(number / 16).toFixed(2)}rem / ${(number / 16).toFixed(2)}em / ${number * 0.264583}cm`,
    em: `${number}em = ${number * 16}px / ${number}rem`,
    rem: `${number}rem = ${number * 16}px / ${number}em`
  };
  if (!isCSSUnit(unit)) {
    return "No conversion available";
  }
  return conversions[unit];
}
function isCSSUnit(unit) {
  return ["px", "em", "rem"].includes(unit);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
