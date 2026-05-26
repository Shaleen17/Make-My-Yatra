import { Link } from "react-router-dom";
import styled from "styled-components";
import { sacredYatras } from "./yatraData";

const Section = styled.section`
  padding: 60px 0 40px;
  background: var(--bg-main, #faf7f2);

  .section-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 0 20px;
  }

  .section-header h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #2c1810;
    margin: 0 0 8px;
  }

  .section-header .divider {
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    border-radius: 10px;
    margin: 0 auto 12px;
  }

  .section-header p {
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    color: #6b5b4f;
    max-width: 620px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
    padding: 0 5%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .yatra-card {
    position: relative;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(44, 24, 16, 0.08);
    cursor: pointer;
    transition: all 0.34s cubic-bezier(0.22, 1, 0.36, 1);
    border: 1px solid #f0ebe5;
  }

  .yatra-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(44, 24, 16, 0.15);
  }

  .yatra-card:hover .card-image img {
    transform: scale(1.08);
  }

  .card-image {
    position: relative;
    height: 180px;
    overflow: hidden;
    background: #eadccf;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(transparent, rgba(26, 15, 8, 0.7));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .yatra-card:hover .card-overlay {
    opacity: 1;
  }

  .card-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(8px);
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    color: #c0392b;
    font-family: 'Outfit', sans-serif;
  }

  .card-body {
    padding: 16px;
  }

  .card-body h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 17px;
    font-weight: 800;
    color: #2c1810;
    margin: 0 0 6px;
    line-height: 1.25;
  }

  .card-body p {
    font-size: 13px;
    color: #6b5b4f;
    line-height: 1.5;
    margin: 0 0 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .explore-btn {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 800;
    color: #c0392b;
  }

  .tag {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #f5f0e8;
    color: #6b5b4f;
    font-weight: 700;
  }

  .view-all-wrap {
    text-align: center;
    margin-top: 36px;
    padding-bottom: 10px;
  }

  .view-all-wrap a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 14px 40px;
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 800;
    border-radius: 999px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(192, 57, 43, 0.3);
  }

  .view-all-wrap a:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(192, 57, 43, 0.4);
  }

  @media (max-width: 768px) {
    padding: 40px 0 24px;

    .section-header h2 {
      font-size: 24px;
    }

    .section-header p {
      font-size: 13px;
      padding: 0 4px;
    }

    .cards-grid {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      gap: 12px;
      padding: 0 16px 8px;
    }

    .cards-grid::-webkit-scrollbar {
      display: none;
    }

    .yatra-card {
      flex: 0 0 min(72vw, 260px);
      scroll-snap-align: center;
    }

    .cards-grid > a {
      flex: 0 0 min(72vw, 260px);
      scroll-snap-align: center;
    }

    .card-image {
      height: 140px;
    }

    .card-body {
      padding: 12px;
    }

    .card-body h3 {
      font-size: 14px;
    }

    .card-body p {
      font-size: 11px;
      -webkit-line-clamp: 2;
    }

    .view-all-wrap {
      margin-top: 24px;
    }

    .view-all-wrap a {
      font-size: 14px;
      padding: 12px 32px;
    }
  }
`;

const featuredYatras = sacredYatras
  .filter((yatra) => yatra.category !== "Companion")
  .slice(0, 6);

export const TirthYatraCards = () => {
  return (
    <Section id="tirth-yatras-section">
      <div className="section-header">
        <div className="divider"></div>
        <h2>Sacred Tirth Yatras</h2>
        <p>
          Discover the timeless stories and spiritual vibrations of India's most
          sacred Tirthas, shaped around the Puranic memory of each place.
        </p>
      </div>
      <div className="cards-grid stagger-children">
        {featuredYatras.map((yatra) => (
          <Link
            to={`/yatra/${yatra.slug}`}
            key={yatra.slug}
            style={{ textDecoration: "none" }}
          >
            <article className="yatra-card animate-slide-up">
              <div className="card-image">
                <img
                  src={`/images/${yatra.image}`}
                  alt={yatra.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/Brand_Logo.jpg";
                  }}
                />
                <div className="card-overlay"></div>
                <div className="card-badge">{yatra.tag}</div>
              </div>
              <div className="card-body">
                <h3>{yatra.name}</h3>
                <p>{yatra.summary}</p>
                <div className="card-footer">
                  <div className="explore-btn">Explore</div>
                  <span className="tag">{yatra.category}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      <div className="view-all-wrap">
        <Link to="/tirth-yatras">View All Yatras</Link>
      </div>
    </Section>
  );
};
