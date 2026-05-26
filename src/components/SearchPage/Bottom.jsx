import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const AIRPORTS = [
  { code: "BOM", name: "Mumbai" },
  { code: "DEL", name: "Delhi" },
  { code: "BLR", name: "Bangalore" },
  { code: "HYD", name: "Hyderabad" },
  { code: "MAA", name: "Chennai" },
  { code: "CCU", name: "Kolkata" },
  { code: "PNQ", name: "Pune" },
  { code: "AMD", name: "Ahmedabad" },
  { code: "JAI", name: "Jaipur" },
  { code: "LKO", name: "Lucknow" },
  { code: "VNS", name: "Varanasi" },
  { code: "DED", name: "Dehradun" },
  { code: "IXM", name: "Madurai" },
  { code: "TIR", name: "Tirupati" },
  { code: "GOI", name: "Goa" },
  { code: "IXC", name: "Chandigarh" },
  { code: "PAT", name: "Patna" },
  { code: "GAU", name: "Guwahati" },
];

const AIRLINE_LOGOS = {
  IndiGo: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/6E.png?v=7",
  "Air India": "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=7",
  AirAsia: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/I5.png?v=7",
  Vistara: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/UK.png?v=7",
  SpiceJet: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/SG.png?v=7",
  GoAir: "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/G8.png?v=7",
};

const Style = styled.div`
  background: #faf7f2;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(250px, 300px) minmax(0, 1fr);
  padding: 0 7vw 64px;

  .filters {
    align-self: start;
    background: #ffffff;
    border: 1px solid #efe6dc;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(44, 24, 16, 0.08);
    margin-top: -132px;
    overflow: hidden;
    position: sticky;
    top: 84px;
  }

  .filter-section {
    border-bottom: 1px solid #f0ebe5;
    padding: 18px;
  }

  .filter-section:last-child {
    border-bottom: 0;
  }

  .filter-title {
    color: #2c1810;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 12px;
  }

  .filter-option {
    align-items: center;
    color: #5e5149;
    display: flex;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    gap: 10px;
    margin: 10px 0;
  }

  input[type="checkbox"],
  input[type="radio"],
  input[type="range"] {
    accent-color: #c0392b;
  }

  .price-limit {
    color: #2c1810;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    margin-top: 8px;
  }

  .results {
    margin-top: -104px;
    min-width: 0;
  }

  .summary {
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .summary h1 {
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-size: 26px;
    line-height: 1.2;
    margin: 0 0 6px;
  }

  .summary p {
    color: #f4ddc8;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    margin: 0;
  }

  .live-pill {
    align-items: center;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    color: #ffffff;
    display: flex;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    gap: 8px;
    height: 34px;
    padding: 0 12px;
    white-space: nowrap;
  }

  .live-dot {
    background: #3bd16f;
    border-radius: 999px;
    box-shadow: 0 0 0 4px rgba(59, 209, 111, 0.18);
    height: 8px;
    width: 8px;
  }

  .sort-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 14px;
  }

  .sort-row button {
    background: #ffffff;
    border: 1px solid #eadfd4;
    border-radius: 8px;
    color: #4a3c34;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    height: 38px;
    padding: 0 14px;
  }

  .sort-row button.active {
    background: #fff3ec;
    border-color: #ff6b35;
    color: #c0392b;
  }

  .flight-card {
    background: #ffffff;
    border: 1px solid #efe6dc;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(44, 24, 16, 0.08);
    margin-bottom: 14px;
    overflow: hidden;
  }

  .flight-main {
    align-items: center;
    display: grid;
    gap: 18px;
    grid-template-columns: minmax(160px, 1.05fr) minmax(260px, 1.8fr) minmax(148px, 0.8fr);
    padding: 18px;
  }

  .airline {
    align-items: center;
    display: flex;
    gap: 12px;
    min-width: 0;
  }

  .airline img,
  .airline-fallback {
    border: 1px solid #efe6dc;
    border-radius: 8px;
    height: 38px;
    object-fit: contain;
    width: 38px;
  }

  .airline-fallback {
    align-items: center;
    background: #fff3ec;
    color: #c0392b;
    display: flex;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 800;
    justify-content: center;
  }

  .airline-name {
    color: #2c1810;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 800;
    margin: 0 0 4px;
  }

  .muted {
    color: #76675e;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    margin: 0;
  }

  .timing {
    align-items: center;
    display: grid;
    gap: 12px;
    grid-template-columns: minmax(72px, 0.8fr) minmax(110px, 1fr) minmax(72px, 0.8fr);
  }

  .time-block h3 {
    color: #2c1810;
    font-family: 'Outfit', sans-serif;
    font-size: 24px;
    margin: 0;
  }

  .time-block p {
    color: #6b5b4f;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    margin: 4px 0 0;
  }

  .duration {
    color: #77665c;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
  }

  .route-line {
    background: linear-gradient(90deg, #ff8c5a, #c0392b);
    border-radius: 99px;
    height: 3px;
    margin: 8px 0;
    position: relative;
  }

  .route-line::before,
  .route-line::after {
    background: #ffffff;
    border: 2px solid #c0392b;
    border-radius: 999px;
    content: "";
    height: 8px;
    position: absolute;
    top: -4px;
    width: 8px;
  }

  .route-line::before {
    left: 0;
  }

  .route-line::after {
    right: 0;
  }

  .fare {
    text-align: right;
  }

  .fare h3 {
    color: #2c1810;
    font-family: 'Outfit', sans-serif;
    font-size: 24px;
    margin: 0 0 4px;
  }

  .book-link {
    align-items: center;
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    border-radius: 999px;
    color: #ffffff;
    display: inline-flex;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 800;
    height: 38px;
    justify-content: center;
    margin-top: 10px;
    min-width: 128px;
    text-decoration: none;
  }

  .book-link:hover {
    box-shadow: 0 6px 16px rgba(192, 57, 43, 0.28);
    transform: translateY(-1px);
  }

  .flight-footer {
    align-items: center;
    background: #fffaf5;
    border-top: 1px solid #f0ebe5;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 18px;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .badge {
    background: #f7efe7;
    border: 1px solid #eadfd4;
    border-radius: 999px;
    color: #5a4638;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 10px;
  }

  .details-toggle {
    background: transparent;
    border: 0;
    color: #c0392b;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 800;
  }

  .details {
    border-top: 1px solid #f0ebe5;
    padding: 14px 18px 18px;
  }

  .segment {
    align-items: center;
    border-bottom: 1px solid #f4eee8;
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 10px 0;
  }

  .segment:last-child {
    border-bottom: 0;
  }

  .state-card {
    background: #ffffff;
    border: 1px solid #efe6dc;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(44, 24, 16, 0.08);
    color: #5e5149;
    font-family: 'Outfit', sans-serif;
    padding: 28px;
  }

  .skeleton {
    animation: pulse 1.2s ease-in-out infinite;
    min-height: 132px;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    padding: 0 18px 48px;

    .filters,
    .results {
      margin-top: -78px;
      position: static;
    }

    .filters {
      order: 2;
    }

    .results {
      order: 1;
    }

    .flight-main {
      grid-template-columns: 1fr;
    }

    .fare {
      text-align: left;
    }

    .summary {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 560px) {
    .timing,
    .segment {
      grid-template-columns: 1fr;
    }

    .duration {
      text-align: left;
    }
  }
`;

const getName = (code) => {
  const match = AIRPORTS.find((airport) => airport.code === code);
  return match ? `${match.name} (${match.code})` : code || "Select airport";
};

const formatTime = (scheduled) => {
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
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const formatDate = (scheduled) => {
  if (!scheduled) {
    return "";
  }
  const date = new Date(scheduled);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const getAirlineLogo = (flight) =>
  flight?.airline?.logo || AIRLINE_LOGOS[flight?.airline?.name] || "";

const getInitials = (name) =>
  String(name || "FL")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getPrice = (flight) => Number(flight?.price?.amount || 0);

const getDepartureHour = (flight) => {
  const time = formatTime(flight?.departure?.scheduled);
  const hour = Number(time.split(":")[0]);
  return Number.isFinite(hour) ? hour : 0;
};

const matchesDepartureWindow = (flight, window) => {
  if (window === "all") {
    return true;
  }
  const hour = getDepartureHour(flight);
  if (window === "morning") {
    return hour >= 5 && hour < 12;
  }
  if (window === "afternoon") {
    return hour >= 12 && hour < 17;
  }
  if (window === "evening") {
    return hour >= 17 && hour < 22;
  }
  return hour >= 22 || hour < 5;
};

const sortFlights = (flights, sortMode) => {
  const sorted = [...flights];
  if (sortMode === "cheapest") {
    sorted.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sortMode === "fastest") {
    sorted.sort((a, b) => Number(a.durationMinutes || 99999) - Number(b.durationMinutes || 99999));
  } else if (sortMode === "earliest") {
    sorted.sort((a, b) => getDepartureHour(a) - getDepartureHour(b));
  } else {
    sorted.sort((a, b) => {
      const groupScore = (flight) => (flight.resultGroup === "best" ? 0 : 1);
      return groupScore(a) - groupScore(b) || getPrice(a) - getPrice(b);
    });
  }
  return sorted;
};

const safeStoredSearch = () => {
  try {
    return JSON.parse(localStorage.getItem("myKey") || "{}");
  } catch {
    return {};
  }
};

export const Bottom = ({ data, meta, loading, error, bookData }) => {
  const storedSearch = safeStoredSearch();
  const [sortMode, setSortMode] = useState("recommended");
  const [stopFilters, setStopFilters] = useState({ nonstop: false, one: false, multi: false });
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [departureWindow, setDepartureWindow] = useState("all");
  const [expandedId, setExpandedId] = useState("");
  const maxFlightPrice = useMemo(() => Math.max(0, ...data.map(getPrice)), [data]);
  const [priceLimit, setPriceLimit] = useState(0);

  useEffect(() => {
    setPriceLimit(maxFlightPrice || 0);
    setSelectedAirlines([]);
    setStopFilters({ nonstop: false, one: false, multi: false });
    setExpandedId("");
  }, [maxFlightPrice, data.length]);

  const airlines = useMemo(
    () => [...new Set(data.map((flight) => flight?.airline?.name).filter(Boolean))].sort(),
    [data]
  );

  const filteredFlights = useMemo(() => {
    const hasStopFilter = stopFilters.nonstop || stopFilters.one || stopFilters.multi;
    return sortFlights(
      data.filter((flight) => {
        const price = getPrice(flight);
        const stops = Number(flight.stops || 0);
        const airlineMatch =
          selectedAirlines.length === 0 || selectedAirlines.includes(flight?.airline?.name);
        const priceMatch = !priceLimit || !price || price <= priceLimit;
        const stopMatch =
          !hasStopFilter ||
          (stopFilters.nonstop && stops === 0) ||
          (stopFilters.one && stops === 1) ||
          (stopFilters.multi && stops >= 2);
        return airlineMatch && priceMatch && stopMatch && matchesDepartureWindow(flight, departureWindow);
      }),
      sortMode
    );
  }, [data, departureWindow, priceLimit, selectedAirlines, sortMode, stopFilters]);

  const toggleAirline = (airline) => {
    setSelectedAirlines((selected) =>
      selected.includes(airline)
        ? selected.filter((item) => item !== airline)
        : [...selected, airline]
    );
  };

  const routeTitle = `${getName(meta?.search?.from || storedSearch.from)} to ${getName(
    meta?.search?.to || storedSearch.to
  )}`;

  return (
    <Style>
      <aside className="filters">
        <div className="filter-section">
          <h3 className="filter-title">Sort by</h3>
          {[
            ["recommended", "Recommended"],
            ["cheapest", "Cheapest first"],
            ["fastest", "Fastest first"],
            ["earliest", "Earliest departure"],
          ].map(([value, label]) => (
            <label className="filter-option" key={value}>
              <input
                checked={sortMode === value}
                name="sortMode"
                onChange={() => setSortMode(value)}
                type="radio"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Stops</h3>
          {[
            ["nonstop", "Non stop"],
            ["one", "1 stop"],
            ["multi", "2+ stops"],
          ].map(([value, label]) => (
            <label className="filter-option" key={value}>
              <input
                checked={stopFilters[value]}
                onChange={() => setStopFilters((filters) => ({ ...filters, [value]: !filters[value] }))}
                type="checkbox"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Airlines</h3>
          {airlines.length === 0 && <p className="muted">Airlines appear after search.</p>}
          {airlines.map((airline) => (
            <label className="filter-option" key={airline}>
              <input
                checked={selectedAirlines.includes(airline)}
                onChange={() => toggleAirline(airline)}
                type="checkbox"
              />
              {airline}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Departure time</h3>
          {[
            ["all", "Any time"],
            ["morning", "Morning"],
            ["afternoon", "Afternoon"],
            ["evening", "Evening"],
            ["night", "Night"],
          ].map(([value, label]) => (
            <label className="filter-option" key={value}>
              <input
                checked={departureWindow === value}
                name="departureWindow"
                onChange={() => setDepartureWindow(value)}
                type="radio"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Price range</h3>
          <input
            disabled={!maxFlightPrice}
            max={maxFlightPrice || 100000}
            min="0"
            onChange={(e) => setPriceLimit(Number(e.target.value))}
            step="500"
            type="range"
            value={priceLimit || 0}
            style={{ width: "100%" }}
          />
          <div className="price-limit">
            Up to {priceLimit ? `INR ${priceLimit.toLocaleString("en-IN")}` : "any price"}
          </div>
        </div>
      </aside>

      <main className="results">
        <div className="summary">
          <div>
            <h1>{routeTitle}</h1>
            <p>
              {loading
                ? "Searching live fares..."
                : `${filteredFlights.length} of ${data.length} live fare options shown`}
            </p>
          </div>
          <div className="live-pill">
            <span className="live-dot" />
            {meta?.provider ? `${meta.provider} live search` : "Live fare search"}
          </div>
        </div>

        <div className="sort-row">
          {[
            ["recommended", "Recommended"],
            ["cheapest", "Cheapest"],
            ["fastest", "Fastest"],
            ["earliest", "Earliest"],
          ].map(([value, label]) => (
            <button
              className={sortMode === value ? "active" : ""}
              key={value}
              onClick={() => setSortMode(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <>
            <div className="state-card skeleton">Finding real-time prices and schedules...</div>
            <div className="state-card skeleton">Comparing airlines, stops, and fare options...</div>
          </>
        )}

        {!loading && error && <div className="state-card">{error}</div>}

        {!loading && !error && filteredFlights.length === 0 && (
          <div className="state-card">No flights match these filters. Try clearing one filter.</div>
        )}

        {!loading &&
          filteredFlights.map((flight, index) => {
            const logo = getAirlineLogo(flight);
            const isExpanded = expandedId === flight.id;
            const price = flight?.price?.display || "Price unavailable";

            return (
              <article className="flight-card" key={flight.id || index}>
                <div className="flight-main">
                  <div className="airline">
                    {logo ? (
                      <img alt={flight.airline.name} src={logo} />
                    ) : (
                      <span className="airline-fallback">{getInitials(flight.airline.name)}</span>
                    )}
                    <div>
                      <p className="airline-name">{flight.airline.name}</p>
                      <p className="muted">
                        {flight.flight?.iata || flight.flight?.number || "Flight"} | {flight.travelClass || "Economy"}
                      </p>
                    </div>
                  </div>

                  <div className="timing">
                    <div className="time-block">
                      <h3>{formatTime(flight.departure?.scheduled)}</h3>
                      <p>{flight.departure?.iata}</p>
                      <p className="muted">{formatDate(flight.departure?.scheduled)}</p>
                    </div>

                    <div className="duration">
                      <span>{flight.durationText || "Duration unavailable"}</span>
                      <div className="route-line" />
                      <span>{flight.stopText || "Stops unavailable"}</span>
                    </div>

                    <div className="time-block" style={{ textAlign: "right" }}>
                      <h3>{formatTime(flight.arrival?.scheduled)}</h3>
                      <p>{flight.arrival?.iata}</p>
                      <p className="muted">{formatDate(flight.arrival?.scheduled)}</p>
                    </div>
                  </div>

                  <div className="fare">
                    <h3>{price}</h3>
                    <p className="muted">per adult, incl. live fare data</p>
                    <Link
                      className="book-link"
                      onClick={() => bookData(flight)}
                      to="/checkout"
                    >
                      BOOK NOW
                    </Link>
                  </div>
                </div>

                <div className="flight-footer">
                  <div className="badges">
                    {[...(flight.fareBadges || []), flight.airplane, "Baggage included"]
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((badge) => (
                        <span className="badge" key={badge}>
                          {badge}
                        </span>
                      ))}
                  </div>
                  <button
                    className="details-toggle"
                    onClick={() => setExpandedId(isExpanded ? "" : flight.id)}
                    type="button"
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="details">
                    {(flight.legs?.length ? flight.legs : [flight]).map((leg, legIndex) => (
                      <div className="segment" key={`${flight.id}-${legIndex}`}>
                        <div>
                          <p className="airline-name">
                            {leg.airline || flight.airline.name} {leg.flightNumber || flight.flight?.number || ""}
                          </p>
                          <p className="muted">{leg.airplane || flight.airplane || "Aircraft details unavailable"}</p>
                        </div>
                        <p className="muted">
                          From {leg.departure?.id || leg.departureAirport || flight.departure?.iata}
                        </p>
                        <p className="muted">
                          To {leg.arrival?.id || leg.arrivalAirport || flight.arrival?.iata}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
      </main>
    </Style>
  );
};
