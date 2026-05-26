import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Icondivcss } from "./Icondivcss";

const tabs = [
  { id: "flights", icon: FlightIcon, label: "Flights" },
  { id: "dharamshala", icon: HotelIcon, label: "Dharamshala" },
  { id: "homestays", icon: HomeWorkIcon, label: "Homestays" },
  { id: "yatras", icon: HolidayVillageIcon, label: "Tirth Yatras" },
  { id: "trains", icon: TrainIcon, label: "Trains" },
  { id: "buses", icon: DirectionsBusFilledIcon, label: "Buses" },
  { id: "cabs", icon: LocalTaxiIcon, label: "Cabs" },
  { id: "visa", icon: CreditCardIcon, label: "Visa" },
  { id: "reels", icon: PlayCircleFilledIcon, label: "Reels" },
  { id: "devotees", icon: VerifiedIcon, label: "Devotees" },
];

export const Icondiv = ({ activeTab = "yatras", onTabChange }) => {
  return (
    <Icondivcss>
      <div className="icondiv">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => onTabChange && onTabChange(tab.id)}
            >
              <span>
                <Icon style={{ fontSize: 40, padding: 4 }} />
              </span>
              <p>{tab.label}</p>
            </div>
          );
        })}
      </div>
    </Icondivcss>
  );
};
