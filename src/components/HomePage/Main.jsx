import { Navbar } from "./Navbar";
import { Smallbutton } from "./Smallbutton";
import { Icondiv } from "./Icondiv";
import { Bookingcss } from "./Bookingcss";
import { FlightsForm, TrainsForm, BusesForm, CabsForm, YatrasForm } from "./BookingForms";
import { MultipleSlidesExample, BigSlidesExample } from "./Slidebar";
import { Bigslide, TripMoney } from "./Slidecss";
import { Bottom } from "./Bottom";
import { Header } from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { SmallBottom } from "./SmallBottom";
import { useState } from "react";
import { FareTypes } from "./FareTypes";
import { Login } from "../login/Login";
import { TirthYatraCards } from "./TirthYatraCards";
import { DharamshalaSection } from "./DharamshalaSection";
import { MobileBottomNav } from "./MobileBottomNav";

export const Main = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flights");
  const [data, setData] = useState({
    from: "",
    to: "",
    tripType: "oneway",
    departureDate: "",
    returnDate: "",
    cabinClass: "economy",
  });
  const handleData = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const addLocal = () => {
    localStorage.setItem("myKey", JSON.stringify(data));
  };
  const handlePopup = () => {
    const popup = document.getElementById("popup");
    popup.classList.toggle("active");
  };

  const handleTabChange = (tabId) => {
    if (tabId === "dharamshala") {
      navigate("/dharamshalas");
      return;
    }
    if (tabId === "yatras") {
      navigate("/tirth-yatras");
      return;
    }
    if (tabId === "reels") {
      navigate("/reels");
      return;
    }
    if (tabId === "devotees") {
      navigate("/devotee-profiles");
      return;
    }
    setActiveTab(tabId);
  };

  /* Checkbox labels per tab */
  const checkboxConfig = {
    yatras: {
      items: [
        { id: "single", label: "SINGLE TIRTH" },
        { id: "multi", label: "MULTI TIRTH" },
        { id: "circuit", label: "YATRA CIRCUIT" },
      ],
      right: "DOMESTIC YATRAS",
    },
    flights: {
      items: [],
      right: "",
    },
    trains: {
      items: [],
      right: "",
    },
    buses: {
      items: [],
      right: "",
    },
    cabs: {
      items: [],
      right: "",
    },
  };

  const currentCheckbox = checkboxConfig[activeTab] || checkboxConfig.yatras;

  /* Search button labels */
  const searchLabels = {
    yatras: "SEARCH YATRA",
    flights: "SEARCH FLIGHTS",
    trains: "SEARCH TRAINS",
    buses: "SEARCH BUSES",
    cabs: "SEARCH CABS",
    homestays: "SEARCH HOMESTAYS",
    visa: "SEARCH",
  };

  const handleSearch = () => {
    addLocal();
    localStorage.setItem("searchType", activeTab);
    navigate("/search");
  };

  /* Render form based on active tab */
  const renderForm = () => {
    switch (activeTab) {
      case "flights": return <FlightsForm handleChange={handleData} />;
      case "trains": return <TrainsForm handleChange={handleData} />;
      case "buses": return <BusesForm handleChange={handleData} />;
      case "cabs": return <CabsForm handleChange={handleData} />;
      default: return <YatrasForm handleChange={handleData} />;
    }
  };

  return (
    <div>
      <Header />
      <Navbar>
        <div className="topdiv">
          <div className="login">
            <Login handleClick={handlePopup} />
          </div>
          <Smallbutton>
            <div className="smallbuttonpic">🕉️</div>
            <div>
              <h4>My Yatras</h4>
              <p>Manage Bookings</p>
            </div>
          </Smallbutton>
          <Link to="/">
            <img
              className="mmtlogo"
              src="/Brand_Logo.jpg"
              alt="Tirth Sutra"
            />
          </Link>
        </div>

        <div className="tagline">
          <h1>Tirth Sutra</h1>
          <p>An Authentic Pilgrimage Experience</p>
          <p className="sanskrit">तीर्थ सूत्र — शुद्ध तीर्थयात्रा</p>
        </div>

        <Bookingcss>
          <Icondiv activeTab={activeTab} onTabChange={handleTabChange} />
          {currentCheckbox.items.length > 0 && (
            <div className="checkboxdiv">
              <div>
                {currentCheckbox.items.map((item) => (
                  <span key={item.id}>
                    <input type="checkbox" id={item.id} />
                    <label htmlFor={item.id}>{item.label}</label>
                  </span>
                ))}
              </div>
              <div>{currentCheckbox.right}</div>
            </div>
          )}
          {renderForm()}
          {activeTab === "yatras" && <FareTypes />}
        </Bookingcss>
        <div className="button">
          <button onClick={handleSearch}>
            {searchLabels[activeTab] || "SEARCH"}
          </button>
        </div>
      </Navbar>

      <div style={{ background: "#faf7f2", paddingTop: "50px" }}>
        <SmallBottom />

        {/* Featured Slides */}
        <div style={{ width: "90%", margin: "auto", maxWidth: 1200 }}>
          <MultipleSlidesExample />
        </div>

        {/* Tirth Yatra Cards */}
        <TirthYatraCards />

        {/* Dharamshala Section */}
        <DharamshalaSection />

        {/* Featured Yatras Carousel */}
        <Bigslide>
          <div className="supreoffers">
            <h1>Featured Yatras</h1>
            <div>
              <h3>ALL YATRAS</h3>
              <h3>CHAR DHAM</h3>
              <h3>JYOTIRLINGA</h3>
              <h3>MORE</h3>
            </div>
          </div>
          <BigSlidesExample className="bigslideex" />
        </Bigslide>

        {/* Yatra Seva Section */}
        <TripMoney>
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ width: 50, height: 3, background: 'linear-gradient(135deg, #ff6b35, #c0392b)', borderRadius: 10, margin: '0 auto 8px' }}></div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, color: '#2c1810', marginBottom: 4 }}>Yatra Seva</h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6b5b4f' }}>Essential services for your sacred journey</p>
          </div>
          <div className="maindiv">
            <div id="div2" style={{ borderColor: "#c0392b" }}>
              <span style={{ fontSize: 36 }}>🛕</span>
              <div style={{ marginLeft: 12 }}>
                <h3>Dharamshala Booking</h3>
                <p>Book verified, clean pilgrim stays near temples across India</p>
              </div>
            </div>
            <div id="div2" style={{ borderColor: "#d4a847" }}>
              <span style={{ fontSize: 36 }}>📿</span>
              <div style={{ marginLeft: 12 }}>
                <h3>Pandit Booking</h3>
                <p>Connect with qualified Panditas for proper ritual performance</p>
              </div>
            </div>
            <div id="div2" style={{ borderColor: "#ff6b35" }}>
              <span style={{ fontSize: 36 }}>🙏</span>
              <div style={{ marginLeft: 12 }}>
                <h3>Yatra Insurance</h3>
                <p>Complete travel protection for your pilgrimage journey</p>
              </div>
            </div>
          </div>
        </TripMoney>

        <Bottom />
      </div>
      <MobileBottomNav />
    </div>
  );
};
