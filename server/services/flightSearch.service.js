const axios = require("axios");
const { env } = require("../config/env");

const DEFAULT_CURRENCY = "INR";
const DEFAULT_TIMEOUT_MS = 30000;

const asArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
};

const toNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const pad = (value) => String(value).padStart(2, "0");

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const toYmd = (date) => {
  if (!date) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
};

const toDmy = (date) => {
  const ymd = toYmd(date);
  if (!ymd) {
    return "";
  }
  const [year, month, day] = ymd.split("-");
  return `${day}-${month}-${year}`;
};

const defaultDepartureDate = () => toYmd(addDays(new Date(), 1));

const normalizeTime = (value) => {
  if (!value) {
    return "00:00";
  }
  const text = String(value).trim();
  const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) {
    return "00:00";
  }
  return `${pad(timeMatch[1])}:${timeMatch[2]}`;
};

const scheduledAt = (date, time) => {
  const ymd = toYmd(date) || defaultDepartureDate();
  return `${ymd}T${normalizeTime(time)}:00+05:30`;
};

const minutesBetween = (start, end) => {
  const startDate = new Date(start);
  let endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }
  if (endDate < startDate) {
    endDate = addDays(endDate, 1);
  }
  return Math.max(0, Math.round((endDate - startDate) / 60000));
};

const formatDuration = (minutes) => {
  if (!Number.isFinite(minutes)) {
    return "";
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${pad(mins)}m`;
};

const mapTravelClass = (value) => {
  const text = String(value || "economy").toLowerCase();
  if (text.includes("first")) {
    return { serpApi: "4", label: "First" };
  }
  if (text.includes("business")) {
    return { serpApi: "3", label: "Business" };
  }
  if (text.includes("prem")) {
    return { serpApi: "2", label: "Premium Economy" };
  }
  return { serpApi: "1", label: "Economy" };
};

const getPassengerCount = (query) => {
  const explicit = Number(query.adults || query.passengers || query.travellers);
  if (Number.isFinite(explicit) && explicit > 0) {
    return Math.min(Math.floor(explicit), 9);
  }
  const classText = String(query.class || query.cabinClass || "");
  const countMatch = classText.match(/^(\d+)/);
  return countMatch ? Number(countMatch[1]) : 1;
};

const buildSearch = (query) => {
  const departureDate = toYmd(query.departureDate || query.date || query.outboundDate) || defaultDepartureDate();
  const returnDate = toYmd(query.returnDate);
  const tripType = returnDate || query.tripType === "round" ? "round" : "oneway";
  const travelClass = mapTravelClass(query.cabinClass || query.class);

  return {
    from: String(query.from || query.departure_id || "").trim().toUpperCase(),
    to: String(query.to || query.arrival_id || "").trim().toUpperCase(),
    departureDate,
    returnDate,
    tripType,
    passengers: getPassengerCount(query),
    travelClass,
    currency: String(query.currency || DEFAULT_CURRENCY).trim().toUpperCase(),
  };
};

const serpApiParams = (search) => ({
  engine: "google_flights",
  departure_id: search.from,
  arrival_id: search.to,
  outbound_date: search.departureDate,
  ...(search.returnDate ? { return_date: search.returnDate } : {}),
  type: search.returnDate ? "1" : "2",
  travel_class: search.travelClass.serpApi,
  adults: String(search.passengers),
  currency: search.currency,
  gl: "in",
  hl: "en",
  show_hidden: "true",
  no_cache: "true",
  api_key: env.flightSearch.serpApiKey,
});

const normalizeSerpFlight = (item, index, search, bucket) => {
  const segments = asArray(item.flights);
  const first = segments[0] || {};
  const last = segments[segments.length - 1] || first;
  const departureAirport = first.departure_airport || {};
  const arrivalAirport = last.arrival_airport || {};
  const departureTime = departureAirport.time || `${search.departureDate} 00:00`;
  const arrivalTime = arrivalAirport.time || departureTime;
  const [departureDate, departureClock] = String(departureTime).split(" ");
  const [arrivalDate, arrivalClock] = String(arrivalTime).split(" ");
  const departureScheduled = scheduledAt(departureDate, departureClock);
  const arrivalScheduled = scheduledAt(arrivalDate || departureDate, arrivalClock);
  const durationMinutes =
    toNumber(item.total_duration) ||
    segments.reduce((total, segment) => total + (toNumber(segment.duration) || 0), 0) ||
    minutesBetween(departureScheduled, arrivalScheduled);
  const price = toNumber(item.price);
  const stops = Math.max(0, segments.length - 1);

  return {
    id: item.booking_token || `${search.from}-${search.to}-${index}-${bucket}`,
    provider: "serpapi",
    resultGroup: bucket,
    airline: {
      name: first.airline || item.airline || "Multiple airlines",
      logo: first.airline_logo || item.airline_logo || "",
      iata: first.flight_number ? String(first.flight_number).replace(/[0-9\s]/g, "") : "",
    },
    flight: {
      iata: first.flight_number || item.flight_number || "Tirth Flight",
      number: first.flight_number || item.flight_number || "",
    },
    departure: {
      iata: departureAirport.id || search.from,
      airport: departureAirport.name || departureAirport.id || search.from,
      scheduled: departureScheduled,
    },
    arrival: {
      iata: arrivalAirport.id || search.to,
      airport: arrivalAirport.name || arrivalAirport.id || search.to,
      scheduled: arrivalScheduled,
    },
    price: {
      amount: price,
      currency: search.currency,
      display: price ? new Intl.NumberFormat("en-IN", { style: "currency", currency: search.currency, maximumFractionDigits: 0 }).format(price) : "Price unavailable",
    },
    durationMinutes,
    durationText: formatDuration(durationMinutes),
    stops,
    stopText: stops === 0 ? "Non stop" : `${stops} stop${stops > 1 ? "s" : ""}`,
    travelClass: first.travel_class || search.travelClass.label,
    airplane: first.airplane || "",
    carbonEmissions: item.carbon_emissions,
    bookingToken: item.booking_token || "",
    legs: segments.map((segment) => ({
      airline: segment.airline,
      flightNumber: segment.flight_number,
      airplane: segment.airplane,
      departure: segment.departure_airport,
      arrival: segment.arrival_airport,
      duration: segment.duration,
    })),
    fareBadges: [bucket === "best" ? "Best value" : "Live fare", item.type].filter(Boolean),
    raw: item,
  };
};

const normalizeSerpResponse = (payload, search) => {
  const best = asArray(payload.best_flights).map((item, index) =>
    normalizeSerpFlight(item, index, search, "best")
  );
  const other = asArray(payload.other_flights || payload.flights).map((item, index) =>
    normalizeSerpFlight(item, index, search, "other")
  );
  return {
    provider: "serpapi",
    flights: [...best, ...other],
    priceInsights: payload.price_insights || null,
    searchMetadata: payload.search_metadata || null,
  };
};

const searchSerpApi = async (search) => {
  if (!env.flightSearch.serpApiKey) {
    const error = new Error("Google Flight API key is missing.");
    error.statusCode = 503;
    throw error;
  }

  const response = await axios.get("https://serpapi.com/search.json", {
    params: serpApiParams(search),
    timeout: DEFAULT_TIMEOUT_MS,
  });

  if (response.data?.error) {
    const error = new Error(response.data.error);
    error.statusCode = 502;
    throw error;
  }

  return normalizeSerpResponse(response.data || {}, search);
};

const normalizeFlightsApiFlight = (item, index, search) => {
  const departureAirport = item.departureAirport || item.departure_airport || item.departure || {};
  const arrivalAirport = item.arrivalAirport || item.arrival_airport || item.arrival || {};
  const legs = asArray(item.legs || item.segments);
  const firstLeg = legs[0] || {};
  const lastLeg = legs[legs.length - 1] || firstLeg;
  const departureDate = departureAirport.date || firstLeg.departureDate || search.departureDate;
  const arrivalDate = arrivalAirport.date || lastLeg.arrivalDate || departureDate;
  const departureTime = departureAirport.time || firstLeg.departureTime || item.departure_time;
  const arrivalTime = arrivalAirport.time || lastLeg.arrivalTime || item.arrival_time;
  const departureScheduled = scheduledAt(departureDate, departureTime);
  const arrivalScheduled = scheduledAt(arrivalDate, arrivalTime);
  const durationMinutes = toNumber(item.duration) || minutesBetween(departureScheduled, arrivalScheduled);
  const price = toNumber(item.bestPrice || item.price || item.totalPrice || item.amount);
  const stops = Math.max(0, legs.length - 1 || toNumber(item.stops) || 0);
  const airline = item.airline || firstLeg.airline || "Flight";

  return {
    id: item.id || item.bookingToken || `${search.from}-${search.to}-flightsapi-${index}`,
    provider: "flightsapi",
    resultGroup: index === 0 ? "best" : "other",
    airline: {
      name: airline,
      logo: item.airlineLogo || item.airline_logo || "",
      iata: item.airlineCode || "",
    },
    flight: {
      iata: item.flight_number || item.flightNumber || `${airline} ${index + 1}`,
      number: item.flight_number || item.flightNumber || "",
    },
    departure: {
      iata: departureAirport.code || departureAirport.id || firstLeg.departureAirport || search.from,
      airport: departureAirport.name || departureAirport.code || firstLeg.departureAirport || search.from,
      scheduled: departureScheduled,
    },
    arrival: {
      iata: arrivalAirport.code || arrivalAirport.id || lastLeg.arrivalAirport || search.to,
      airport: arrivalAirport.name || arrivalAirport.code || lastLeg.arrivalAirport || search.to,
      scheduled: arrivalScheduled,
    },
    price: {
      amount: price,
      currency: search.currency,
      display: price ? new Intl.NumberFormat("en-IN", { style: "currency", currency: search.currency, maximumFractionDigits: 0 }).format(price) : "Price unavailable",
    },
    durationMinutes,
    durationText: formatDuration(durationMinutes),
    stops,
    stopText: stops === 0 ? "Non stop" : `${stops} stop${stops > 1 ? "s" : ""}`,
    travelClass: item.travelClass || search.travelClass.label,
    airplane: item.airplane || firstLeg?.planeInfo?.plane || "",
    carbonEmissions: firstLeg?.planeInfo?.carbonEmissions || item.carbonEmissions,
    bookingToken: item.bookingToken || "",
    legs,
    fareBadges: [index === 0 ? "Best price" : "Live fare", item.refundable ? "Refundable" : ""].filter(Boolean),
    raw: item,
  };
};

const byId = (items) =>
  asArray(items).reduce((map, item) => {
    if (item?.id !== undefined) {
      map[String(item.id)] = item;
    }
    return map;
  }, {});

const firstPrice = (itinerary) => {
  const options = asArray(itinerary.pricing_options);
  for (const option of options) {
    const amount =
      toNumber(option?.price?.amount) ||
      toNumber(asArray(option?.items)[0]?.price?.amount);
    if (amount) {
      return amount;
    }
  }
  return null;
};

const carrierName = (carrier) =>
  carrier?.name || carrier?.display_code || carrier?.alternate_di || "Flight";

const placeCode = (place, fallback) =>
  place?.iata || place?.display_code || place?.entity_id || place?.code || fallback;

const normalizeFlightApiTrip = (payload, search) => {
  const legsById = byId(payload.legs);
  const segmentsById = byId(payload.segments);
  const placesById = byId(payload.places);
  const carriersById = byId(payload.carriers);

  return asArray(payload.itineraries).map((itinerary, index) => {
    const legIds = asArray(itinerary.leg_ids);
    const primaryLeg = legsById[String(legIds[0])] || asArray(payload.legs)[0] || {};
    const segmentIds = asArray(primaryLeg.segment_ids);
    const segments = segmentIds.map((id) => segmentsById[String(id)]).filter(Boolean);
    const firstSegment = segments[0] || {};
    const lastSegment = segments[segments.length - 1] || firstSegment;
    const firstCarrierId =
      firstSegment.marketing_carrier_id ||
      asArray(primaryLeg.marketing_carrier_ids)[0] ||
      asArray(primaryLeg.operating_carrier_ids)[0];
    const carrier = carriersById[String(firstCarrierId)] || {};
    const originPlace =
      placesById[String(primaryLeg.origin_place_id || firstSegment.origin_place_id)] || {};
    const destinationPlace =
      placesById[String(primaryLeg.destination_place_id || lastSegment.destination_place_id)] || {};
    const departureScheduled = scheduledAt(search.departureDate, normalizeTime(primaryLeg.departure || firstSegment.departure));
    const arrivalScheduled = scheduledAt(search.departureDate, normalizeTime(primaryLeg.arrival || lastSegment.arrival));
    const price = firstPrice(itinerary);
    const stops = Number(primaryLeg.stop_count || Math.max(segments.length - 1, 0));

    return {
      id: itinerary.id || `${search.from}-${search.to}-flightapi-${index}`,
      provider: "flightapi",
      resultGroup: index === 0 ? "best" : "other",
      airline: {
        name: carrierName(carrier),
        logo: carrier.logo || carrier.image_url || "",
        iata: carrier.display_code || "",
      },
      flight: {
        iata: `${carrier.display_code || ""}${firstSegment.marketing_flight_number || ""}`.trim() || "Flight",
        number: firstSegment.marketing_flight_number || "",
      },
      departure: {
        iata: placeCode(originPlace, search.from),
        airport: originPlace.name || placeCode(originPlace, search.from),
        scheduled: primaryLeg.departure || firstSegment.departure || departureScheduled,
      },
      arrival: {
        iata: placeCode(destinationPlace, search.to),
        airport: destinationPlace.name || placeCode(destinationPlace, search.to),
        scheduled: primaryLeg.arrival || lastSegment.arrival || arrivalScheduled,
      },
      price: {
        amount: price,
        currency: search.currency,
        display: price ? new Intl.NumberFormat("en-IN", { style: "currency", currency: search.currency, maximumFractionDigits: 0 }).format(price) : "Price unavailable",
      },
      durationMinutes: toNumber(primaryLeg.duration) || minutesBetween(primaryLeg.departure, primaryLeg.arrival),
      durationText: formatDuration(toNumber(primaryLeg.duration) || minutesBetween(primaryLeg.departure, primaryLeg.arrival)),
      stops,
      stopText: stops === 0 ? "Non stop" : `${stops} stop${stops > 1 ? "s" : ""}`,
      travelClass: search.travelClass.label,
      airplane: "",
      carbonEmissions: itinerary.eco || null,
      bookingToken: itinerary.id || "",
      legs: segments.map((segment) => ({
        airline: carrierName(carrier),
        flightNumber: `${carrier.display_code || ""}${segment.marketing_flight_number || ""}`.trim(),
        departure: placesById[String(segment.origin_place_id)] || {},
        arrival: placesById[String(segment.destination_place_id)] || {},
        duration: segment.duration,
      })),
      fareBadges: [index === 0 ? "Best value" : "Live fare", "Current quote"].filter(Boolean),
      raw: itinerary,
    };
  });
};

const cabinClassForFlightApi = (label) =>
  label === "Premium Economy" ? "Premium_Economy" : label || "Economy";

const searchFlightApi = async (search) => {
  if (!env.flightSearch.flightsApiKey) {
    const error = new Error("Google Flight API key is missing.");
    error.statusCode = 503;
    throw error;
  }

  const endpoint = search.returnDate ? "roundtrip" : "onewaytrip";
  const parts = [
    "https://api.flightapi.io",
    endpoint,
    encodeURIComponent(env.flightSearch.flightsApiKey),
    search.from,
    search.to,
    search.departureDate,
    ...(search.returnDate ? [search.returnDate] : []),
    String(search.passengers),
    "0",
    "0",
    cabinClassForFlightApi(search.travelClass.label),
    search.currency,
  ];

  const response = await axios.get(parts.join("/"), {
    timeout: DEFAULT_TIMEOUT_MS,
  });

  if (response.data?.error || response.data?.message === "error") {
    const error = new Error(response.data?.error || response.data?.message || "FlightAPI search failed.");
    error.statusCode = 502;
    throw error;
  }

  return {
    provider: "flightapi",
    flights: normalizeFlightApiTrip(response.data || {}, search),
    priceInsights: null,
    searchMetadata: response.data?.context || null,
  };
};

const searchFlightsApi = async (search) => {
  if (!env.flightSearch.flightsApiKey) {
    const error = new Error("Google Flight API key is missing.");
    error.statusCode = 503;
    throw error;
  }

  const tripPath = search.returnDate ? "round-trip" : "one-way";
  const response = await axios.get(`${env.flightSearch.flightsApiBaseUrl}/${tripPath}`, {
    params: {
      departure_airport: search.from,
      arrival_airport: search.to,
      departure_date: toDmy(search.departureDate),
      ...(search.returnDate ? { return_date: toDmy(search.returnDate) } : {}),
      currency: search.currency,
      adults: search.passengers,
      travel_class: search.travelClass.label,
    },
    headers: {
      Authorization: `Bearer ${env.flightSearch.flightsApiKey}`,
    },
    timeout: DEFAULT_TIMEOUT_MS,
  });

  const rows = response.data?.data || response.data?.flights || response.data?.results || response.data || [];

  return {
    provider: "flightsapi",
    flights: asArray(rows).map((item, index) => normalizeFlightsApiFlight(item, index, search)),
    priceInsights: response.data?.priceInsights || response.data?.price_insights || null,
    searchMetadata: response.data?.metadata || null,
  };
};

const providerOrder = () => {
  if (env.flightSearch.provider === "serpapi") {
    return ["serpapi"];
  }
  if (env.flightSearch.provider === "flightsapi") {
    return ["flightsapi"];
  }
  if (env.flightSearch.provider === "flightapi") {
    return ["flightapi"];
  }
  if (process.env.SERPAPI_API_KEY && !process.env.FLIGHTS_API_KEY) {
    return ["serpapi", "flightsapi", "flightapi"];
  }
  return ["flightapi", "flightsapi", "serpapi"];
};

const callProvider = (provider, search) => {
  if (provider === "serpapi") {
    return searchSerpApi(search);
  }
  if (provider === "flightapi") {
    return searchFlightApi(search);
  }
  return searchFlightsApi(search);
};

const searchFlights = async (query) => {
  const search = buildSearch(query);
  if (!search.from || !search.to) {
    const error = new Error("Please select both departure and arrival airports.");
    error.statusCode = 400;
    throw error;
  }
  if (search.from === search.to) {
    const error = new Error("Departure and arrival airports must be different.");
    error.statusCode = 400;
    throw error;
  }

  const errors = [];
  for (const provider of providerOrder()) {
    try {
      const result = await callProvider(provider, search);
      return {
        ...result,
        search,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      errors.push(`${provider}: ${error.message}`);
      const status = error.response?.status || error.statusCode;
      if (
        env.flightSearch.provider !== "auto" ||
        ![400, 401, 403, 404, 410, 429, 500, 502, 503].includes(status)
      ) {
        throw error;
      }
    }
  }

  const error = new Error(errors[errors.length - 1] || "Flight search is unavailable.");
  error.statusCode = 502;
  error.details = errors;
  throw error;
};

module.exports = {
  buildSearch,
  searchFlights,
};
