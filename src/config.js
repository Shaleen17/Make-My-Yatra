export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:2345";

export const AUTH_API_BASE_URL =
  process.env.REACT_APP_AUTH_API_BASE_URL || `${API_BASE_URL}/api/v1/auth`;

export const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL || window.location.origin;

export const AVIATIONSTACK_BASE_URL =
  process.env.REACT_APP_AVIATIONSTACK_BASE_URL ||
  "http://api.aviationstack.com/v1";

export const AVIATIONSTACK_ACCESS_KEY =
  process.env.REACT_APP_AVIATIONSTACK_ACCESS_KEY || "";

export const RAZORPAY_KEY_ID =
  process.env.REACT_APP_RAZORPAY_KEY_ID || "";
