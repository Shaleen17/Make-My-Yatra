import { Header } from "./Header";
import { SearchBox } from "./SearchBox";
import { Bottom } from "./Bottom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

const fetchFlights = async (criteria) => {
  if (!criteria?.from || !criteria?.to) {
    return { flights: [], meta: null };
  }

  const params = new URLSearchParams({
    from: criteria.from,
    to: criteria.to,
    departureDate: criteria.departureDate || "",
    returnDate: criteria.returnDate || "",
    tripType: criteria.tripType || "oneway",
    cabinClass: criteria.cabinClass || "economy",
    currency: "INR",
  });

  const response = await fetch(`${API_BASE_URL}/api/v1/flights/search?${params}`);
  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Flight search failed. Please try again.");
  }

  return {
    flights: result.flights || [],
    meta: result,
  };
};

const sortByPrice = (flights, direction) =>
  [...flights].sort((a, b) => {
    const left = Number(a?.price?.amount || 0);
    const right = Number(b?.price?.amount || 0);
    return direction === "desc" ? right - left : left - right;
  });

export const Search = () => {
  const [dataa, setData] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runFlightSearch = async (select) => {
    setLoading(true);
    setError("");

    try {
      const ans = await fetchFlights(select);
      setData(ans.flights);
      setSearchMeta(ans.meta);
      if (ans.flights.length === 0) {
        setError("No live fares found for this route and date. Try another date or nearby airport.");
      }
    } catch (err) {
      setData([]);
      setSearchMeta(null);
      setError(err.message || "Flight search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (select) => {
    await runFlightSearch(select);
  };

  const handleSort = (enabled) => {
    if (enabled) {
      setData((flights) => sortByPrice(flights, "asc"));
    }
  };

  const handleHigh = (enabled) => {
    if (enabled) {
      setData((flights) => sortByPrice(flights, "desc"));
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("myKey");
    const searchType = localStorage.getItem("searchType") || "flights";
    const params = new URLSearchParams(window.location.search);
    const queryCriteria = {
      from: params.get("from") || "",
      to: params.get("to") || "",
      departureDate: params.get("departureDate") || "",
      returnDate: params.get("returnDate") || "",
      tripType: params.get("tripType") || "oneway",
      cabinClass: params.get("cabinClass") || "economy",
    };

    if (queryCriteria.from && queryCriteria.to) {
      localStorage.setItem("searchType", "flights");
      localStorage.setItem("myKey", JSON.stringify(queryCriteria));
      runFlightSearch(queryCriteria);
      return;
    }

    if (searchType !== "flights" || !stored) {
      return;
    }

    const parsed = JSON.parse(stored);
    if (!parsed?.from || !parsed?.to) {
      return;
    }

    runFlightSearch(parsed);
  }, []);

  const bookData = (flight) => {
    localStorage.setItem("buy", JSON.stringify(flight));
  };

  return (
    <>
      <Header />
      <SearchBox handle={handleSelect} />
      <Bottom
        data={dataa}
        meta={searchMeta}
        loading={loading}
        error={error}
        bookData={bookData}
        sorthigh={handleHigh}
        sorting={handleSort}
      />
    </>
  );
};
