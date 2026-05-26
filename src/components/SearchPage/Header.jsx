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
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../login/Login";
const Icondivcss = styled.div`
  .icondiv {
    height: 60px;
    width: 100%;
    margin: auto;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: sticky;
    z-index: 100;
    text-align: center;
    box-shadow: 0 2px 12px rgba(44, 24, 16, 0.08);
    border-bottom: 1px solid #f0ebe5;

    .icons {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
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
        transition: color 0.2s ease;
      }
      span:hover {
        color: #c0392b;
      }
      > div {
        padding: 4px 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      > div:hover {
        background-color: rgba(255, 107, 53, 0.06);
      }
      > div:hover p {
        color: #c0392b;
      }
      > div:hover span {
        color: #c0392b;
      }
    }
  }

  .imgdiv {
    position: relative;
    top: 0;
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
      white-space: nowrap;
    }
  }

  .login {
    position: relative;
    margin-left: auto;
    margin-right: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .icondiv {
      height: 52px;
    }

    .imgdiv {
      left: 10px;
      img {
        width: 34px;
        height: 34px;
      }
      .brand-text {
        display: none;
      }
    }

    .icondiv .icons {
      width: 70%;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      gap: 0;
      justify-content: flex-start;

      > div {
        flex-shrink: 0;
        padding: 4px 6px;
      }

      p {
        font-size: 8px;
        white-space: nowrap;
      }
    }

    .icondiv .icons::-webkit-scrollbar {
      display: none;
    }

    .login {
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
  return (
    <Icondivcss>
      <div className="icondiv">
        <div className="imgdiv">
          <Link to="/">
            <img src="/Brand_Logo.jpg" alt="Tirth Sutra" />
          </Link>
          <span className="brand-text">Tirth Sutra</span>
        </div>
        <div className="icons">
          <div>
            <span><FlightIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Flights</p>
          </div>
          <div>
            <span><HotelIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Dharamshala</p>
          </div>
          <div>
            <span><HomeWorkIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Homestays</p>
          </div>
          <div>
            <span><HolidayVillageIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Tirth Yatras</p>
          </div>
          <div>
            <span><TrainIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Trains</p>
          </div>
          <div>
            <span><DirectionsBusFilledIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Buses</p>
          </div>
          <div>
            <span><LocalTaxiIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Cabs</p>
          </div>
          <div>
            <span><CreditCardIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Visa</p>
          </div>
          <div onClick={() => navigate("/reels")}>
            <span><PlayCircleFilledIcon style={{ fontSize: 24, padding: 2 }} /></span>
            <p>Reels</p>
          </div>
          <div onClick={() => navigate("/devotee-profiles")}>
            <span><VerifiedIcon style={{ fontSize: 24, padding: 2 }} /></span>
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
