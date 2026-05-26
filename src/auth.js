import axios from "axios";
import Cookies from "universal-cookie";
import { AUTH_API_BASE_URL } from "./config";
const cookies = new Cookies();

axios.defaults.withCredentials = true;
class Auth {
  constructor() {
    this.authenticated = false;
    this.storageKey = "tirthSutraUser";
    this.eventName = "tirthSutraAuthChanged";
  }

  isAuthenticated() {
    const accessToken = cookies.get("authSession");
    const refreshToken = cookies.get("refreshTokenID");
    this.authenticated = Boolean(accessToken || refreshToken);
    return this.authenticated;
  }

  getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || "null");
    } catch {
      return null;
    }
  }

  setStoredUser(user) {
    if (!user) {
      return;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  clearStoredUser() {
    localStorage.removeItem(this.storageKey);
  }

  notifyAuthChange(user = this.getStoredUser()) {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(new CustomEvent(this.eventName, {
      detail: {
        authenticated: this.authenticated,
        user,
      },
    }));
  }

  subscribe(listener) {
    if (typeof window === "undefined") {
      return () => undefined;
    }

    const handler = (event) => listener(event.detail || {});
    window.addEventListener(this.eventName, handler);
    return () => window.removeEventListener(this.eventName, handler);
  }

  async refreshSession() {
    const response = await axios.post(`${AUTH_API_BASE_URL}/refresh`, {});
    return response.data;
  }

  async fetchCurrentUser() {
    let response;
    try {
      response = await axios.get(`${AUTH_API_BASE_URL}/me`);
    } catch (error) {
      if (error.response?.status !== 401 || !cookies.get("refreshTokenID")) {
        throw error;
      }
      await this.refreshSession();
      response = await axios.get(`${AUTH_API_BASE_URL}/me`);
    }
    this.setStoredUser(response.data.user);
    this.authenticated = true;
    this.notifyAuthChange(response.data.user);
    return response.data.user;
  }

  async login(credentials) {
    const response = await axios.post(`${AUTH_API_BASE_URL}/login`, credentials);
    this.setStoredUser(response.data.user);
    this.authenticated = true;
    this.notifyAuthChange(response.data.user);
    return response.data;
  }

  async signup(payload) {
    const response = await axios.post(`${AUTH_API_BASE_URL}/register`, payload);
    this.setStoredUser(response.data.user);
    this.authenticated = true;
    this.notifyAuthChange(response.data.user);
    return response.data;
  }

  async logout() {
    await axios.post(`${AUTH_API_BASE_URL}/logout`, {}).catch(() => undefined);
    this.authenticated = false;
    this.clearStoredUser();
    this.notifyAuthChange(null);
  }
}

const auth = new Auth();

export default auth;
