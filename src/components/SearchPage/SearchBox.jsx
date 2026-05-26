import { useState, useEffect } from "react";
import styled from "styled-components";

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

const airports = [
  { code: "BOM", name: "Mumbai (BOM)" },
  { code: "DEL", name: "Delhi (DEL)" },
  { code: "BLR", name: "Bangalore (BLR)" },
  { code: "HYD", name: "Hyderabad (HYD)" },
  { code: "MAA", name: "Chennai (MAA)" },
  { code: "CCU", name: "Kolkata (CCU)" },
  { code: "PNQ", name: "Pune (PNQ)" },
  { code: "AMD", name: "Ahmedabad (AMD)" },
  { code: "JAI", name: "Jaipur (JAI)" },
  { code: "LKO", name: "Lucknow (LKO)" },
  { code: "VNS", name: "Varanasi (VNS)" },
  { code: "DED", name: "Dehradun (DED)" },
  { code: "IXM", name: "Madurai (IXM)" },
  { code: "TIR", name: "Tirupati (TIR)" },
  { code: "GOI", name: "Goa (GOI)" },
  { code: "IXC", name: "Chandigarh (IXC)" },
  { code: "PAT", name: "Patna (PAT)" },
  { code: "GAU", name: "Guwahati (GAU)" },
];

const trainStations = [
  { code: "CSTM", name: "Mumbai (CSTM)" },
  { code: "NDLS", name: "Delhi (NDLS)" },
  { code: "SBC", name: "Bangalore (SBC)" },
  { code: "MAS", name: "Chennai (MAS)" },
  { code: "HWH", name: "Kolkata (HWH)" },
  { code: "BSB", name: "Varanasi (BSB)" },
  { code: "HW", name: "Haridwar (HW)" },
  { code: "PRYJ", name: "Prayagraj (PRYJ)" },
  { code: "AY", name: "Ayodhya (AY)" },
  { code: "LKO", name: "Lucknow (LKO)" },
  { code: "JP", name: "Jaipur (JP)" },
  { code: "PUNE", name: "Pune (PUNE)" },
  { code: "DDN", name: "Dehradun (DDN)" },
  { code: "UJN", name: "Ujjain (UJN)" },
];

const majorCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kanpur", "Varanasi", "Haridwar", "Agra", "Dehradun",
];

const searchTypeConfig = {
  flights: {
    fromLabel: "From",
    toLabel: "To",
    fromPlaceholder: "Select City",
    toPlaceholder: "Select City",
    places: airports,
    showDates: true,
    buttonText: "SEARCH",
  },
  trains: {
    fromLabel: "From Station",
    toLabel: "To Station",
    fromPlaceholder: "Select Station",
    toPlaceholder: "Select Station",
    places: trainStations,
    showDates: true,
    buttonText: "SEARCH",
  },
  buses: {
    fromLabel: "From",
    toLabel: "To",
    fromPlaceholder: "Select City",
    toPlaceholder: "Select City",
    places: majorCities.map(c => ({ code: c, name: c })),
    showDates: true,
    buttonText: "SEARCH",
  },
  cabs: {
    fromLabel: "From",
    toLabel: "To",
    fromPlaceholder: "Select City",
    toPlaceholder: "Select City",
    places: majorCities.map(c => ({ code: c, name: c })),
    showDates: true,
    buttonText: "SEARCH",
  },
  yatras: {
    fromLabel: "From",
    toLabel: "To",
    fromPlaceholder: "Select Origin",
    toPlaceholder: "Select Tirth",
    places: tirthPlaces,
    showDates: true,
    buttonText: "SEARCH",
  },
};

const Style = styled.div`
  height: 250px;
  background: linear-gradient(
    to top,
    #5a2d1a 0%,
    #3a1a0d 50%,
    #2c1810 50%,
    #1a0f08 100%
  );
.jelo{
    width: 100%;
    background-color: #2c1810;
    .topdiv {
    width: 90%;
    height: 60px;
    padding-bottom: 10px;
    margin: auto;
    display: flex;
    justify-content: space-around;
    padding-top: 8px;
    align-items: center;
    .first {
      width: 120px;
      padding: 0;
      margin: 0;
      line-height: 0px;
      text-align: center;
      background: rgba(212, 168, 71, 0.15);
      border-radius: 5px;
      p {
        font-size: 14px;
        font-weight: 600;
        color: #d4a847;
        font-family: 'Outfit', sans-serif;
      }
      select {
        border: 0px;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        color: white;
        font-size: 17px;
        text-overflow: "";
        outline: 0px;
        width: 100%;
        text-align: center;
        background-color: transparent;
        padding: 3px;
        font-family: 'Outfit', sans-serif;
      }
      option{background-color: #3a1a0d}
    }
    .second {
      width: 170px;
      line-height: 0;
      background: rgba(212, 168, 71, 0.15);
      border-radius: 5px;
      p {
        font-size: 14px;
        font-weight: 600;
        margin-left: 10px;
        color: #d4a847;
        font-family: 'Outfit', sans-serif;
      }
      select {
        border: 0px;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 8px;
        color: white;
        font-size: 17px;
        text-overflow: "";
        outline: 0px;
        width: 100%;
        background-color: transparent;
        padding: 3px;
        font-family: 'Outfit', sans-serif;
      }
      option{background-color: #3a1a0d}
    }
    button {
      width: 170px;
      height: 45px;
      border-radius: 25px;
      background: linear-gradient(
        to right,
        #ff8c5a 0%,
        #ff6b35 50%,
        #e05a2b 50%,
        #c0392b 100%
      );
      border: none;
      color: white;
      font-weight: 700;
      font-size: 20px;
      font-family: 'Outfit', sans-serif;
      cursor: pointer;
    }
  }
}
.hello{
    position: fixed;
    z-index: 100;
    top: 0;
}
`;

export const SearchBox = ({handle}) => {
  const searchType = localStorage.getItem("searchType") || "flights";
  const config = searchTypeConfig[searchType] || searchTypeConfig.flights;

  const [select, setSelect] = useState({
    from: "",
    to: "",
    tripType: "oneway",
    departureDate: "",
    returnDate: "",
    cabinClass: "economy",
  });

  useEffect(() => {
    const stored = localStorage.getItem("myKey");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.from || parsed.to) {
        setSelect(parsed);
      }
    }
  }, []);

  const handleSelect = (e)=>{
   const {value,name} = e.target;
   setSelect({
     ...select,
     [name]: value,
     ...(name === "tripType" && value !== "round" ? { returnDate: "" } : {}),
   })
  }

  const handleButton = ()=>{
    localStorage.setItem("myKey", JSON.stringify(select));
    handle(select)
  }

  const [nav, setNav] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      if (window.scrollY >= 10) {
        setNav(true);
      } else {
        setNav(false);
      }
    };
    window.addEventListener("scroll", handleChange);
    return () => window.removeEventListener("scroll", handleChange);
  }, []);

  return (
    <Style>
        <div className={ nav === true ? "hello jelo" : "jelo" }>
      <div className="topdiv">
        <div className="first">
          <p>Trip from</p>
          <select name="tripType" value={select.tripType || "oneway"} onChange={handleSelect}>
            <option value="oneway">Oneway</option>
            <option value="round">Round Trip</option>
          </select>
        </div>
        <div className="second">
          <p>{config.fromLabel}</p>
          <select onChange={handleSelect} name="from" value={select.from}>
            <option value="">{config.fromPlaceholder}</option>
            {config.places.map((e) => (
              <option value={e.code} key={e.code}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="second">
          <p>{config.toLabel}</p>
          <select onChange={handleSelect} name="to" value={select.to}>
            <option value="">{config.toPlaceholder}</option>
            {config.places.map((e) => (
              <option value={e.code} key={e.code}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="second">
          <p>Travel Date</p>
          <input type="date" name="departureDate" value={select.departureDate || ""} onChange={handleSelect} style={{
            border: 'none', background: 'transparent', color: 'white',
            fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: 'none', width: '100%'
          }} />
        </div>
        <div className="second">
          <p>Return Date</p>
          <input type="date" name="returnDate" value={select.returnDate || ""} disabled={select.tripType !== "round"} onChange={handleSelect} style={{
            border: 'none', background: 'transparent', color: 'white',
            fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: 'none', width: '100%'
          }} />
        </div>
        {searchType === "flights" && (
          <div className="second">
            <p>Class</p>
            <select name="cabinClass" value={select.cabinClass || "economy"} onChange={handleSelect}>
              <option value="economy">Economy</option>
              <option value="premEco">Premium Eco</option>
              <option value="business">Business</option>
            </select>
          </div>
        )}
        <button onClick={()=>{
          handleButton()
        }}>{config.buttonText}</button>
      </div>
      </div>
    </Style>
  );
};
