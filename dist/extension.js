"use strict";var g=Object.create;var c=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var l=Object.getPrototypeOf,$=Object.prototype.hasOwnProperty;var w=(n,o)=>{for(var e in o)c(n,e,{get:o[e],enumerable:!0})},m=(n,o,e,s)=>{if(o&&typeof o=="object"||typeof o=="function")for(let i of f(o))!$.call(n,i)&&i!==e&&c(n,i,{get:()=>o[i],enumerable:!(s=x(o,i))||s.enumerable});return n};var C=(n,o,e)=>(e=n!=null?g(l(n)):{},m(o||!n||!n.__esModule?c(e,"default",{value:n,enumerable:!0}):e,n)),S=n=>m(c({},"__esModule",{value:!0}),n);var b={};w(b,{activate:()=>h,deactivate:()=>P});module.exports=S(b);var t=C(require("vscode"));function h(n){let o=t.languages.registerHoverProvider(["css","scss","less"],{provideHover(e,s,i){let d=t.workspace.getConfiguration("cssUnitConverter").get("showAsComment",!1),r=e.getWordRangeAtPosition(s,/\d+(px|em|rem|%|vh|vw)/);if(r){let p=e.getText(r),a=U(p);if(d){let v=new t.WorkspaceEdit,u=new t.Position(r.end.line,r.end.character);v.insert(e.uri,u,` /* ${a} */`),t.workspace.applyEdit(v)}return new t.Hover(a)}return null}});n.subscriptions.push(o)}function U(n){let o=n.match(/[a-z%]+/i)?.[0];if(!o)return"Invalid unit";let e=parseFloat(n),s={px:`${e}px = ${(e/16).toFixed(2)}rem / ${(e/16).toFixed(2)}em / ${e*.264583}cm`,em:`${e}em = ${e*16}px / ${e}rem`,rem:`${e}rem = ${e*16}px / ${e}em`};return k(o)?s[o]:"No conversion available"}function k(n){return["px","em","rem"].includes(n)}function P(){}0&&(module.exports={activate,deactivate});