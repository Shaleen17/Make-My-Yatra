import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { devoteeProfiles } from "./socialData";
import { MobileBottomNav } from "./MobileBottomNav";

const Page = styled.div`
  min-height: 100svh;
  background: var(--bg-main, #faf7f2);
  color: var(--text-primary, #2c1810);
  font-family: var(--font-primary, 'Outfit', sans-serif);

  .directory-screen {
    min-height: 100svh;
    padding-bottom: calc(92px + env(safe-area-inset-bottom));
    background:
      linear-gradient(180deg, rgba(255, 248, 240, 0.98), rgba(250, 247, 242, 1)),
      #faf7f2;
  }

  .directory-top {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(250, 247, 242, 0.96);
    border-bottom: 1px solid rgba(232, 224, 216, 0.95);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    padding-top: env(safe-area-inset-top);
  }

  .page-header {
    align-items: center;
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) 44px;
    height: 54px;
    padding: 0 10px;
  }

  .back-btn,
  .clear-btn,
  .icon-btn,
  .mobile-profile-back {
    align-items: center;
    background: transparent;
    border: 0;
    color: inherit;
    display: flex;
    justify-content: center;
  }

  .back-btn,
  .clear-btn {
    height: 44px;
    min-height: 44px;
    width: 44px;
  }

  .back-btn svg,
  .clear-btn svg {
    font-size: 20px;
  }

  .clear-btn {
    color: var(--text-tertiary, #9e8e82);
  }

  .page-title {
    color: var(--text-primary, #2c1810);
    font-size: 18px;
    font-weight: 800;
    text-align: center;
  }

  .search-wrap {
    padding: 0 14px 12px;
  }

  .search-box {
    align-items: center;
    background: #ffffff;
    border: 1px solid var(--border, #e8e0d8);
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(44, 24, 16, 0.06);
    display: flex;
    gap: 10px;
    height: 48px;
    padding: 0 15px;
  }

  .search-box svg {
    color: var(--text-tertiary, #9e8e82);
    flex: 0 0 auto;
    font-size: 22px;
  }

  .search-box input {
    background: transparent;
    border: 0;
    color: var(--text-primary, #2c1810);
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    min-width: 0;
    outline: none;
  }

  .search-box input::placeholder {
    color: var(--text-tertiary, #9e8e82);
  }

  .result-row {
    align-items: center;
    color: var(--text-tertiary, #9e8e82);
    display: flex;
    font-size: 13px;
    font-weight: 800;
    justify-content: space-between;
    padding: 16px 18px 8px;
  }

  .result-row strong {
    color: var(--text-primary, #2c1810);
  }

  .sant-list {
    display: grid;
    gap: 4px;
    padding: 0 14px 12px;
  }

  .sant-item {
    align-items: center;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(240, 235, 229, 0.92);
    border-radius: 16px;
    box-shadow: 0 8px 26px rgba(44, 24, 16, 0.05);
    display: grid;
    gap: 12px;
    grid-template-columns: 68px minmax(0, 1fr) auto;
    min-height: 78px;
    padding: 8px 10px 8px 8px;
  }

  .sant-link {
    align-items: center;
    color: inherit;
    display: contents;
    text-decoration: none;
  }

  .avatar-ring,
  .profile-avatar-ring,
  .story-ring {
    align-items: center;
    background: conic-gradient(
      from 24deg,
      var(--primary, #c0392b),
      var(--saffron, #ff6b35),
      var(--gold, #d4a847),
      var(--primary, #c0392b)
    );
    border-radius: 50%;
    display: flex;
    justify-content: center;
  }

  .avatar-ring {
    height: 66px;
    padding: 2px;
    width: 66px;
  }

  .sant-avatar {
    background: var(--bg-elevated, #fff8f0);
    border: 3px solid #ffffff;
    border-radius: 50%;
    height: 62px;
    object-fit: cover;
    width: 62px;
  }

  .sant-info {
    min-width: 0;
  }

  .desktop-label {
    display: none;
  }

  .sant-name-row {
    align-items: center;
    display: flex;
    gap: 4px;
    min-width: 0;
  }

  .sant-handle {
    color: var(--text-primary, #2c1810);
    font-size: 15px;
    font-weight: 800;
    line-height: 1.22;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sant-name-row svg,
  .profile-name-row svg,
  .desktop-handle svg,
  .mobile-profile-title svg {
    color: #1d9bf0;
    flex: 0 0 auto;
  }

  .sant-name-row svg {
    font-size: 16px;
  }

  .sant-title {
    color: var(--text-secondary, #6b5b4f);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.28;
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sant-meta {
    color: var(--text-tertiary, #9e8e82);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.26;
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .follow-btn,
  .profile-action {
    align-items: center;
    border: 0;
    display: inline-flex;
    font-weight: 800;
    justify-content: center;
    transition: background 180ms ease, border 180ms ease, color 180ms ease, transform 180ms ease;
  }

  .follow-btn {
    background: var(--gradient-saffron, linear-gradient(135deg, #ff6b35, #c0392b));
    border-radius: 999px;
    box-shadow: 0 6px 16px rgba(192, 57, 43, 0.22);
    color: #ffffff;
    font-size: 13px;
    height: 34px;
    min-height: 34px;
    min-width: 82px;
    padding: 0 12px;
  }

  .follow-btn.following {
    background: #ffffff;
    border: 1px solid var(--border, #e8e0d8);
    box-shadow: none;
    color: var(--text-secondary, #6b5b4f);
  }

  .empty-state {
    color: var(--text-tertiary, #9e8e82);
    font-size: 14px;
    font-weight: 700;
    padding: 36px 18px;
    text-align: center;
  }

  .profile-screen {
    min-height: 100svh;
    background:
      linear-gradient(180deg, rgba(255, 248, 240, 0.94), rgba(250, 247, 242, 1) 34%),
      #faf7f2;
    overflow-x: hidden;
  }

  .mobile-profile-bar {
    align-items: center;
    background: rgba(250, 247, 242, 0.96);
    border-bottom: 1px solid rgba(232, 224, 216, 0.88);
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) 48px;
    height: calc(54px + env(safe-area-inset-top));
    padding: env(safe-area-inset-top) 8px 0;
    position: sticky;
    top: 0;
    z-index: 40;
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .mobile-profile-back,
  .icon-btn {
    border-radius: 50%;
    height: 44px;
    min-height: 44px;
    width: 44px;
  }

  .mobile-profile-back svg,
  .icon-btn svg {
    font-size: 22px;
  }

  .mobile-profile-title {
    align-items: center;
    display: inline-flex;
    font-size: 20px;
    font-weight: 800;
    gap: 6px;
    justify-content: center;
    min-width: 0;
    text-align: center;
  }

  .mobile-profile-title span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-profile-title svg {
    font-size: 17px;
  }

  .profile-shell {
    margin: 0 auto;
    max-width: 1380px;
    overflow-x: hidden;
    width: 100%;
  }

  .profile-head {
    display: grid;
    gap: 10px;
    grid-template-columns: 88px minmax(0, 1fr);
    max-width: 100%;
    padding: 22px 12px 16px;
    width: 100%;
  }

  .profile-avatar-ring {
    align-self: start;
    height: 88px;
    padding: 3px;
    width: 88px;
  }

  .profile-avatar {
    background: #ffffff;
    border: 4px solid #ffffff;
    border-radius: 50%;
    height: 82px;
    object-fit: cover;
    width: 82px;
  }

  .desktop-handle,
  .desktop-profile-actions {
    display: none;
  }

  .mobile-stats {
    align-items: center;
    display: grid;
    gap: 0;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    max-width: 100%;
    min-width: 0;
    padding-top: 8px;
    width: 100%;
  }

  .stat {
    color: var(--text-primary, #2c1810);
    min-width: 0;
    text-align: center;
  }

  .stat strong {
    display: block;
    font-size: 19px;
    font-weight: 900;
    line-height: 1.05;
  }

  .stat span {
    color: var(--text-secondary, #6b5b4f);
    display: block;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.18;
    margin-top: 3px;
  }

  .profile-copy {
    grid-column: 1 / -1;
    min-width: 0;
  }

  .profile-name-row {
    align-items: center;
    display: flex;
    gap: 6px;
    margin-bottom: 5px;
    min-width: 0;
  }

  .profile-name {
    color: var(--text-primary, #2c1810);
    font-size: 18px;
    font-weight: 900;
    line-height: 1.18;
    margin: 0 0 5px;
  }

  .profile-role {
    color: var(--text-tertiary, #9e8e82);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.24;
    margin-bottom: 7px;
  }

  .profile-bio {
    color: var(--text-primary, #2c1810);
    font-size: 15px;
    font-weight: 600;
    line-height: 1.34;
    margin-bottom: 10px;
  }

  .profile-link-row {
    align-items: center;
    color: var(--primary, #c0392b);
    display: flex;
    font-size: 14px;
    font-weight: 800;
    gap: 6px;
    line-height: 1.24;
    margin-bottom: 8px;
    min-width: 0;
  }

  .profile-link-row svg {
    flex: 0 0 auto;
    font-size: 18px;
  }

  .profile-link-row span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .followed-by {
    align-items: center;
    color: var(--text-secondary, #6b5b4f);
    display: flex;
    font-size: 14px;
    font-weight: 700;
    gap: 10px;
    line-height: 1.25;
    min-width: 0;
  }

  .followed-by img {
    border: 2px solid #ffffff;
    border-radius: 50%;
    flex: 0 0 auto;
    height: 34px;
    object-fit: cover;
    width: 34px;
  }

  .followed-by span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .profile-actions {
    display: grid;
    gap: 6px;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 42px;
    max-width: 100%;
    padding: 0 12px 18px;
    width: 100%;
  }

  .profile-action {
    background: #ffffff;
    border: 1px solid var(--border, #e8e0d8);
    border-radius: 10px;
    color: var(--text-primary, #2c1810);
    font-size: 14px;
    gap: 4px;
    height: 42px;
    min-height: 42px;
    min-width: 0;
    padding: 0 10px;
  }

  .profile-action.primary {
    background: var(--gradient-saffron, linear-gradient(135deg, #ff6b35, #c0392b));
    border-color: transparent;
    color: #ffffff;
    box-shadow: 0 9px 22px rgba(192, 57, 43, 0.18);
  }

  .profile-action.following {
    background: #ffffff;
    border-color: var(--border, #e8e0d8);
    color: var(--text-primary, #2c1810);
    box-shadow: none;
  }

  .profile-action svg {
    font-size: 18px;
  }

  .profile-action:active,
  .media-like:active {
    transform: scale(0.96);
  }

  .story-strip {
    border-bottom: 1px solid var(--border, #e8e0d8);
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding: 12px 16px 18px;
    scrollbar-width: none;
  }

  .story-strip::-webkit-scrollbar {
    display: none;
  }

  .story-item {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--text-primary, #2c1810);
    display: grid;
    flex: 0 0 74px;
    gap: 7px;
    justify-items: center;
    min-height: 0;
    padding: 0;
    text-align: center;
  }

  .story-ring {
    box-shadow: 0 6px 18px rgba(44, 24, 16, 0.08);
    height: 68px;
    padding: 3px;
    width: 68px;
  }

  .story-ring img {
    background: #ffffff;
    border: 3px solid #ffffff;
    border-radius: 50%;
    height: 62px;
    object-fit: cover;
    width: 62px;
  }

  .story-item span {
    font-size: 12px;
    font-weight: 800;
    line-height: 1.16;
    max-width: 78px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .profile-tabs {
    background: rgba(250, 247, 242, 0.98);
    border-bottom: 1px solid var(--border, #e8e0d8);
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    position: sticky;
    top: calc(54px + env(safe-area-inset-top));
    z-index: 35;
  }

  .profile-tab {
    align-items: center;
    background: transparent;
    border: 0;
    color: var(--text-tertiary, #9e8e82);
    display: flex;
    height: 54px;
    justify-content: center;
    min-height: 54px;
    position: relative;
  }

  .profile-tab svg {
    font-size: 28px;
  }

  .profile-tab.active {
    color: var(--text-primary, #2c1810);
  }

  .profile-tab.active::after {
    background: var(--gradient-saffron, linear-gradient(135deg, #ff6b35, #c0392b));
    border-radius: 999px;
    bottom: 0;
    content: "";
    height: 3px;
    left: 31%;
    position: absolute;
    right: 31%;
  }

  .profile-media-grid {
    display: grid;
    gap: 2px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .media-card {
    aspect-ratio: 1 / 1.22;
    background: var(--bg-section, #f5f0e8);
    border: 0;
    color: #ffffff;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }

  .media-card img {
    height: 100%;
    object-fit: cover;
    transition: transform 220ms ease, filter 220ms ease;
    width: 100%;
  }

  .media-card::after {
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.18), transparent 34%),
      linear-gradient(0deg, rgba(0, 0, 0, 0.62), transparent 48%);
    content: "";
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  .media-type {
    align-items: center;
    background: rgba(26, 15, 8, 0.58);
    border: 1px solid rgba(255, 248, 240, 0.26);
    border-radius: 999px;
    color: #ffffff;
    display: flex;
    height: 28px;
    justify-content: center;
    position: absolute;
    right: 8px;
    top: 8px;
    width: 28px;
    z-index: 2;
  }

  .media-type svg {
    font-size: 18px;
  }

  .media-overlay {
    align-items: end;
    bottom: 0;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    left: 0;
    padding: 9px 8px;
    position: absolute;
    right: 0;
    z-index: 2;
  }

  .media-metric,
  .media-like {
    align-items: center;
    color: #ffffff;
    display: inline-flex;
    font-size: 13px;
    font-weight: 900;
    gap: 3px;
    line-height: 1;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.42);
  }

  .media-like {
    background: transparent;
    border: 0;
    min-height: 30px;
    padding: 0;
  }

  .media-like.liked {
    color: #ffdf96;
  }

  .media-metric svg,
  .media-like svg {
    font-size: 18px;
  }

  .desktop-stat-row {
    display: none;
  }

  .desktop-profile-back {
    display: none;
  }

  .desktop-directory-back {
    display: none;
  }

  @media (min-width: 769px) {
    background:
      linear-gradient(180deg, rgba(250, 247, 242, 0.96), rgba(245, 240, 232, 0.98)),
      var(--bg-section, #f5f0e8);
    padding: 0 22px 26px;

    .directory-screen {
      background: #ffffff;
      border-left: 1px solid var(--border, #e8e0d8);
      border-right: 1px solid var(--border, #e8e0d8);
      box-shadow: 0 14px 44px rgba(44, 24, 16, 0.07);
      margin: 0 auto;
      max-width: 980px;
      min-height: 100vh;
      padding-bottom: 0;
      width: 100%;
    }

    .directory-top {
      align-items: center;
      background: #ffffff;
      border-bottom: 1px solid var(--border, #e8e0d8);
      display: grid;
      gap: 12px;
      grid-template-columns: auto minmax(0, 1fr);
      padding: 14px 18px 12px;
      position: sticky;
      top: 0;
    }

    .desktop-directory-back {
      align-items: center;
      background: #ffffff;
      border: 1px solid var(--border, #e8e0d8);
      border-radius: 999px;
      color: var(--text-primary, #2c1810);
      display: inline-flex;
      font-size: 14px;
      font-weight: 800;
      gap: 8px;
      height: 40px;
      min-height: 40px;
      padding: 0 15px;
      box-shadow: 0 8px 20px rgba(44, 24, 16, 0.07);
    }

    .desktop-directory-back svg {
      font-size: 16px;
    }

    .page-header {
      display: none;
    }

    .search-wrap {
      padding: 0;
    }

    .search-box {
      background: var(--bg-section, #f5f0e8);
      border: 1px solid #ded2c3;
      box-shadow: none;
      height: 48px;
      padding: 0 16px;
    }

    .search-box svg {
      color: #9f766a;
      font-size: 21px;
    }

    .search-box input {
      color: #5a332b;
      font-size: 17px;
      font-weight: 500;
    }

    .result-row {
      background: #fbf6ef;
      border-bottom: 1px solid var(--border, #e8e0d8);
      color: #9f766a;
      font-size: 14px;
      padding: 11px 20px;
    }

    .result-row strong {
      align-items: center;
      background: #fff3df;
      border-radius: 999px;
      color: var(--text-primary, #2c1810);
      display: inline-flex;
      font-size: 15px;
      gap: 7px;
      padding: 6px 13px;
    }

    .result-row strong::before {
      align-items: center;
      background: #27b246;
      border-radius: 50%;
      color: #ffffff;
      content: "OK";
      display: inline-flex;
      font-size: 8px;
      font-weight: 900;
      height: 20px;
      justify-content: center;
      letter-spacing: 0;
      line-height: 1;
      width: 20px;
    }

    .sant-list {
      gap: 0;
      padding: 0;
    }

    .sant-item {
      background: #ffffff;
      border: 0;
      border-bottom: 1px solid var(--border, #e8e0d8);
      border-radius: 0;
      box-shadow: none;
      grid-template-columns: 68px minmax(0, 1fr) 104px;
      min-height: 88px;
      padding: 12px 20px;
    }

    .sant-item:nth-child(odd) {
      background: #fffaf4;
    }

    .avatar-ring {
      height: 56px;
      padding: 2px;
      width: 56px;
    }

    .sant-avatar {
      border-width: 2px;
      height: 52px;
      width: 52px;
    }

    .sant-info {
      align-self: center;
    }

    .mobile-label {
      display: none;
    }

    .desktop-label {
      display: block;
    }

    .sant-name-row {
      gap: 6px;
      margin-bottom: 4px;
    }

    .sant-handle {
      color: #111111;
      font-size: 18px;
      font-weight: 800;
      line-height: 1.18;
      white-space: normal;
    }

    .sant-name-row svg {
      font-size: 17px;
    }

    .sant-title {
      color: #9f766a;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.28;
      margin-top: 0;
      white-space: normal;
    }

    .sant-meta {
      color: #5a332b;
      font-size: 13px;
      font-weight: 600;
      margin-top: 3px;
      white-space: normal;
    }

    .follow-btn {
      align-self: center;
      background: #542f28;
      border-radius: 9px;
      box-shadow: none;
      font-size: 14px;
      height: 36px;
      justify-self: end;
      min-height: 36px;
      min-width: 84px;
      padding: 0 14px;
    }

    .follow-btn.following {
      background: #fff8f0;
      border: 2px solid var(--border, #e8e0d8);
      color: #5a332b;
    }

    .empty-state {
      font-size: 20px;
      padding: 60px 32px;
    }

    .profile-screen {
      background: #fffaf4;
      border-left: 1px solid var(--border, #e8e0d8);
      border-right: 1px solid var(--border, #e8e0d8);
      margin: 0 auto;
      min-height: 100vh;
      max-width: 1460px;
      box-shadow: 0 18px 70px rgba(44, 24, 16, 0.08);
      position: relative;
    }

    .desktop-profile-back {
      align-items: center;
      background: #ffffff;
      border: 1px solid var(--border, #e8e0d8);
      border-radius: 999px;
      color: var(--text-primary, #2c1810);
      display: inline-flex;
      font-size: 14px;
      font-weight: 800;
      gap: 8px;
      height: 40px;
      left: 22px;
      min-height: 40px;
      padding: 0 15px;
      position: absolute;
      top: 22px;
      z-index: 32;
      box-shadow: 0 10px 24px rgba(44, 24, 16, 0.08);
    }

    .desktop-profile-back svg {
      font-size: 16px;
    }

    .mobile-profile-bar {
      display: none;
    }

    .profile-head {
      align-items: center;
      background:
        linear-gradient(180deg, rgba(255, 248, 240, 0.94), rgba(255, 250, 244, 1)),
        #fffaf4;
      display: grid;
      gap: 46px;
      grid-template-columns: 190px minmax(0, 660px);
      justify-content: center;
      padding: 48px 34px 28px;
    }

    .profile-avatar-ring {
      height: 148px;
      justify-self: center;
      padding: 5px;
      width: 148px;
    }

    .profile-avatar {
      border-width: 6px;
      height: 138px;
      width: 138px;
    }

    .mobile-stats,
    .profile-actions {
      display: none;
    }

    .desktop-handle {
      align-items: center;
      display: flex;
      gap: 10px;
      min-width: 0;
    }

    .desktop-handle h1 {
      color: var(--text-primary, #2c1810);
      font-size: 30px;
      font-weight: 900;
      line-height: 1.1;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .desktop-handle svg {
      font-size: 22px;
    }

    .desktop-profile-actions {
      display: flex;
      gap: 8px;
      margin-left: 8px;
    }

    .desktop-profile-actions .profile-action {
      border-radius: 10px;
      height: 40px;
      min-height: 40px;
      min-width: 122px;
      padding: 0 16px;
    }

    .desktop-profile-actions .profile-action.icon-only {
      min-width: 44px;
      width: 44px;
    }

    .desktop-stat-row {
      display: flex;
      gap: 32px;
      margin: 22px 0 22px;
    }

    .desktop-stat-row .stat {
      display: inline-flex;
      gap: 6px;
      text-align: left;
      white-space: nowrap;
    }

    .desktop-stat-row .stat strong,
    .desktop-stat-row .stat span {
      display: inline;
      font-size: 16px;
      line-height: 1.2;
      margin: 0;
    }

    .desktop-stat-row .stat span {
      color: var(--text-primary, #2c1810);
      font-weight: 600;
    }

    .profile-copy {
      grid-column: auto;
      min-width: 0;
    }

    .profile-name-row {
      align-items: center;
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
    }

    .profile-name {
      font-size: 16px;
      margin: 0;
    }

    .profile-name-row svg {
      font-size: 16px;
    }

    .profile-role {
      font-size: 15px;
      margin-bottom: 5px;
    }

    .profile-bio {
      font-size: 15px;
      line-height: 1.38;
      margin-bottom: 8px;
      max-width: 620px;
    }

    .profile-link-row,
    .followed-by {
      font-size: 14px;
    }

    .story-strip {
      border-top: 1px solid rgba(232, 224, 216, 0.7);
      gap: 24px;
      justify-content: center;
      padding: 32px 38px 28px;
    }

    .story-item {
      flex-basis: 96px;
      gap: 9px;
    }

    .story-ring {
      height: 84px;
      padding: 4px;
      width: 84px;
    }

    .story-ring img {
      border-width: 4px;
      height: 76px;
      width: 76px;
    }

    .story-item span {
      font-size: 13px;
      max-width: 96px;
    }

    .profile-tabs {
      background: #fffaf4;
      display: flex;
      justify-content: center;
      position: sticky;
      top: 0;
    }

    .profile-tab {
      height: 62px;
      min-height: 62px;
      width: 170px;
    }

    .profile-tab svg {
      font-size: 28px;
    }

    .profile-tab.active::after {
      left: 42px;
      right: 42px;
    }

    .profile-media-grid {
      gap: 4px;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      padding: 4px;
    }

    .media-card {
      aspect-ratio: 1 / 1;
    }

    .media-card:hover img {
      filter: brightness(0.78) saturate(1.04);
      transform: scale(1.035);
    }

    .media-overlay {
      padding: 12px;
    }

    .media-metric,
    .media-like {
      font-size: 15px;
    }

    .media-metric svg,
    .media-like svg {
      font-size: 20px;
    }
  }

  @media (max-width: 768px) {
    .profile-screen {
      max-width: 390px;
      width: min(100vw, 390px);
    }

    .mobile-profile-bar,
    .profile-shell {
      max-width: 390px;
      width: 100%;
    }
  }

  @media (min-width: 1280px) {
    .profile-media-grid {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }

  @media (max-width: 380px) {
    .sant-item {
      gap: 9px;
      grid-template-columns: 62px minmax(0, 1fr) auto;
      padding-right: 8px;
    }

    .avatar-ring {
      height: 60px;
      width: 60px;
    }

    .sant-avatar {
      height: 56px;
      width: 56px;
    }

    .follow-btn {
      min-width: 72px;
      padding: 0 9px;
    }

    .profile-head {
      gap: 12px;
      grid-template-columns: 82px minmax(0, 1fr);
      padding-left: 12px;
      padding-right: 12px;
    }

    .profile-avatar-ring {
      height: 80px;
      width: 80px;
    }

    .profile-avatar {
      height: 74px;
      width: 74px;
    }

    .stat strong {
      font-size: 18px;
    }

    .stat span,
    .profile-action {
      font-size: 12px;
    }

    .profile-actions {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 42px;
      padding-left: 12px;
      padding-right: 12px;
    }

    .profile-action {
      padding: 0 7px;
    }
  }
`;

const highlightPool = [
  { label: "Darshan", image: "/images/card_tirupati.jpg" },
  { label: "Aarti", image: "/images/bhasma_aarti.jpg" },
  { label: "Katha", image: "/images/ayodhya.jpg" },
  { label: "Seva", image: "/images/goldentemple_langar.jpg" },
  { label: "Yatra", image: "/images/kedarnath_trek.jpg" },
  { label: "Bhajan", image: "/images/vrindavan.jpg" },
  { label: "Mandir", image: "/images/kashi_vishwanath.jpg" },
  { label: "Utsav", image: "/images/puri.jpg" },
  { label: "Prasad", image: "/images/guruvayur_temple.jpg" },
];

const mediaPool = [
  {
    title: "Morning darshan",
    image: "/images/card_tirupati.jpg",
    type: "video",
    views: "23.4K",
    likes: 23400,
    comments: 248,
  },
  {
    title: "Temple seva",
    image: "/images/goldentemple_langar.jpg",
    type: "video",
    views: "144K",
    likes: 144000,
    comments: 712,
  },
  {
    title: "Yatra blessings",
    image: "/images/card_ayodhya.jpg",
    type: "video",
    views: "79.2K",
    likes: 79200,
    comments: 416,
  },
  {
    title: "Sacred route",
    image: "/images/kedarnath.jpg",
    type: "photo",
    views: "12.1K",
    likes: 12100,
    comments: 96,
  },
  {
    title: "Aarti moment",
    image: "/images/bhasma_aarti.jpg",
    type: "video",
    views: "86K",
    likes: 86000,
    comments: 504,
  },
  {
    title: "Bhakti path",
    image: "/images/vrindavan.jpg",
    type: "photo",
    views: "18.7K",
    likes: 18700,
    comments: 138,
  },
  {
    title: "Mandir darshan",
    image: "/images/kashi_hero.jpg",
    type: "video",
    views: "51K",
    likes: 51000,
    comments: 328,
  },
  {
    title: "Festival seva",
    image: "/images/puri_hero.jpg",
    type: "photo",
    views: "31.6K",
    likes: 31600,
    comments: 205,
  },
  {
    title: "Pilgrim story",
    image: "/images/card_chardham.jpg",
    type: "video",
    views: "64.8K",
    likes: 64800,
    comments: 388,
  },
  {
    title: "Satsang notes",
    image: "/images/har_ki_pauri.jpg",
    type: "photo",
    views: "17K",
    likes: 17000,
    comments: 82,
  },
  {
    title: "Daily pravachan",
    image: "/images/meenakshi_temple.jpg",
    type: "video",
    views: "92.3K",
    likes: 92300,
    comments: 611,
  },
  {
    title: "Evening bells",
    image: "/images/rameswaram_corridor.jpg",
    type: "video",
    views: "37.5K",
    likes: 37500,
    comments: 179,
  },
];

const tabs = [
  { id: "all", label: "Posts", icon: GridOnRoundedIcon },
  { id: "videos", label: "Videos", icon: PlayCircleRoundedIcon },
  { id: "photos", label: "Photos", icon: PhotoCameraRoundedIcon },
];

const rotate = (items, offset) => {
  if (!items.length) return [];
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
};

const parseCompactCount = (value) => {
  const text = String(value || "0").replace(/,/g, "").trim().toUpperCase();
  const numeric = parseFloat(text);
  if (Number.isNaN(numeric)) return 0;
  if (text.endsWith("M")) return Math.round(numeric * 1000000);
  if (text.endsWith("K")) return Math.round(numeric * 1000);
  return Math.round(numeric);
};

const formatCompactCount = (value) => {
  const number = Math.max(0, Number(value) || 0);
  if (number >= 1000000) {
    const compact = number / 1000000;
    return `${compact >= 10 ? compact.toFixed(1) : compact.toFixed(2)}`.replace(/\.0+$|(\.\d)0$/, "$1") + "M";
  }
  if (number >= 1000) {
    const compact = number / 1000;
    return `${compact >= 10 ? compact.toFixed(1) : compact.toFixed(2)}`.replace(/\.0+$|(\.\d)0$/, "$1") + "K";
  }
  return String(number);
};

const makeProfileContent = (profile, index) => {
  if (!profile) {
    return { highlights: [], media: [], bio: "" };
  }

  const offset = index < 0 ? 0 : index;
  const highlights = rotate(highlightPool, offset).slice(0, 7);
  const media = rotate(mediaPool, offset * 2).map((item, itemIndex) => ({
    ...item,
    id: `${profile.handle}-${itemIndex}-${item.type}`,
    title: `${profile.title}: ${item.title}`,
    likes: item.likes + offset * 531 + itemIndex * 97,
    comments: item.comments + offset * 11 + itemIndex * 3,
  }));

  return {
    highlights,
    media,
    bio: `${profile.role} sharing live satsang, yatra guidance, darshan moments and devotional updates with the Make My Darshan community.`,
  };
};

export const DevoteeProfilesPage = () => {
  const navigate = useNavigate();
  const { handle } = useParams();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [likedMedia, setLikedMedia] = useState({});
  const [mediaMetrics, setMediaMetrics] = useState({});
  const [messageState, setMessageState] = useState({});
  const [followState, setFollowState] = useState(() => {
    return devoteeProfiles.reduce((state, profile) => {
      state[profile.handle] = profile.followingUser;
      return state;
    }, {});
  });

  const activeProfile = useMemo(() => {
    if (!handle) return null;
    return devoteeProfiles.find((profile) => profile.handle === handle) || null;
  }, [handle]);

  const activeProfileIndex = useMemo(() => {
    if (!activeProfile) return -1;
    return devoteeProfiles.findIndex((profile) => profile.handle === activeProfile.handle);
  }, [activeProfile]);

  const activeContent = useMemo(() => {
    return makeProfileContent(activeProfile, activeProfileIndex);
  }, [activeProfile, activeProfileIndex]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return devoteeProfiles;
    }

    return devoteeProfiles.filter((profile) => {
      return (
        profile.name.toLowerCase().includes(q) ||
        profile.handle.toLowerCase().includes(q) ||
        profile.role.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const visibleMedia = useMemo(() => {
    if (activeTab === "videos") {
      return activeContent.media.filter((item) => item.type === "video");
    }

    if (activeTab === "photos") {
      return activeContent.media.filter((item) => item.type === "photo");
    }

    return activeContent.media;
  }, [activeContent.media, activeTab]);

  const toggleFollow = (profileHandle) => {
    setFollowState((prev) => ({ ...prev, [profileHandle]: !prev[profileHandle] }));
  };

  const toggleMediaLike = (item) => {
    setLikedMedia((prevLiked) => {
      const nextLiked = !prevLiked[item.id];

      setMediaMetrics((prevMetrics) => {
        const current = prevMetrics[item.id] || {
          likes: item.likes,
          comments: item.comments,
        };

        return {
          ...prevMetrics,
          [item.id]: {
            ...current,
            likes: Math.max(0, current.likes + (nextLiked ? 1 : -1)),
          },
        };
      });

      return { ...prevLiked, [item.id]: nextLiked };
    });
  };

  const handleMessage = (profileHandle) => {
    setMessageState((prev) => ({ ...prev, [profileHandle]: true }));
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  if (activeProfile) {
    const isFollowing = Boolean(followState[activeProfile.handle]);
    const followerBase = parseCompactCount(activeProfile.followers);
    const followerDelta = isFollowing === activeProfile.followingUser ? 0 : isFollowing ? 1 : -1;
    const followerDisplay = formatCompactCount(followerBase + followerDelta);
    const messageSent = Boolean(messageState[activeProfile.handle]);

    return (
      <Page>
        <main className="profile-screen">
          <button
            className="desktop-profile-back"
            onClick={() => navigate("/devotee-profiles")}
            type="button"
            aria-label="Back to devotees"
          >
            <ArrowBackIosNewRoundedIcon />
            Back
          </button>
          <div className="mobile-profile-bar">
            <button
              className="mobile-profile-back"
              onClick={() => navigate("/devotee-profiles")}
              type="button"
              aria-label="Back to devotees"
            >
              <ArrowBackIosNewRoundedIcon />
            </button>
            <div className="mobile-profile-title">
              <span>{activeProfile.handle}</span>
              {activeProfile.verified && <VerifiedIcon />}
            </div>
            <button className="icon-btn" type="button" aria-label="More profile options">
              <MoreHorizRoundedIcon />
            </button>
          </div>

          <div className="profile-shell">
            <section className="profile-head" aria-label={`${activeProfile.name} profile`}>
              <span className="profile-avatar-ring">
                <img
                  className="profile-avatar"
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  onError={(event) => {
                    event.currentTarget.src = "/Brand_Logo.jpg";
                  }}
                />
              </span>

              <div className="mobile-stats" aria-label="Profile stats">
                <span className="stat">
                  <strong>{activeProfile.posts}</strong>
                  <span>posts</span>
                </span>
                <span className="stat">
                  <strong>{followerDisplay}</strong>
                  <span>followers</span>
                </span>
                <span className="stat">
                  <strong>{activeProfile.following}</strong>
                  <span>following</span>
                </span>
              </div>

              <div className="profile-copy">
                <div className="desktop-handle">
                  <h1>{activeProfile.handle}</h1>
                  {activeProfile.verified && <VerifiedIcon />}
                  <div className="desktop-profile-actions">
                    <button
                      className={`profile-action primary ${isFollowing ? "following" : ""}`}
                      onClick={() => toggleFollow(activeProfile.handle)}
                      type="button"
                    >
                      {isFollowing ? "Following" : "Follow"}
                      {isFollowing && <ExpandMoreRoundedIcon />}
                    </button>
                    <button
                      className="profile-action"
                      onClick={() => handleMessage(activeProfile.handle)}
                      type="button"
                    >
                      {messageSent ? "Sent" : "Message"}
                    </button>
                    <button className="profile-action icon-only" type="button" aria-label="More profile options">
                      <MoreHorizRoundedIcon />
                    </button>
                  </div>
                </div>

                <div className="desktop-stat-row" aria-label="Profile stats">
                  <span className="stat">
                    <strong>{activeProfile.posts}</strong>
                    <span>posts</span>
                  </span>
                  <span className="stat">
                    <strong>{followerDisplay}</strong>
                    <span>followers</span>
                  </span>
                  <span className="stat">
                    <strong>{activeProfile.following}</strong>
                    <span>following</span>
                  </span>
                </div>

                <div className="profile-name-row">
                  <h2 className="profile-name">{activeProfile.name}</h2>
                  {activeProfile.verified && <VerifiedIcon />}
                </div>
                <div className="profile-role">{activeProfile.role}</div>
                <p className="profile-bio">{activeContent.bio}</p>
                <div className="profile-link-row">
                  <LinkRoundedIcon />
                  <span>makemydarshan.in/{activeProfile.handle}</span>
                </div>
                <div className="profile-link-row">
                  <AlternateEmailRoundedIcon />
                  <span>{activeProfile.handle}</span>
                </div>
                <div className="followed-by">
                  <img src="/Brand_Logo.jpg" alt="" />
                  <span>{isFollowing ? "You follow this devotee profile" : activeProfile.meta}</span>
                </div>
              </div>
            </section>

            <div className="profile-actions">
              <button
                className={`profile-action primary ${isFollowing ? "following" : ""}`}
                onClick={() => toggleFollow(activeProfile.handle)}
                type="button"
              >
                {isFollowing ? "Following" : "Follow"}
                {isFollowing && <ExpandMoreRoundedIcon />}
              </button>
              <button
                className="profile-action"
                onClick={() => handleMessage(activeProfile.handle)}
                type="button"
              >
                {messageSent ? "Sent" : "Message"}
              </button>
              <button className="profile-action" type="button" aria-label="Invite devotee">
                <PersonAddAlt1RoundedIcon />
              </button>
            </div>

            <div className="story-strip" aria-label="Profile highlights">
              {activeContent.highlights.map((highlight) => (
                <button className="story-item" type="button" key={`${activeProfile.handle}-${highlight.label}`}>
                  <span className="story-ring">
                    <img
                      src={highlight.image}
                      alt={highlight.label}
                      onError={(event) => {
                        event.currentTarget.src = "/Brand_Logo.jpg";
                      }}
                    />
                  </span>
                  <span>{highlight.label}</span>
                </button>
              ))}
            </div>

            <div className="profile-tabs" role="tablist" aria-label="Profile media tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    title={tab.label}
                    type="button"
                  >
                    <Icon />
                  </button>
                );
              })}
            </div>

            <section className="profile-media-grid" aria-label={`${activeProfile.name} media`}>
              {visibleMedia.map((item) => {
                const metrics = mediaMetrics[item.id] || {
                  likes: item.likes,
                  comments: item.comments,
                };
                const isLiked = Boolean(likedMedia[item.id]);

                return (
                  <article className="media-card" key={item.id}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = "/Brand_Logo.jpg";
                      }}
                    />
                    <span className="media-type" aria-label={item.type}>
                      {item.type === "video" ? <PlayCircleRoundedIcon /> : <PhotoCameraRoundedIcon />}
                    </span>
                    <div className="media-overlay">
                      <button
                        className={`media-like ${isLiked ? "liked" : ""}`}
                        onClick={() => toggleMediaLike(item)}
                        type="button"
                        aria-label={isLiked ? "Unlike media" : "Like media"}
                      >
                        <FavoriteRoundedIcon />
                        {formatCompactCount(metrics.likes)}
                      </button>
                      <span className="media-metric">
                        {item.type === "video" ? <VisibilityRoundedIcon /> : <ChatBubbleRoundedIcon />}
                        {item.type === "video" ? item.views : formatCompactCount(metrics.comments)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </main>
      </Page>
    );
  }

  return (
    <Page>
      <div className="directory-screen">
        <div className="directory-top">
          <div className="page-header">
            <button className="back-btn" onClick={goBack} type="button" aria-label="Go back">
              <ArrowBackIosNewRoundedIcon />
            </button>
            <span className="page-title">Devotees</span>
            <button
              className="clear-btn"
              onClick={() => setSearch("")}
              type="button"
              aria-label="Clear search"
              style={{ visibility: search ? "visible" : "hidden" }}
            >
              <CloseRoundedIcon />
            </button>
          </div>

          <button
            className="desktop-directory-back"
            onClick={goBack}
            type="button"
            aria-label="Back"
          >
            <ArrowBackIosNewRoundedIcon />
            Back
          </button>

          <div className="search-wrap">
            <label className="search-box">
              <SearchRoundedIcon />
              <input
                type="search"
                placeholder="Search Sants..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="result-row">
          <strong>All Verified</strong>
          <span>{filtered.length} Sants</span>
        </div>

        <div className="sant-list">
          {filtered.map((sant) => (
            <article className="sant-item" key={sant.handle}>
              <Link to={`/devotee-profiles/${sant.handle}`} className="sant-link">
                <span className="avatar-ring">
                  <img
                    className="sant-avatar"
                    src={sant.avatar}
                    alt={sant.name}
                    onError={(event) => {
                      event.currentTarget.src = "/Brand_Logo.jpg";
                    }}
                  />
                </span>

                <div className="sant-info">
                  <div className="sant-name-row">
                    <span className="sant-handle mobile-label">{sant.handle}</span>
                    <span className="sant-handle desktop-label">{sant.name}</span>
                    {sant.verified && <VerifiedIcon />}
                  </div>
                  <div className="sant-title mobile-label">{sant.title}</div>
                  <div className="sant-title desktop-label">
                    @{sant.handle} / {sant.followers} followers
                  </div>
                  <div className="sant-meta mobile-label">{sant.meta}</div>
                  <div className="sant-meta desktop-label">{sant.role}</div>
                </div>
              </Link>

              <button
                className={`follow-btn ${followState[sant.handle] ? "following" : ""}`}
                onClick={() => toggleFollow(sant.handle)}
                type="button"
              >
                {followState[sant.handle] ? "Following" : "Follow"}
              </button>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">No devotee profiles found.</div>
        )}
      </div>

      <MobileBottomNav activeOverride="Devotee Profiles" withSpacer={false} />
    </Page>
  );
};
