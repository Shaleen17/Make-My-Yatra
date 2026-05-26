import { useState } from "react";
import { Fromtocss } from "./Fromtocss";

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

export const Fromto = ({ handleChange }) => {
  return (
    <Fromtocss>
      <div className="fromtodiv">
        <div>
          <h3>STARTING POINT</h3>
          <select onChange={handleChange} name="from" id="from-select">
            <option value="">Select Origin</option>
            {tirthPlaces.map((e) => (
              <option value={e.code} key={e.code}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="swap-icon">⇄</div>
        <div>
          <h3>DESTINATION TIRTH</h3>
          <select onChange={handleChange} name="to" id="to-select">
            <option value="">Select Tirth</option>
            {tirthPlaces.map((e) => (
              <option value={e.code} key={e.code}>
                {e.name}
              </option>
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
