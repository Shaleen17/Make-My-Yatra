import { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";
import { MobileBottomNav } from "./MobileBottomNav";

const Page = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 9999;
  font-family: 'Outfit', sans-serif;
  overflow: hidden;
  display: flex;
  justify-content: center;
  --reel-nav-height: calc(72px + env(safe-area-inset-bottom));

  .reel-frame {
    position: relative;
    width: 100%;
    max-width: 440px;
    height: 100svh;
    min-height: 100vh;
    overflow: hidden;
    background: #000;
  }

  .reel-shell {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: var(--reel-nav-height);
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    background: #000;
  }
  .reel-shell::-webkit-scrollbar { display: none; }

  .reel-panel {
    position: relative;
    width: 100%;
    height: calc(100svh - var(--reel-nav-height));
    min-height: 500px;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    background: #000;
    overflow: hidden;
  }

  video.reel-video {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #000;
  }

  .reel-scrim {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 12%),
      linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 40%);
    z-index: 1;
    pointer-events: none;
  }

  .tap-layer {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  /* Progress bar */
  .reel-progress {
    position: absolute;
    top: calc(env(safe-area-inset-top) + 8px);
    left: 12px; right: 12px;
    z-index: 5;
  }
  .progress-track {
    height: 2.5px;
    border-radius: 99px;
    background: rgba(255,255,255,0.25);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: #fff;
    border-radius: inherit;
    transition: width 0.15s linear;
  }

  /* Mute button */
  .mute-btn {
    position: absolute;
    top: calc(env(safe-area-inset-top) + 22px);
    right: 14px;
    z-index: 5;
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(10px);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .mute-btn svg { font-size: 18px; }

  /* Center play/pause */
  .center-play {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%) scale(0.7);
    width: 64px; height: 64px;
    border-radius: 50%;
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(8px);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s, transform 0.2s;
  }
  .center-play.visible {
    opacity: 1;
    transform: translate(-50%,-50%) scale(1);
  }
  .center-play svg { font-size: 36px; }

  /* Heart animation */
  .dbl-heart {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%) scale(0);
    z-index: 6;
    pointer-events: none;
    opacity: 0;
  }
  .dbl-heart.pop { animation: heartBig 0.75s ease forwards; }
  .dbl-heart svg { font-size: 80px; color: #ff3b5c; filter: drop-shadow(0 4px 18px rgba(255,59,92,0.5)); }
  @keyframes heartBig {
    0%   { opacity:0; transform: translate(-50%,-50%) scale(0); }
    15%  { opacity:1; transform: translate(-50%,-50%) scale(1.3); }
    30%  { transform: translate(-50%,-50%) scale(0.95); }
    45%  { transform: translate(-50%,-50%) scale(1.1); opacity:1; }
    100% { opacity:0; transform: translate(-50%,-50%) scale(1.4); }
  }

  /* Side actions */
  .reel-actions {
    position: absolute;
    right: 8px;
    bottom: 80px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 3;
  }
  .r-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    background: none;
    border: none;
    padding: 0;
    text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    cursor: pointer;
  }
  .r-action .icon-circle {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .r-action .icon-circle:active { transform: scale(0.88); }
  .r-action .icon-circle svg { font-size: 20px; }
  .r-action .icon-circle.liked { color: #ff3b5c; }

  /* Creator info */
  .reel-info {
    position: absolute;
    left: 12px;
    right: 64px;
    bottom: 16px;
    z-index: 2;
  }
  .creator-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .creator-row img {
    width: 36px; height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.7);
  }
  .creator-row .name {
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 4px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.6);
  }
  .creator-row .name svg { font-size: 15px; color: #4db2ff; }
  .reel-caption {
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    text-shadow: 0 2px 8px rgba(0,0,0,0.7);
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .music-row {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255,255,255,0.75);
    font-size: 11px;
  }
  .music-row svg { font-size: 13px; animation: spin 3s linear infinite; }
  @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  .music-row .marquee {
    overflow: hidden;
    max-width: 160px;
    white-space: nowrap;
  }
  .music-row .marquee span {
    display: inline-block;
    animation: scrollText 8s linear infinite;
  }
  @keyframes scrollText { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }

  .desktop-rail {
    display: none;
  }

  .desktop-back-btn {
    display: none;
  }

  @media (min-width: 769px) {
    --reel-nav-height: 0px;
    align-items: center;
    background:
      radial-gradient(circle at 18% 14%, rgba(255, 107, 53, 0.18), transparent 28%),
      radial-gradient(circle at 74% 44%, rgba(212, 168, 71, 0.12), transparent 24%),
      linear-gradient(125deg, #2c1810 0%, #160c08 42%, #080403 100%);
    justify-content: center;
    padding: 22px 0;

    .reel-frame {
      border: 1px solid rgba(212, 168, 71, 0.24);
      border-radius: 28px;
      box-shadow:
        0 22px 70px rgba(0, 0, 0, 0.5),
        0 0 0 8px rgba(0, 0, 0, 0.14),
        0 0 80px rgba(255, 107, 53, 0.1);
      height: min(90vh, 760px);
      min-height: 560px;
      max-width: 420px;
      overflow: hidden;
      width: min(30vw, 420px);
    }

    .reel-shell {
      bottom: 0;
      border-radius: inherit;
    }

    .reel-panel {
      height: min(90vh, 760px);
      min-height: 560px;
    }

    video.reel-video {
      filter: brightness(0.76) saturate(1.05);
    }

    .reel-scrim {
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, transparent 16%),
        linear-gradient(0deg, rgba(0, 0, 0, 0.82) 0%, transparent 46%);
    }

    .reel-progress {
      left: 20px;
      right: 20px;
      top: 22px;
    }

    .progress-track {
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
    }

    .progress-fill {
      background: linear-gradient(90deg, #d4a847, #ffdf96);
    }

    .mute-btn {
      right: 20px;
      top: 34px;
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.42);
      border-color: rgba(255, 255, 255, 0.14);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
    }

    .mute-btn svg {
      font-size: 20px;
    }

    .center-play {
      width: 70px;
      height: 70px;
    }

    .center-play svg {
      font-size: 38px;
    }

    .reel-actions {
      bottom: 92px;
      right: 18px;
      gap: 13px;
    }

    .r-action {
      font-size: 10px;
    }

    .r-action .icon-circle {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.34);
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.24);
    }

    .r-action .icon-circle svg {
      font-size: 20px;
    }

    .reel-info {
      bottom: 34px;
      left: 22px;
      right: 78px;
    }

    .creator-row {
      gap: 10px;
      margin-bottom: 9px;
    }

    .creator-row img {
      width: 46px;
      height: 46px;
      border: 2px solid #fff8f0;
      box-shadow: 0 0 0 3px rgba(212, 168, 71, 0.26);
    }

    .creator-row .name {
      font-size: 17px;
      line-height: 1.16;
    }

    .creator-row .name svg {
      font-size: 16px;
    }

    .reel-caption {
      font-size: 14px;
      margin-bottom: 7px;
    }

    .music-row {
      font-size: 12px;
    }

    .desktop-rail {
      display: flex;
      flex-direction: column;
      gap: 18px;
      position: absolute;
      right: clamp(36px, 8vw, 140px);
      top: 50%;
      transform: translateY(-50%);
      z-index: 12;
    }

    .desktop-rail button {
      align-items: center;
      background: rgba(255, 248, 240, 0.06);
      border: 1px solid rgba(255, 248, 240, 0.12);
      border-radius: 50%;
      color: rgba(255, 248, 240, 0.86);
      display: flex;
      height: 58px;
      justify-content: center;
      min-height: 58px;
      width: 58px;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
      transition: transform 0.18s ease, background 0.18s ease, opacity 0.18s ease;
    }

    .desktop-rail button:hover:not(:disabled) {
      background: rgba(255, 248, 240, 0.1);
      transform: translateY(-2px);
    }

    .desktop-rail button:disabled {
      opacity: 0.28;
      cursor: default;
    }

    .desktop-rail svg {
      font-size: 28px;
    }

    .desktop-back-btn {
      align-items: center;
      background: rgba(255, 248, 240, 0.08);
      border: 1px solid rgba(255, 248, 240, 0.14);
      border-radius: 999px;
      color: rgba(255, 248, 240, 0.9);
      display: inline-flex;
      font-size: 14px;
      font-weight: 800;
      gap: 8px;
      height: 42px;
      left: 28px;
      min-height: 42px;
      padding: 0 16px;
      position: fixed;
      top: 24px;
      z-index: 20;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
      transition: background 0.18s ease, transform 0.18s ease;
    }

    .desktop-back-btn:hover {
      background: rgba(255, 248, 240, 0.13);
      transform: translateY(-1px);
    }

    .desktop-back-btn svg {
      font-size: 16px;
    }
  }
`;

const reels = [
  {
    url: "https://videos-o57d.vercel.app/Reel57.mp4",
    caption: "Stop scrolling for 2 minutes and offer a quiet prayer.",
    music: "Tirth Sutra • Sacred Temple Bells • Original",
    likes: "12.8K",
    comments: "342",
  },
  {
    url: "https://videos-o57d.vercel.app/Reel20.mp4",
    caption: "Temple routes, rituals, and calm yatra glimpses.",
    music: "Tirth Sutra • Aarti Sangrah • Devotional",
    likes: "9.6K",
    comments: "218",
  },
];

export const ReelsPage = () => {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState({});
  const [progress, setProgress] = useState({});
  const [showHeart, setShowHeart] = useState(false);
  const shellRef = useRef(null);
  const panelRefs = useRef([]);
  const videoRefs = useRef([]);
  const lastTapRef = useRef(0);
  const animRef = useRef(null);

  /* Auto-play first video on mount */
  useEffect(() => {
    const timer = setTimeout(() => {
      const v = videoRefs.current[0];
      if (v) {
        v.muted = true;
        v.play().catch(() => {});
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /* Intersection Observer */
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number(visible.target.dataset.index);
          setActiveIdx(prev => { if (prev !== idx) setPaused(false); return idx; });
        }
      },
      { root: shell, threshold: [0.5, 0.8] }
    );
    panelRefs.current.forEach(p => p && obs.observe(p));
    return () => obs.disconnect();
  }, []);

  /* Play/pause active video */
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.muted = muted;
      if (i === activeIdx && !paused) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIdx, muted, paused]);

  /* Progress tracking */
  const updateProgress = useCallback(() => {
    const v = videoRefs.current[activeIdx];
    if (v && v.duration) {
      setProgress(p => ({ ...p, [activeIdx]: (v.currentTime / v.duration) * 100 }));
    }
    animRef.current = requestAnimationFrame(updateProgress);
  }, [activeIdx]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(updateProgress);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [updateProgress]);

  const handleTap = (idx) => {
    const now = Date.now();
    const diff = now - lastTapRef.current;
    lastTapRef.current = now;
    if (diff < 300) {
      setLiked(p => ({ ...p, [idx]: true }));
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 750);
      return;
    }
    setTimeout(() => {
      if (Date.now() - lastTapRef.current >= 280) {
        const v = videoRefs.current[idx];
        if (!v) return;
        if (v.paused) { v.play().catch(() => {}); setPaused(false); }
        else { v.pause(); setPaused(true); }
      }
    }, 300);
  };

  const scrollToReel = (idx) => {
    const shell = shellRef.current;
    if (!shell) return;
    const nextIndex = Math.max(0, Math.min(reels.length - 1, idx));
    shell.scrollTo({
      top: nextIndex * shell.clientHeight,
      behavior: "smooth",
    });
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <Page>
      <button
        className="desktop-back-btn"
        onClick={goBack}
        type="button"
        aria-label="Go back"
      >
        <ArrowBackIosNewRoundedIcon />
        Back
      </button>
      <div className="reel-frame">
        <div className="reel-shell" ref={shellRef}>
          {reels.map((reel, idx) => (
            <div className="reel-panel" key={reel.url} data-index={idx} ref={el => { panelRefs.current[idx] = el; }}>
              <video
                ref={el => { videoRefs.current[idx] = el; }}
                className="reel-video"
                src={reel.url}
                loop
                muted
                playsInline
                preload="auto"
                crossOrigin="anonymous"
              />
              <div className="reel-scrim" />
              <button className="tap-layer" onClick={() => handleTap(idx)} aria-label="Tap to play or pause" type="button" />

              <div className={`dbl-heart ${showHeart && idx === activeIdx ? "pop" : ""}`}><FavoriteRoundedIcon /></div>

              {/* Progress */}
              <div className="reel-progress">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress[idx] || 0}%` }}
                  />
                </div>
              </div>

              {/* Mute */}
              <button className="mute-btn" onClick={e => { e.stopPropagation(); setMuted(m => !m); }} type="button">
                {muted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
              </button>

              {/* Center play */}
              <div className={`center-play ${paused && idx === activeIdx ? "visible" : ""}`}>
                {paused ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}
              </div>

              {/* Side actions */}
              <div className="reel-actions">
                <button className="r-action" onClick={e => { e.stopPropagation(); setLiked(p => ({ ...p, [idx]: !p[idx] })); }} type="button">
                  <div className={`icon-circle ${liked[idx] ? "liked" : ""}`}><FavoriteRoundedIcon /></div>
                  <span>{reel.likes}</span>
                </button>
                <div className="r-action">
                  <div className="icon-circle"><ChatBubbleRoundedIcon /></div>
                  <span>{reel.comments}</span>
                </div>
                <button className="r-action" onClick={e => { e.stopPropagation(); if (navigator.share) navigator.share({ title: "Tirth Sutra Reel", url: reel.url }).catch(() => {}); }} type="button">
                  <div className="icon-circle"><ShareRoundedIcon /></div>
                  <span>Share</span>
                </button>
                <div className="r-action">
                  <div className="icon-circle"><BookmarkBorderRoundedIcon /></div>
                  <span>Save</span>
                </div>
              </div>

              {/* Creator info */}
              <div className="reel-info">
                <div className="creator-row">
                  <img src="/Brand_Logo.jpg" alt="Tirth Sutra" />
                  <span className="name">Tirth Sutra Community <VerifiedIcon /></span>
                </div>
                <div className="reel-caption">{reel.caption}</div>
                <div className="music-row">
                  <MusicNoteRoundedIcon />
                  <div className="marquee"><span>{reel.music}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <MobileBottomNav activeOverride="Reels" variant="reel" withSpacer={false} />
      </div>

      <div className="desktop-rail" aria-label="Reel navigation">
        <button
          aria-label="Previous reel"
          disabled={activeIdx === 0}
          onClick={() => scrollToReel(activeIdx - 1)}
          type="button"
        >
          <KeyboardArrowUpRoundedIcon />
        </button>
        <button
          aria-label="Next reel"
          disabled={activeIdx === reels.length - 1}
          onClick={() => scrollToReel(activeIdx + 1)}
          type="button"
        >
          <KeyboardArrowDownRoundedIcon />
        </button>
      </div>
    </Page>
  );
};
