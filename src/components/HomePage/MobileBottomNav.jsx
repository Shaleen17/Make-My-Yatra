import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import VerifiedIcon from "@mui/icons-material/Verified";

const Nav = styled.nav`
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: auto;
    bottom: 0;
    z-index: 120;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: end;
    width: 100vw;
    max-width: 100vw;
    height: 72px;
    padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
    background: rgba(255, 255, 255, 0.98);
    border-top: 1px solid rgba(232, 224, 216, 0.95);
    box-shadow: 0 -6px 24px rgba(44, 24, 16, 0.1);
    font-family: 'Outfit', sans-serif;
    overflow: hidden;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);

    button {
      width: 100%;
      min-width: 0;
      height: 52px;
      padding: 0 2px;
      background: transparent;
      color: #9e8e82;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 0.1px;
      border-radius: 14px;
      border: none;
      transition: color 0.22s ease, background 0.22s ease, transform 0.15s ease;
      position: relative;
    }

    button svg {
      font-size: 22px;
      transition: transform 0.2s ease;
    }

    button span {
      max-width: 100%;
      overflow: hidden;
      text-align: center;
      white-space: normal;
      line-height: 1.12;
    }

    button:active {
      transform: scale(0.92);
    }

    .active {
      color: #c0392b;
    }

    .active svg {
      transform: scale(1.08);
    }

    .active::after {
      content: '';
      position: absolute;
      bottom: 2px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #c0392b;
    }

    .center-action {
      position: relative;
      top: -14px;
      width: 60px;
      height: 60px;
      justify-self: center;
      border-radius: 50%;
      color: #ffffff;
      background: linear-gradient(145deg, #ff6b35, #c0392b);
      box-shadow:
        0 8px 20px rgba(192, 57, 43, 0.35),
        0 2px 6px rgba(255, 107, 53, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .center-action::after {
      display: none;
    }

    .center-action svg {
      font-size: 28px;
    }

    .center-action span {
      color: #ffffff;
      font-size: 9px;
      font-weight: 700;
      margin-top: -2px;
      letter-spacing: 0.3px;
    }

    .center-action:active {
      transform: scale(0.9);
      box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3);
    }

    &.reel-compact {
      align-items: end;
      height: calc(72px + env(safe-area-inset-bottom));
      padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(17, 10, 5, 0.72)),
        rgba(0, 0, 0, 0.28);
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 -16px 34px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    &.reel-compact button {
      height: 52px;
      color: rgba(245, 239, 232, 0.76);
      border-radius: 14px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
    }

    &.reel-compact button svg {
      font-size: 22px;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.28));
    }

    &.reel-compact button span {
      color: inherit;
    }

    &.reel-compact .center-action {
      top: -14px;
      width: 60px;
      height: 60px;
      color: #ffffff;
      background: linear-gradient(145deg, rgba(255, 107, 53, 0.96), rgba(192, 57, 43, 0.96));
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow:
        0 10px 24px rgba(192, 57, 43, 0.32),
        0 2px 10px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);
    }

    &.reel-compact .center-action svg {
      font-size: 28px;
    }

    &.reel-compact .center-action span {
      color: #ffffff;
    }

    &.reel-compact .active {
      color: #ffffff;
    }

    &.reel-compact .active::after {
      bottom: 2px;
      width: 4px;
      height: 4px;
      background: #d4a847;
    }
  }
`;

const Spacer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    height: calc(82px + env(safe-area-inset-bottom));
  }
`;

const items = [
  { label: "Home", displayLabel: "Home", icon: HomeIcon, target: "top" },
  { label: "My Yatras", displayLabel: "My Yatras", icon: HolidayVillageIcon, target: "tirth-yatras-section" },
  { label: "Reels", displayLabel: "Reels", icon: PlayCircleFilledIcon, route: "/reels", target: "reels-section", center: true },
  { label: "Where2Go", displayLabel: "Where2Go", icon: TravelExploreIcon, target: "dharamshala-section" },
  { label: "Devotee Profiles", displayLabel: "Devotees", icon: VerifiedIcon, route: "/devotee-profiles", target: "devotee-profiles-section" },
];

const activeFromPath = (pathname) => {
  if (pathname === "/reels") return "Reels";
  if (pathname === "/devotee-profiles") return "Devotee Profiles";
  return "Home";
};

const scrollToTarget = (target, navigate) => {
  if (window.location.pathname !== "/") {
    navigate("/", { state: { scrollTarget: target } });
    return;
  }

  if (target === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const section = document.getElementById(target);
  if (section) {
    window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
  }
};

export const MobileBottomNav = ({ activeOverride, variant = "default", withSpacer = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = items;
  const [active, setActive] = useState(() => activeOverride || activeFromPath(location.pathname));

  useEffect(() => {
    setActive(activeOverride || activeFromPath(location.pathname));
  }, [activeOverride, location.pathname]);

  useEffect(() => {
    if (activeOverride || location.pathname !== "/") {
      return undefined;
    }

    const sectionItems = navItems.filter((item) => item.target && item.target !== "top");
    const sections = sectionItems
      .map((item) => ({ ...item, node: document.getElementById(item.target) }))
      .filter((item) => item.node);

    if (sections.length === 0) return undefined;

    const updateActiveFromPosition = () => {
      if (window.scrollY < 80) {
        setActive("Home");
        return;
      }

      const viewportLine = window.innerHeight * 0.45;
      const current = sections.reduce((activeSection, item) => {
        const rect = item.node.getBoundingClientRect();
        return rect.top <= viewportLine ? item : activeSection;
      }, null);

      if (current) setActive(current.label);
    };

    let scrollFrame = 0;
    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        updateActiveFromPosition();
        scrollFrame = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updateActiveFromPosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  }, [activeOverride, location.pathname, navItems]);

  useEffect(() => {
    if (location.pathname !== "/" || !location.state?.scrollTarget) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      scrollToTarget(location.state.scrollTarget, navigate);
      navigate("/", { replace: true, state: {} });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.state, navigate]);

  return (
    <>
      {withSpacer && <Spacer aria-hidden="true" />}
      <Nav aria-label="Mobile quick navigation" className={variant === "reel" ? "reel-compact" : ""}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`${active === item.label ? "active" : ""} ${item.center ? "center-action" : ""}`}
              onClick={() => {
                setActive(item.label);
                if (item.route) {
                  navigate(item.route);
                  return;
                }
                scrollToTarget(item.target, navigate);
              }}
              aria-label={item.label}
            >
              <Icon />
              <span>{item.displayLabel}</span>
            </button>
          );
        })}
      </Nav>
    </>
  );
};
