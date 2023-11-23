import { SVGViewer } from "./svg-viewer.js";
import { SVGEditor } from "./svg-editor.js";

document.addEventListener("DOMContentLoaded", () => {
    const viewer = new SVGViewer(document.getElementById("viewport"));
    const editor = new SVGEditor();
});
