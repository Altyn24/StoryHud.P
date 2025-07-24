import axios from "axios";

export const instans = axios.create({ baseURL: "http://localhost:5001" });
