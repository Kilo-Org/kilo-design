import { createRoot } from "react-dom/client";
import "./shell/theme.css";
import "./shell/shell.css";
import { App } from "./App";

createRoot(document.getElementById("app")!).render(<App />);
