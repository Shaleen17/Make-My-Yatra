const AIRLINE_LOGOS = {
  IndiGo: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/6E.png?v=7",
  "Air India": "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=7",
  AirAsia: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/I5.png?v=7",
  Vistara: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/UK.png?v=7",
  SpiceJet: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/SG.png?v=7",
  GoAir: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/G8.png?v=7",
};

const safeParse = (value, fallback = {}) => {
  try {
    return JSON.parse(value || "{}") || fallback;
  } catch {
    return fallback;
  }
};

export const getSelectedFlight = () => {
  if (typeof window === "undefined") {
    return {};
  }
  return safeParse(window.localStorage.getItem("buy"), {});
};

export const hasSelectedFlight = (flight) =>
  Boolean(flight?.departure?.iata && flight?.arrival?.iata);

export const getAirlineLogo = (flight) =>
  flight?.airline?.logo || AIRLINE_LOGOS[flight?.airline?.name] || "";

export const getInitials = (name) =>
  String(name || "TS")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const formatTime = (scheduled) => {
  if (!scheduled) {
    return "--:--";
  }

  const match = String(scheduled).match(/T(\d{2}:\d{2})/);
  if (match) {
    return match[1];
  }

  const date = new Date(scheduled);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });
};

export const formatDate = (scheduled) => {
  if (!scheduled) {
    return "Date to be confirmed";
  }

  const date = new Date(scheduled);
  if (Number.isNaN(date.getTime())) {
    return "Date to be confirmed";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    weekday: "short",
  });
};

export const formatAirport = (airport, code) =>
  [airport, code].filter(Boolean).join(" - ") || "Airport details unavailable";

const getDurationMinutes = (flight) => {
  const directDuration = Number(flight?.durationMinutes || 0);
  if (directDuration > 0) {
    return directDuration;
  }

  const departure = new Date(flight?.departure?.scheduled || "");
  const arrival = new Date(flight?.arrival?.scheduled || "");
  if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime())) {
    return 0;
  }

  let minutes = Math.round((arrival.getTime() - departure.getTime()) / 60000);
  if (minutes < 0) {
    minutes += 24 * 60;
  }
  return Math.max(minutes, 0);
};

export const formatDuration = (flight) => {
  if (flight?.durationText) {
    return flight.durationText;
  }

  const minutes = getDurationMinutes(flight);
  if (!minutes) {
    return "Duration unavailable";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const getStopText = (flight) => {
  if (flight?.stopText) {
    return flight.stopText;
  }

  const stops = Number(flight?.stops || 0);
  if (stops === 0) {
    return "Non stop";
  }
  if (stops === 1) {
    return "1 stop";
  }
  return `${stops} stops`;
};

export const getTravelClass = (flight) => flight?.travelClass || "Economy";

export const getFlightNumber = (flight) =>
  flight?.flight?.iata || flight?.flight?.number || "Flight";

export const getFareAmount = (flight) => {
  const liveFare = Number(flight?.price?.amount || 0);
  if (liveFare > 0) {
    return liveFare;
  }

  const legacyDelay = Number(flight?.departure?.delay || 0);
  if (legacyDelay > 0) {
    return legacyDelay * 200;
  }

  return 5305;
};

export const getCurrency = (flight) => flight?.price?.currency || "INR";

export const formatAmount = (amount, currency = "INR") =>
  `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;

export const getFareBreakup = (flight) => {
  const total = getFareAmount(flight);
  const fees = Math.min(745, Math.max(Math.round(total * 0.14), 0));
  const services = total > 0 ? 10 : 0;
  const discount = total > 1500 ? 500 : 0;
  const base = Math.max(total - fees - services + discount, 0);

  return {
    base,
    discount,
    fees,
    services,
    total,
  };
};

export const saveFareAmount = (flight) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem("price", JSON.stringify(getFareAmount(flight)));
};

