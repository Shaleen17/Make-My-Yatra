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
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../login/Login";

const Icondivcss = styled.div`
  .icondiv {
    height: 64px;
    width: 100%;
    margin: auto;
    background-color: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(12px);
    display: flex;
    flex-direction: row;
    position: fixed;
    z-index: 100;
    text-align: center;
    box-shadow: 0 2px 20px rgba(44, 24, 16, 0.08);
    border-bottom: 1px solid #f0ebe5;
    animation: slideDown 0.3s ease-out;
    transition: box-shadow 0.3s ease, transform 0.3s ease;

    .icons {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 4px;
      width: 65%;
      align-items: center;

      p {
        padding: 0;
        margin: -4px 0 0;
        color: #6b5b4f;
        font-size: 10px;
        font-weight: 500;
        font-family: 'Outfit', sans-serif;
      }

      span {
        color: #9e8e82;
        cursor: pointer;
        transition: color 0.25s ease;
      }

      span:hover {
        color: #c0392b;
      }

      > div {
        padding: 4px 10px;
        border-radius: 8px;
        transition: all 0.25s ease;
        cursor: pointer;
      }

      > div:hover {
        background-color: rgba(255, 107, 53, 0.06);
        color: #c0392b;
      }

      > div:hover p {
        color: #c0392b;
      }

      > div:hover span {
        color: #c0392b;
      }
    }
  }

  .disnone {
    display: none;
  }

  .imgdiv {
    position: relative;
    top: 8px;
    left: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    img {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      object-fit: cover;
    }

    .brand-text {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #2c1810;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }
  }

  .login {
    position: relative;
    top: 10px;
    right: 20px;
    margin-left: auto;
    flex-shrink: 0;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .icondiv {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
      height: 58px;
      width: 100%;

      .icons {
        width: 100%;
        min-width: 0;
        gap: 0;
        overflow-x: auto;
        justify-content: flex-start;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;

        > div {
          padding: 4px 6px;
          flex-shrink: 0;
        }

        p {
          font-size: 8px;
        }
      }

      .icons::-webkit-scrollbar {
        display: none;
      }

      .icons > div {
        scroll-snap-align: center;
      }
    }

    .imgdiv {
      position: static;
      top: auto;
      left: auto;
      padding-left: 8px;

      .brand-text {
        display: none;
      }
      img {
        width: 32px;
        height: 32px;
      }
    }

    .login {
      position: static;
      top: auto;
      right: auto;
      margin-left: 6px;
      margin-right: 8px;
    }
  }
`;

export const Header = () => {
  const navigate = useNavigate();

  const handlePopup = () => {
    const popup = document.getElementById("popup");
    popup.classList.toggle("active");
  };

  const [nav, setNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNav(window.scrollY >= 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Icondivcss>
      <div className={nav ? "icondiv" : "disnone"}>
        <div className="imgdiv">
          <Link to="/">
            <img src="/Brand_Logo.jpg" alt="Tirth Sutra" />
          </Link>
          <span className="brand-text">Tirth Sutra</span>
        </div>
        <div className="icons">
          <div>
            <span>
              <FlightIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Flights</p>
          </div>
          <div>
            <span>
              <HotelIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Dharamshala</p>
          </div>
          <div>
            <span>
              <HomeWorkIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Homestays</p>
          </div>
          <div>
            <span>
              <HolidayVillageIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Tirth Yatras</p>
          </div>
          <div>
            <span>
              <TrainIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Trains</p>
          </div>
          <div>
            <span>
              <DirectionsBusFilledIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Buses</p>
          </div>
          <div>
            <span>
              <LocalTaxiIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Cabs</p>
          </div>
          <div>
            <span>
              <CreditCardIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Visa</p>
          </div>
          <div onClick={() => navigate("/reels")}>
            <span>
              <PlayCircleFilledIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Reels</p>
          </div>
          <div onClick={() => navigate("/devotee-profiles")}>
            <span>
              <VerifiedIcon style={{ fontSize: 24, padding: 2 }} />
            </span>
            <p>Devotees</p>
          </div>
        </div>
        <div className="login">
          <Login handleClick={handlePopup} />
        </div>
      </div>
    </Icondivcss>
  );
};
