import axios from "axios";

export const instanse = axios.create({ baseURL: "https://edccbc035d8b.ngrok-free.app", headers: {
    "ngrok-skip-browser-warning": true,
} });
