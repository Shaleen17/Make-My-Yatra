import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import VerifiedIcon from "@mui/icons-material/Verified";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import { devoteeProfiles } from "./socialData";

const Section = styled.section`
  padding: 30px 0 34px;
  background: #faf7f2;
  color: #2c1810;
  scroll-margin-top: 0;
  font-family: 'Outfit', sans-serif;

  @media (min-width: 769px) {
    display: none;
  }

  .section-shell {
    padding: 0 14px;
  }

  .section-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .title-block h2 {
    color: #2c1810;
    font-size: 23px;
    font-weight: 800;
    line-height: 1.08;
    margin: 0 0 4px;
  }

  .title-block p {
    color: #6b5b4f;
    font-size: 12px;
    line-height: 1.35;
    margin: 0;
  }

  .open-link {
    align-items: center;
    background: #fff8f0;
    border: 1px solid #e8e0d8;
    border-radius: 999px;
    color: #c0392b;
    display: inline-flex;
    flex: 0 0 auto;
    font-size: 12px;
    font-weight: 800;
    gap: 4px;
    min-height: 36px;
    padding: 0 12px;
    text-decoration: none;
  }

  .open-link svg {
    font-size: 13px;
  }

  .search-pill {
    align-items: center;
    background: #ffffff;
    border: 1px solid #eadfd6;
    box-shadow: 0 8px 24px rgba(44, 24, 16, 0.06);
    border-radius: 999px;
    color: #9e8e82;
    display: flex;
    font-size: 15px;
    font-weight: 500;
    gap: 10px;
    height: 48px;
    padding: 0 16px;
    margin-bottom: 12px;
  }

  .search-pill svg {
    color: #9e8e82;
    font-size: 22px;
  }

  .list-caption {
    color: #9e8e82;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .list-caption strong {
    color: #2c1810;
    font-size: 13px;
  }

  .profile-list {
    display: grid;
    gap: 2px;
  }

  .profile-row {
    align-items: center;
    display: flex;
    gap: 12px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(240, 235, 229, 0.9);
    border-radius: 16px;
    box-shadow: 0 8px 26px rgba(44, 24, 16, 0.05);
    min-height: 78px;
    padding: 8px 10px 8px 8px;
  }

  .row-main {
    align-items: center;
    color: inherit;
    display: flex;
    flex: 1;
    gap: 12px;
    min-width: 0;
    text-decoration: none;
  }

  .avatar-ring {
    align-items: center;
    background: conic-gradient(#c0392b, #ff6b35, #d4a847, #c0392b);
    border-radius: 50%;
    display: flex;
    flex: 0 0 auto;
    height: 64px;
    justify-content: center;
    padding: 2px;
    width: 64px;
  }

  .avatar {
    background: #fff8f0;
    border: 3px solid #ffffff;
    border-radius: 50%;
    height: 60px;
    object-fit: cover;
    width: 60px;
  }

  .profile-copy {
    flex: 1;
    min-width: 0;
  }

  .handle-row {
    align-items: center;
    display: flex;
    gap: 4px;
    min-width: 0;
  }

  .handle {
    color: #2c1810;
    font-size: 15px;
    font-weight: 800;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .handle-row svg {
    color: #1da1f2;
    flex: 0 0 auto;
    font-size: 16px;
  }

  .name {
    color: #6b5b4f;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.25;
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta {
    color: #9e8e82;
    font-size: 12px;
    line-height: 1.22;
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .follow-chip {
    align-items: center;
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    border: 0;
    border-radius: 9px;
    color: #ffffff;
    display: inline-flex;
    flex: 0 0 auto;
    font-size: 12px;
    font-weight: 800;
    gap: 4px;
    height: 34px;
    justify-content: center;
    min-width: 78px;
    padding: 0 10px;
  }

  .follow-chip svg {
    font-size: 15px;
  }

  .follow-chip.following {
    background: #ffffff;
    border: 1px solid #e8e0d8;
    color: #6b5b4f;
  }
`;

export const DevoteeProfiles = () => {
  const [followState, setFollowState] = useState(() => {
    return devoteeProfiles.reduce((state, profile) => {
      state[profile.handle] = profile.followingUser;
      return state;
    }, {});
  });

  const previewProfiles = devoteeProfiles.slice(0, 6);

  const toggleFollow = (handle) => {
    setFollowState((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };

  return (
    <Section id="devotee-profiles-section">
      <div className="section-shell">
        <div className="section-top">
          <div className="title-block">
            <h2>Devotee Profiles</h2>
            <p>Verified sants, acharyas, and bhakti guides.</p>
          </div>
          <Link to="/devotee-profiles" className="open-link">
            Open
            <ArrowForwardIosRoundedIcon />
          </Link>
        </div>

        <Link to="/devotee-profiles" className="search-pill" aria-label="Open devotee search">
          <SearchRoundedIcon />
          Search devotees
        </Link>

        <div className="list-caption">
          <strong>All Verified</strong>
          <span>{devoteeProfiles.length} Sants</span>
        </div>

        <div className="profile-list">
          {previewProfiles.map((profile) => (
            <article className="profile-row" key={profile.handle}>
              <Link to={`/devotee-profiles/${profile.handle}`} className="row-main">
                <span className="avatar-ring">
                  <img
                    className="avatar"
                    src={profile.avatar}
                    alt={profile.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = "/Brand_Logo.jpg";
                    }}
                  />
                </span>
                <span className="profile-copy">
                  <span className="handle-row">
                    <span className="handle">{profile.handle}</span>
                    {profile.verified && <VerifiedIcon />}
                  </span>
                  <span className="name">{profile.title}</span>
                  <span className="meta">{profile.meta}</span>
                </span>
              </Link>
              <button
                className={`follow-chip ${followState[profile.handle] ? "following" : ""}`}
                onClick={() => toggleFollow(profile.handle)}
                type="button"
              >
                {!followState[profile.handle] && <PersonAddAlt1RoundedIcon />}
                {followState[profile.handle] ? "Following" : "Follow"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
};
