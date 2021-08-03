import "@picocss/pico/css/pico.min.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./index.css";
import "./assets/icon.png";
import { ipcRenderer } from "electron";
import IndexController from "./Controllers/IndexController";

let controller = new IndexController(ipcRenderer);
controller.init();
