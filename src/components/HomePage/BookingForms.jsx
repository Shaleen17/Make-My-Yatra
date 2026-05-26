import { useState } from "react";
import { Fromtocss } from "./Fromtocss";
import styled from "styled-components";

const FormWrap = styled.div`
  animation: fadeIn 0.25s ease;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .form-subtitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    color: #6b5b4f;

    .radio-group {
      display: flex;
      align-items: center;
      gap: 14px;

      label {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        font-weight: 500;
        font-size: 12px;
        color: #2c1810;

        input[type="radio"] {
          accent-color: #c0392b;
        }
      }
    }

    .right-text {
      font-size: 11px;
      color: #9e8e82;
      font-weight: 400;
    }
  }
`;

/* ── Tirth places ─────────────────────────────── */
const tirthPlaces = [
  { code: "VNS", name: "Varanasi (Kashi)" },
  { code: "AYJ", name: "Ayodhya" },
  { code: "HRD", name: "Haridwar" },
  { code: "DDN", name: "Rishikesh" },
  { code: "PNQ", name: "Prayagraj (Triveni Sangam)" },
  { code: "UJN", name: "Ujjain (Mahakaleshwar)" },
  { code: "TIR", name: "Tirupati (Tirumala)" },
  { code: "DWR", name: "Dwarka" },
  { code: "PUR", name: "Puri (Jagannath)" },
  { code: "RMS", name: "Rameswaram" },
  { code: "SMN", name: "Somnath" },
  { code: "KDN", name: "Kedarnath" },
  { code: "BDN", name: "Badrinath" },
  { code: "YMN", name: "Yamunotri" },
  { code: "GNG", name: "Gangotri" },
  { code: "VDV", name: "Vaishno Devi" },
  { code: "VRN", name: "Vrindavan" },
  { code: "MTH", name: "Mathura" },
  { code: "GRV", name: "Guruvayur" },
  { code: "KNK", name: "Konark" },
  { code: "MDR", name: "Madurai (Meenakshi)" },
  { code: "KMK", name: "Kamakhya" },
  { code: "GSG", name: "Gangasagar" },
  { code: "CTK", name: "Chitrakoot" },
];

/* ── Cities / Stations / Airports ─────────────── */
const majorCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna",
  "Varanasi", "Agra", "Haridwar", "Rishikesh", "Dehradun",
  "Allahabad", "Ujjain", "Dwarka", "Tirupati", "Madurai",
  "Rameswaram", "Puri", "Ayodhya", "Mathura", "Vrindavan",
];

const airports = [
  { code: "BOM", name: "Mumbai", sub: "Chhatrapati Shivaji Intl" },
  { code: "DEL", name: "Delhi", sub: "Indira Gandhi Intl" },
  { code: "BLR", name: "Bangalore", sub: "Kempegowda Intl" },
  { code: "HYD", name: "Hyderabad", sub: "Rajiv Gandhi Intl" },
  { code: "MAA", name: "Chennai", sub: "Chennai Intl" },
  { code: "CCU", name: "Kolkata", sub: "Netaji Subhas Chandra Bose Intl" },
  { code: "PNQ", name: "Pune", sub: "Pune Airport" },
  { code: "AMD", name: "Ahmedabad", sub: "Sardar Vallabhbhai Patel Intl" },
  { code: "JAI", name: "Jaipur", sub: "Jaipur Intl" },
  { code: "LKO", name: "Lucknow", sub: "Chaudhary Charan Singh Intl" },
  { code: "VNS", name: "Varanasi", sub: "Lal Bahadur Shastri Intl" },
  { code: "DED", name: "Dehradun", sub: "Jolly Grant Airport" },
  { code: "IXM", name: "Madurai", sub: "Madurai Airport" },
  { code: "TIR", name: "Tirupati", sub: "Tirupati Airport" },
  { code: "GOI", name: "Goa", sub: "Manohar Intl" },
  { code: "IXC", name: "Chandigarh", sub: "Chandigarh Airport" },
  { code: "PAT", name: "Patna", sub: "Jay Prakash Narayan Intl" },
  { code: "GAU", name: "Guwahati", sub: "Lokpriya Gopinath Bordoloi Intl" },
];

const trainStations = [
  { code: "CSTM", name: "Mumbai", sub: "CSTM - All Stations" },
  { code: "NDLS", name: "Delhi", sub: "NDLS - New Delhi" },
  { code: "SBC", name: "Bangalore", sub: "SBC - Bangalore City" },
  { code: "HYB", name: "Hyderabad", sub: "HYB - Hyderabad Deccan" },
  { code: "MAS", name: "Chennai", sub: "MAS - Chennai Central" },
  { code: "HWH", name: "Kolkata", sub: "HWH - Howrah Junction" },
  { code: "PUNE", name: "Pune", sub: "PUNE - Pune Junction" },
  { code: "ADI", name: "Ahmedabad", sub: "ADI - Ahmedabad Junction" },
  { code: "JP", name: "Jaipur", sub: "JP - Jaipur Junction" },
  { code: "LKO", name: "Lucknow", sub: "LKO - Lucknow" },
  { code: "CNB", name: "Kanpur", sub: "CNB - Kanpur Central" },
  { code: "BSB", name: "Varanasi", sub: "BSB - Varanasi Junction" },
  { code: "HW", name: "Haridwar", sub: "HW - Haridwar Junction" },
  { code: "PRYJ", name: "Prayagraj", sub: "PRYJ - Prayagraj Junction" },
  { code: "AY", name: "Ayodhya", sub: "AY - Ayodhya Junction" },
  { code: "MTJ", name: "Mathura", sub: "MTJ - Mathura Junction" },
  { code: "DDN", name: "Dehradun", sub: "DDN - Dehradun" },
  { code: "PURI", name: "Puri", sub: "PURI - Puri" },
  { code: "RMM", name: "Rameswaram", sub: "RMM - Rameswaram" },
  { code: "UJN", name: "Ujjain", sub: "UJN - Ujjain Junction" },
];

/* ═══════════════════════════════════════════════
   FLIGHTS FORM
   ═══════════════════════════════════════════════ */
export const FlightsForm = ({ handleChange }) => {
  const [tripType, setTripType] = useState("oneway");
  const emitChange = (name, value) => {
    handleChange({ target: { name, value } });
  };

  const handleTripType = (value) => {
    setTripType(value);
    emitChange("tripType", value);
    if (value === "oneway") {
      emitChange("returnDate", "");
    }
  };

  return (
    <FormWrap>
      <div className="form-subtitle">
        <div className="radio-group">
          <label><input type="radio" name="tripType" checked={tripType === "oneway"} onChange={() => handleTripType("oneway")} /> One Way</label>
          <label><input type="radio" name="tripType" checked={tripType === "round"} onChange={() => handleTripType("round")} /> Round Trip</label>
          <label><input type="radio" name="tripType" checked={tripType === "multi"} onChange={() => handleTripType("multi")} /> Multi City</label>
        </div>
        <span className="right-text">Book International and Domestic Flights</span>
      </div>

      <Fromtocss>
        <div className="fromtodiv">
          <div>
            <h3>FROM</h3>
            <select onChange={handleChange} name="from" id="flight-from">
              <option value="">Select City</option>
              {airports.map((a) => (
                <option value={a.code} key={a.code}>{a.name} — {a.sub}</option>
              ))}
            </select>
          </div>
          <div className="swap-icon">⇄</div>
          <div>
            <h3>TO</h3>
            <select onChange={handleChange} name="to" id="flight-to">
              <option value="">Select City</option>
              {airports.map((a) => (
                <option value={a.code} key={a.code}>{a.name} — {a.sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="fromtodiv2">
          <div>
            <h3>DEPARTURE</h3>
            <input type="date" className="date" id="flight-dep" name="departureDate" onChange={handleChange} />
          </div>
          <div>
            <h3>RETURN</h3>
            <input
              type="date"
              className="date"
              placeholder="Add return for bigger discounts"
              id="flight-ret"
              name="returnDate"
              disabled={tripType === "oneway"}
              onChange={handleChange}
            />
          </div>
          <div>
            <h3>TRAVELLERS & CLASS</h3>
            <select name="cabinClass" id="flight-class" onChange={handleChange} style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#2c1810', background: 'transparent', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>
              <option value="economy">1 Traveller, Economy</option>
              <option value="premEco">1 Traveller, Premium Economy</option>
              <option value="business">1 Traveller, Business</option>
              <option value="2eco">2 Travellers, Economy</option>
              <option value="2prem">2 Travellers, Premium Economy</option>
            </select>
          </div>
        </div>
      </Fromtocss>
    </FormWrap>
  );
};

/* ═══════════════════════════════════════════════
   TRAINS FORM
   ═══════════════════════════════════════════════ */
export const TrainsForm = ({ handleChange }) => {
  const [bookType, setBookType] = useState("ticket");

  return (
    <FormWrap>
      <div className="form-subtitle">
        <div className="radio-group">
          <label><input type="radio" name="trainType" checked={bookType === "ticket"} onChange={() => setBookType("ticket")} /> Book Train Tickets</label>
          <label><input type="radio" name="trainType" checked={bookType === "pnr"} onChange={() => setBookType("pnr")} /> Check PNR Status</label>
          <label><input type="radio" name="trainType" checked={bookType === "live"} onChange={() => setBookType("live")} /> Live Train Status</label>
        </div>
        <span className="right-text">Train Ticket Booking</span>
      </div>

      <Fromtocss>
        <div className="fromtodiv">
          <div>
            <h3>FROM</h3>
            <select onChange={handleChange} name="from" id="train-from">
              <option value="">Select Station</option>
              {trainStations.map((s) => (
                <option value={s.code} key={s.code}>{s.name} — {s.sub}</option>
              ))}
            </select>
          </div>
          <div className="swap-icon">⇄</div>
          <div>
            <h3>TO</h3>
            <select onChange={handleChange} name="to" id="train-to">
              <option value="">Select Station</option>
              {trainStations.map((s) => (
                <option value={s.code} key={s.code}>{s.name} — {s.sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="fromtodiv2">
          <div>
            <h3>TRAVEL DATE</h3>
            <input type="date" className="date" id="train-date" />
          </div>
          <div>
            <h3>CLASS</h3>
            <select name="class" id="train-class" style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#2c1810', background: 'transparent', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>
              <option value="ALL">ALL — All Class</option>
              <option value="SL">SL — Sleeper</option>
              <option value="3A">3A — Third AC</option>
              <option value="2A">2A — Second AC</option>
              <option value="1A">1A — First AC</option>
              <option value="CC">CC — Chair Car</option>
              <option value="2S">2S — Second Sitting</option>
            </select>
          </div>
        </div>
      </Fromtocss>
    </FormWrap>
  );
};

/* ═══════════════════════════════════════════════
   BUSES FORM
   ═══════════════════════════════════════════════ */
export const BusesForm = ({ handleChange }) => {
  return (
    <FormWrap>
      <div className="form-subtitle">
        <div className="radio-group" />
        <span className="right-text">Bus Ticket Booking</span>
      </div>

      <Fromtocss>
        <div className="fromtodiv">
          <div>
            <h3>FROM</h3>
            <select onChange={handleChange} name="from" id="bus-from">
              <option value="">Select City</option>
              {majorCities.map((c) => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="swap-icon">⇄</div>
          <div>
            <h3>TO</h3>
            <select onChange={handleChange} name="to" id="bus-to">
              <option value="">Select City</option>
              {majorCities.map((c) => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="fromtodiv2">
          <div>
            <h3>TRAVEL DATE</h3>
            <input type="date" className="date" id="bus-date" />
          </div>
        </div>
      </Fromtocss>
    </FormWrap>
  );
};

/* ═══════════════════════════════════════════════
   CABS FORM
   ═══════════════════════════════════════════════ */
export const CabsForm = ({ handleChange }) => {
  const [cabType, setCabType] = useState("outstation");

  return (
    <FormWrap>
      <div className="form-subtitle">
        <div className="radio-group">
          <label><input type="radio" name="cabType" checked={cabType === "outstation"} onChange={() => setCabType("outstation")} /> Outstation One-Way</label>
          <label><input type="radio" name="cabType" checked={cabType === "round"} onChange={() => setCabType("round")} /> Outstation Round-Trip</label>
          <label><input type="radio" name="cabType" checked={cabType === "airport"} onChange={() => setCabType("airport")} /> Airport Transfers</label>
          <label><input type="radio" name="cabType" checked={cabType === "hourly"} onChange={() => setCabType("hourly")} /> Hourly Rentals</label>
        </div>
        <span className="right-text">Online Cab Booking</span>
      </div>

      <Fromtocss>
        <div className="fromtodiv">
          <div>
            <h3>FROM</h3>
            <select onChange={handleChange} name="from" id="cab-from">
              <option value="">Select City</option>
              {majorCities.map((c) => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="swap-icon">⇄</div>
          <div>
            <h3>TO</h3>
            <select onChange={handleChange} name="to" id="cab-to">
              <option value="">Select City</option>
              {majorCities.map((c) => (
                <option value={c} key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="fromtodiv2">
          <div>
            <h3>DEPARTURE</h3>
            <input type="date" className="date" id="cab-dep" />
          </div>
          <div>
            <h3>RETURN</h3>
            <input type="date" className="date" id="cab-ret" />
          </div>
          <div>
            <h3>PICKUP TIME</h3>
            <input type="time" className="date" id="cab-time" defaultValue="10:00" />
          </div>
        </div>
      </Fromtocss>
    </FormWrap>
  );
};

/* ═══════════════════════════════════════════════
   TIRTH YATRAS FORM (existing, moved here)
   ═══════════════════════════════════════════════ */
export const YatrasForm = ({ handleChange }) => {
  return (
    <Fromtocss>
      <div className="fromtodiv">
        <div>
          <h3>STARTING POINT</h3>
          <select onChange={handleChange} name="from" id="from-select">
            <option value="">Select Origin</option>
            {tirthPlaces.map((e) => (
              <option value={e.code} key={e.code}>{e.name}</option>
            ))}
          </select>
        </div>
        <div className="swap-icon">⇄</div>
        <div>
          <h3>DESTINATION TIRTH</h3>
          <select onChange={handleChange} name="to" id="to-select">
            <option value="">Select Tirth</option>
            {tirthPlaces.map((e) => (
              <option value={e.code} key={e.code}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="fromtodiv2">
        <div>
          <h3>YATRA DATE</h3>
          <input type="date" className="date" id="yatra-date" />
        </div>
        <div>
          <h3>RETURN DATE</h3>
          <input placeholder="Optional" type="date" className="date" id="return-date" />
        </div>
      </div>
    </Fromtocss>
  );
};
