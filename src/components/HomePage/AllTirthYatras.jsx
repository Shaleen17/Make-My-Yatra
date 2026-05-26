import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../SearchPage/Header";
import { sacredYatras } from "./yatraData";

const Page = styled.div`
  min-height: 100vh;
  background: #faf7f2;

  .hero-banner {
    background: linear-gradient(135deg, #2c1810 0%, #5a2d1a 52%, #c0392b 100%);
    padding: 104px 5% 54px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero-banner::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 18% 20%, rgba(255, 202, 132, 0.16), transparent 32%),
      radial-gradient(circle at 78% 14%, rgba(255, 255, 255, 0.11), transparent 28%);
    pointer-events: none;
  }

  .hero-banner h1 {
    position: relative;
    font-family: 'Outfit', sans-serif;
    font-size: 38px;
    line-height: 1.15;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 10px;
  }

  .hero-banner .subtitle {
    position: relative;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.78);
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.7;
  }

  .filters-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 22px 5%;
    max-width: 1220px;
    margin: 0 auto;
    flex-wrap: wrap;
  }

  .search-input {
    flex: 1;
    min-width: 220px;
    min-height: 44px;
    padding: 10px 16px;
    border: 1.5px solid #e8e0d8;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    outline: none;
    background: #ffffff;
    color: #2c1810;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .search-input:focus {
    border-color: #c0392b;
    box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.08);
  }

  .filter-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-tabs button {
    min-height: 38px;
    padding: 8px 18px;
    border: 1.5px solid #e8e0d8;
    border-radius: 999px;
    background: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #6b5b4f;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-tabs button:hover,
  .filter-tabs button.active {
    border-color: #c0392b;
    color: #c0392b;
    background: rgba(192, 57, 43, 0.06);
  }

  .count-info {
    padding: 0 5%;
    max-width: 1220px;
    margin: 0 auto 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #8f7c6c;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 24px;
    padding: 0 5% 66px;
    max-width: 1220px;
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
    transform: scale(1.06);
  }

  .card-image {
    position: relative;
    height: 202px;
    overflow: hidden;
    background: #eadccf;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .card-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(8px);
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    color: #c0392b;
    font-family: 'Outfit', sans-serif;
  }

  .card-body {
    padding: 18px;
  }

  .card-body h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    line-height: 1.25;
    font-weight: 800;
    color: #2c1810;
    margin: 0 0 7px;
  }

  .card-body p {
    font-size: 13px;
    color: #6b5b4f;
    line-height: 1.55;
    margin: 0 0 15px;
    font-family: 'Outfit', sans-serif;
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
    flex: 0 0 auto;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #f5f0e8;
    color: #6b5b4f;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
  }

  @media (max-width: 768px) {
    .hero-banner {
      padding: 84px 5% 34px;
    }

    .hero-banner h1 {
      font-size: 28px;
    }

    .hero-banner .subtitle {
      font-size: 14px;
    }

    .filters-bar {
      padding: 18px 16px;
    }

    .cards-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      padding: 0 16px 44px;
    }

    .card-image {
      height: 138px;
    }

    .card-body {
      padding: 12px;
    }

    .card-body h3 {
      font-size: 14px;
    }

    .card-body p {
      font-size: 11px;
    }

    .card-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
    }
  }
`;

const categoryOrder = ["North", "South", "East", "West", "Companion"];
const categories = [
  "All",
  ...categoryOrder.filter((category) =>
    sacredYatras.some((yatra) => yatra.category === category)
  ),
];

const getCategoryLabel = (category) =>
  category === "Companion" ? category : `${category} India`;

export const AllTirthYatras = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sacredYatras.filter((yatra) => {
      const haystack = [
        yatra.name,
        yatra.title,
        yatra.summary,
        yatra.region,
        yatra.tag,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesCategory =
        activeCategory === "All" || yatra.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, search]);

  return (
    <Page>
      <Header />
      <div className="hero-banner">
        <h1>Sacred Tirth Yatras</h1>
        <p className="subtitle">
          Discover the timeless stories, sacred geography, and spiritual
          experiences of India's most revered pilgrimage destinations.
        </p>
      </div>

      <div className="filters-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search Tirth Yatras..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="filter-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="count-info">
        Showing {filtered.length} of {sacredYatras.length} Sacred Tirth Yatras
      </div>

      <div className="cards-grid">
        {filtered.map((yatra) => (
          <Link
            to={`/yatra/${yatra.slug}`}
            key={yatra.slug}
            style={{ textDecoration: "none" }}
          >
            <article className="yatra-card">
              <div className="card-image">
                <img
                  src={`/images/${yatra.image}`}
                  alt={yatra.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = "/Brand_Logo.jpg";
                  }}
                />
                <div className="card-badge">{yatra.tag}</div>
              </div>
              <div className="card-body">
                <h3>{yatra.name}</h3>
                <p>{yatra.summary}</p>
                <div className="card-footer">
                  <div className="explore-btn">Explore</div>
                  <span className="tag">{getCategoryLabel(yatra.category)}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </Page>
  );
};
