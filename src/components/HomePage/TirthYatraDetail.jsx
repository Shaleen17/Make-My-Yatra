import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./Header";
import { getYatraBySlug } from "./yatraData";

const DetailPage = styled.div`
  min-height: 100vh;
  background: #faf7f2;
  color: #2c1810;
  font-family: 'Outfit', sans-serif;

  .hero {
    position: relative;
    min-height: 460px;
    overflow: hidden;
    background: #2c1810;
  }

  .hero img {
    width: 100%;
    height: 100%;
    min-height: 460px;
    object-fit: cover;
    opacity: 0.74;
    transform: scale(1.01);
  }

  .hero::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(31, 17, 10, 0.72), rgba(31, 17, 10, 0.18)),
      linear-gradient(0deg, rgba(31, 17, 10, 0.82), transparent 58%);
  }

  .back-btn {
    position: absolute;
    top: 86px;
    left: 5%;
    z-index: 2;
    border: 1px solid rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.9);
    color: #2c1810;
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: #ffffff;
    transform: translateY(-1px);
  }

  .hero-content {
    position: absolute;
    z-index: 1;
    left: 5%;
    right: 5%;
    bottom: 48px;
    max-width: 880px;
  }

  .tag-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .tag,
  .region-pill {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  .tag {
    background: #fff6e6;
    color: #9d351d;
  }

  .region-pill {
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.32);
    color: #fffaf2;
    backdrop-filter: blur(8px);
  }

  .hero h1 {
    color: #ffffff;
    font-size: 46px;
    line-height: 1.1;
    font-weight: 800;
    margin: 0 0 14px;
    letter-spacing: 0;
    text-shadow: 0 2px 18px rgba(0, 0, 0, 0.34);
  }

  .hero p {
    max-width: 760px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 17px;
    line-height: 1.7;
    margin: 0;
  }

  .content-shell {
    width: min(1180px, 90%);
    margin: 0 auto;
    padding: 44px 0 72px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 34px;
    align-items: start;
  }

  .lead-panel,
  .story-section,
  .experiences-section,
  .map-section,
  .cta-section,
  .fact-card {
    background: #ffffff;
    border: 1px solid #f0e7dc;
    box-shadow: 0 10px 32px rgba(44, 24, 16, 0.07);
  }

  .lead-panel {
    border-radius: 18px;
    padding: 30px;
  }

  .lead-panel h2,
  .story-section h2,
  .experiences-section h2,
  .map-section h2,
  .cta-section h2 {
    margin: 0;
    color: #2c1810;
    font-size: 24px;
    line-height: 1.25;
    font-weight: 800;
  }

  .lead-panel p,
  .story-section p,
  .experience-card p,
  .cta-section p {
    color: #6b5b4f;
    font-size: 15px;
    line-height: 1.85;
  }

  .lead-panel p {
    margin: 14px 0 0;
    font-size: 16px;
  }

  .story-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 16px;
    margin-top: 24px;
    border: 1px solid #efe4d8;
  }

  .story-section,
  .experiences-section,
  .map-section,
  .cta-section {
    border-radius: 18px;
    padding: 28px;
    margin-top: 24px;
  }

  .story-section {
    border-left: 5px solid #c0392b;
  }

  .story-section h2 {
    margin-bottom: 12px;
  }

  .story-section p {
    margin: 0 0 12px;
  }

  .story-section p:last-child {
    margin-bottom: 0;
  }

  .experience-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 18px;
  }

  .experience-card {
    min-height: 210px;
    border: 1px solid #f0e7dc;
    border-radius: 14px;
    padding: 18px;
    background: linear-gradient(180deg, #fffdf9 0%, #ffffff 100%);
  }

  .experience-card .number {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff0df;
    color: #c0392b;
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 14px;
  }

  .experience-card h3 {
    font-size: 17px;
    line-height: 1.35;
    margin: 0 0 8px;
    color: #2c1810;
  }

  .experience-card p {
    margin: 0;
    font-size: 14px;
  }

  .map-section {
    padding: 0;
    overflow: hidden;
  }

  .map-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding: 26px 28px 20px;
  }

  .map-header p {
    margin: 8px 0 0;
    color: #7d6d60;
    font-size: 14px;
    line-height: 1.6;
  }

  .open-map {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 10px 18px;
    border-radius: 999px;
    background: #2c1810;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
  }

  .map-frame-wrap {
    height: 340px;
    border-top: 1px solid #f0e7dc;
    border-bottom: 1px solid #f0e7dc;
    background: #f6efe7;
  }

  .map-frame-wrap iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }

  .map-points {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 18px 28px 24px;
  }

  .map-point {
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid #eadccf;
    background: #fffaf4;
    color: #6b3b25;
    font-size: 12px;
    font-weight: 800;
  }

  .sidebar {
    position: sticky;
    top: 96px;
  }

  .fact-card {
    border-radius: 18px;
    padding: 22px;
  }

  .fact-card h3 {
    font-size: 18px;
    margin: 0 0 16px;
    color: #2c1810;
  }

  .fact-list {
    display: grid;
    gap: 14px;
  }

  .fact-item {
    padding-top: 14px;
    border-top: 1px solid #f0e7dc;
  }

  .fact-item:first-child {
    padding-top: 0;
    border-top: 0;
  }

  .fact-item span {
    display: block;
    color: #9e8e82;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }

  .fact-item strong {
    color: #2c1810;
    font-size: 15px;
    line-height: 1.45;
  }

  .cta-section {
    text-align: center;
    background: linear-gradient(135deg, #fff8ee, #ffffff);
  }

  .cta-section p {
    margin: 10px auto 22px;
    max-width: 540px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    padding: 12px 34px;
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    color: #ffffff;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 800;
    text-decoration: none;
    box-shadow: 0 8px 22px rgba(192, 57, 43, 0.25);
  }

  .not-found {
    padding: 140px 5% 80px;
    text-align: center;
  }

  @media (max-width: 980px) {
    .content-shell {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
    }
  }

  @media (max-width: 720px) {
    .hero,
    .hero img {
      min-height: 360px;
    }

    .hero h1 {
      font-size: 32px;
    }

    .hero p {
      font-size: 14px;
    }

    .hero-content {
      bottom: 32px;
    }

    .content-shell {
      width: calc(100% - 32px);
      padding: 28px 0 44px;
    }

    .lead-panel,
    .story-section,
    .experiences-section,
    .cta-section,
    .fact-card {
      padding: 20px;
      border-radius: 14px;
    }

    .experience-grid {
      grid-template-columns: 1fr;
    }

    .story-image {
      height: 210px;
    }

    .map-header {
      flex-direction: column;
      padding: 22px 20px 16px;
    }

    .map-frame-wrap {
      height: 300px;
    }

    .map-points {
      padding: 16px 20px 20px;
    }
  }
`;

const getMapBounds = (points) => {
  const latitudes = points.map((point) => point.lat);
  const longitudes = points.map((point) => point.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latPad = Math.max((maxLat - minLat) * 0.28, 0.03);
  const lngPad = Math.max((maxLng - minLng) * 0.28, 0.03);

  return [
    minLng - lngPad,
    minLat - latPad,
    maxLng + lngPad,
    maxLat + latPad,
  ].join(",");
};

const getMapEmbedUrl = (map) => {
  const primaryPoint = map.points[0];
  const marker = `${primaryPoint.lat},${primaryPoint.lng}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${getMapBounds(
    map.points
  )}&layer=mapnik&marker=${marker}`;
};

const getMapLink = (point) =>
  `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;

const getParagraphs = (section) => {
  if (Array.isArray(section.paragraphs)) {
    return section.paragraphs;
  }

  return String(section.body || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export const TirthYatraDetail = () => {
  const { slug } = useParams();
  const yatra = getYatraBySlug(slug);

  if (!yatra) {
    return (
      <DetailPage>
        <Header />
        <div className="not-found">
          <h2>Yatra not found</h2>
          <Link to="/tirth-yatras" className="cta-btn">
            Back to Sacred Tirth Yatras
          </Link>
        </div>
      </DetailPage>
    );
  }

  const primaryPoint = yatra.map.points[0];

  return (
    <DetailPage>
      <Header />
      <section className="hero">
        <Link to="/tirth-yatras">
          <button className="back-btn">Back</button>
        </Link>
        <img
          src={`/images/${yatra.image}`}
          alt={yatra.title}
          onError={(event) => {
            event.currentTarget.src = "/Brand_Logo.jpg";
          }}
        />
        <div className="hero-content">
          <div className="tag-row">
            <span className="tag">{yatra.tag}</span>
            <span className="region-pill">{yatra.region}</span>
          </div>
          <h1>{yatra.title}</h1>
          <p>{yatra.summary}</p>
        </div>
      </section>

      <div className="content-shell">
        <main>
          <section className="lead-panel">
            <h2>{yatra.leadTitle || "Sacred Significance"}</h2>
            <p>{yatra.intro}</p>
            {yatra.contentImage && (
              <img
                className="story-image"
                src={`/images/${yatra.contentImage}`}
                alt={`${yatra.name} pilgrimage`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </section>

          {yatra.sections.map((section) => (
            <section className="story-section" key={section.title}>
              <h2>{section.title}</h2>
              {getParagraphs(section).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section className="experiences-section">
            <h2>{yatra.experiencesTitle || "Key Spiritual Experiences"}</h2>
            <div className="experience-grid">
              {yatra.experiences.map((experience, index) => (
                <article className="experience-card" key={experience.title}>
                  <span className="number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{experience.title}</h3>
                  <p>{experience.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="map-section">
            <div className="map-header">
              <div>
                <h2>Location Map</h2>
                <p>
                  {yatra.mapDescription ||
                    `Explore the main sacred points connected with ${yatra.name}.`}
                </p>
              </div>
              <a
                className="open-map"
                href={getMapLink(primaryPoint)}
                target="_blank"
                rel="noreferrer"
              >
                Open Map
              </a>
            </div>
            <div className="map-frame-wrap">
              <iframe
                title={`${yatra.name} location map`}
                src={getMapEmbedUrl(yatra.map)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="map-points">
              {yatra.map.points.map((point) => (
                <span className="map-point" key={`${point.label}-${point.lat}`}>
                  {point.label}
                </span>
              ))}
            </div>
          </section>

          <section className="cta-section">
            <h2>{yatra.ctaTitle || "Begin Your Sacred Journey"}</h2>
            <p>
              {yatra.ctaText ||
                `Plan a thoughtful yatra to ${yatra.name} with space for darshan, local traditions, and the sacred geography of the place.`}
            </p>
            <Link to="/search" className="cta-btn">
              {yatra.ctaLabel || "Plan This Yatra"}
            </Link>
          </section>
        </main>

        <aside className="sidebar">
          <div className="fact-card">
            <h3>More Information</h3>
            <div className="fact-list">
              <div className="fact-item">
                <span>State / Region</span>
                <strong>{yatra.region}</strong>
              </div>
              <div className="fact-item">
                <span>{yatra.infoLabel}</span>
                <strong>{yatra.infoValue}</strong>
              </div>
              <div className="fact-item">
                <span>Yatra Type</span>
                <strong>{yatra.tag}</strong>
              </div>
              <div className="fact-item">
                <span>Map Focus</span>
                <strong>{primaryPoint.label}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </DetailPage>
  );
};
