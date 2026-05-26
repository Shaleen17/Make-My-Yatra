import styled from "styled-components";
import PlaceIcon from "@mui/icons-material/Place";
import HotelIcon from "@mui/icons-material/Hotel";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ExploreIcon from "@mui/icons-material/Explore";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

const Style = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(44, 24, 16, 0.08);
  color: #2c1810;
  font-size: 14px;
  width: 78%;
  max-width: 960px;
  margin: auto;
  align-items: center;
  display: flex;
  justify-content: space-around;
  height: 64px;
  position: relative;
  top: -32px;
  z-index: 10;
  border: 1px solid #f0ebe5;
  font-family: 'Outfit', sans-serif;
  overflow: hidden;

  div:nth-child(1) {
    border: none !important;
  }

  .quick-item {
    align-items: center;
    width: 100%;
    color: #6b5b4f;
    gap: 10px;
    display: flex;
    height: 100%;
    font-size: 13px;
    border-left: 1px solid #f0ebe5;
    padding: 0 20px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-weight: 500;
    user-select: none;

    &:hover {
      background: rgba(255, 107, 53, 0.04);
      color: #c0392b;
    }

    .icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #f5f0e8;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.25s ease;
    }

    &:hover .icon-wrapper {
      background: rgba(255, 107, 53, 0.1);
      color: #c0392b;
    }

    p {
      color: inherit;
      display: inline;
      font-size: 13px;
      line-height: 1.3;
      text-align: left;
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    width: 92%;
    height: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 6px;
    border-radius: 12px;
    top: -24px;
    gap: 0;

    .quick-item {
      width: 100%;
      border-left: none !important;
      border-bottom: 1px solid #f0ebe5;
      padding: 12px 10px;
      font-size: 12px;
      gap: 8px;

      .icon-wrapper {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }

      &:active {
        background: rgba(255, 107, 53, 0.06);
      }
    }

    .quick-item:nth-last-child(-n+2) {
      border-bottom: none;
    }

    .desktop-only {
      display: none !important;
    }
  }
`;

const scrollToMobileSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
  }
};

const handleKeyScroll = (event, sectionId) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    scrollToMobileSection(sectionId);
  }
};

export const SmallBottom = () => {
  return (
    <Style>
      <div className="quick-item">
        <div className="icon-wrapper">
          <PlaceIcon style={{ fontSize: 20, color: '#c0392b' }} />
        </div>
        <p>Tirth Darshan</p>
      </div>
      <div className="quick-item">
        <div className="icon-wrapper">
          <HotelIcon style={{ fontSize: 20, color: '#d4a847' }} />
        </div>
        <p>Dharamshala Finder</p>
      </div>
      <div className="quick-item">
        <div className="icon-wrapper">
          <ExploreIcon style={{ fontSize: 20, color: '#ff6b35' }} />
        </div>
        <p>Yatra Packages</p>
      </div>
      <div className="quick-item desktop-only">
        <div className="icon-wrapper">
          <ExploreIcon style={{ fontSize: 20, color: '#6b5b4f' }} />
        </div>
        <p>Nearby Mandirs</p>
      </div>
      <div className="quick-item desktop-only">
        <div className="icon-wrapper">
          <CardGiftcardIcon style={{ fontSize: 20, color: '#c0392b' }} />
        </div>
        <p>Gift Cards</p>
      </div>
      {/* Mobile replacements */}
      <div
        className="quick-item mobile-only"
        role="button"
        tabIndex={0}
        onClick={() => scrollToMobileSection("reels-section")}
        onKeyDown={(event) => handleKeyScroll(event, "reels-section")}
      >
        <div className="icon-wrapper">
          <PlayCircleFilledIcon style={{ fontSize: 20, color: '#6b5b4f' }} />
        </div>
        <p>Reels</p>
      </div>
      <div
        className="quick-item mobile-only"
        role="button"
        tabIndex={0}
        onClick={() => scrollToMobileSection("devotee-profiles-section")}
        onKeyDown={(event) => handleKeyScroll(event, "devotee-profiles-section")}
      >
        <div className="icon-wrapper">
          <VerifiedIcon style={{ fontSize: 20, color: '#d4a847' }} />
        </div>
        <p>Devotee Profiles</p>
      </div>
    </Style>
  );
};
