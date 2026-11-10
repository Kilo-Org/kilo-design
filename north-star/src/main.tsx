import { createRoot } from "react-dom/client";
import tokensCss from "virtual:kilo-tokens";
import "./shell/theme.css";
import "./shell/shell.css";
import { App } from "./App";

// Tokens first, so the app's own styles can override nothing by accident.
document.head.insertAdjacentHTML("afterbegin", `<style>${tokensCss}</style>`);

createRoot(document.getElementById("app")!).render(<App />);
