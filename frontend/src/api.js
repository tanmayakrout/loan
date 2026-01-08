import axios from "axios";

// When running via Vite dev, proxy is used: /api → backend
// In production (K8s), you'll change baseURL via env or ingress.
const api = axios.create({
  baseURL: "/api"
});

export default api;

