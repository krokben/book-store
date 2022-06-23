import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./main.css";
import "./components/BookStores.css";

const app = document.getElementById("app");
const root = createRoot(app);
root.render(<App />);
