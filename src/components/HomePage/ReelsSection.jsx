import { Link } from "react-router-dom";
import styled from "styled-components";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

const Section = styled.section`
  background: #050505;
  color: #ffffff;
  scroll-margin-top: 0;
  padding: 40px 0;

  @media (min-width: 769px) {
    display: none;
  }

  .reel-preview {
    padding: 0 16px;
    font-family: 'Outfit', sans-serif;
    text-align: center;
  }

  .reel-header {
    margin-bottom: 20px;
  }

  .reel-header h2 {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 6px;
  }

  .reel-header p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .reel-thumbnails {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 24px;
  }

  .reel-thumb {
    position: relative;
    width: calc(50% - 5px);
    max-width: 170px;
    aspect-ratio: 9 / 16;
    border-radius: 16px;
    overflow: hidden;
    background: #1a1a1a;
    cursor: pointer;
  }

  .reel-thumb video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
  }

  .reel-thumb::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%);
    pointer-events: none;
  }

  .play-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    pointer-events: none;
  }

  .play-overlay svg {
    font-size: 30px;
  }

  .thumb-label {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 2;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 6px rgba(0,0,0,0.7);
    text-align: left;
    line-height: 1.3;
  }

  .watch-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    padding: 0 32px;
    border-radius: 999px;
    background: linear-gradient(145deg, #ff6b35, #c0392b);
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 800;
    text-decoration: none;
    box-shadow:
      0 8px 24px rgba(192, 57, 43, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .watch-btn:active {
    transform: scale(0.96);
    box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3);
  }

  .watch-btn svg {
    font-size: 22px;
  }
`;

const reels = [
  {
    url: "https://videos-o57d.vercel.app/Reel57.mp4",
    label: "Sacred temple darshan moments",
  },
  {
    url: "https://videos-o57d.vercel.app/Reel20.mp4",
    label: "Yatra glimpses & spiritual stories",
  },
];

export const ReelsSection = () => {
  return (
    <Section id="reels-section">
      <div className="reel-preview">
        <div className="reel-header">
          <h2>Tirth Reels</h2>
          <p>Short spiritual moments in a full-screen reel view</p>
        </div>

        <div className="reel-thumbnails">
          {reels.map((reel) => (
            <Link to="/reels" key={reel.url} className="reel-thumb" style={{ textDecoration: 'none' }}>
              <video src={reel.url} muted playsInline preload="metadata" />
              <div className="play-overlay">
                <PlayCircleFilledIcon />
              </div>
              <div className="thumb-label">{reel.label}</div>
            </Link>
          ))}
        </div>

        <Link to="/reels" className="watch-btn">
          <PlayCircleFilledIcon />
          Watch Reels
        </Link>
      </div>
    </Section>
  );
};
