import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Header } from "../SearchPage/Header";

const Page = styled.div`
  min-height: 100vh;
  background: #faf7f2;

  .hero-banner {
    background: linear-gradient(135deg, #1a0f08 0%, #2c1810 50%, #3a1a0d 100%);
    padding: 80px 5% 50px;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: url('/images/Dharmshala/gallery1.jpg') center/cover;
      opacity: 0.15;
    }

    > * { position: relative; z-index: 2; }

    h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .subtitle {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      color: rgba(245, 239, 232, 0.8);
      max-width: 600px;
      margin: 0 auto 20px;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 20px;

      .stat {
        text-align: center;
        .num {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #d4a847;
        }
        .label {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          color: rgba(245, 239, 232, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      }
    }
  }

  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 5%;
  }

  .search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    align-items: center;
    flex-wrap: wrap;

    input {
      flex: 1;
      min-width: 200px;
      padding: 12px 20px;
      border: 1.5px solid #e8e0d8;
      border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      background: white;

      &:focus { border-color: #c0392b; }
      &::placeholder { color: #bbb; }
    }
  }

  .filter-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .filter-tab {
    font-family: 'Outfit', sans-serif;
    padding: 8px 20px;
    border-radius: 25px;
    border: 1.5px solid #e8e0d8;
    background: white;
    color: #6b5b4f;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover { border-color: #c0392b; color: #c0392b; }
    &.active {
      background: linear-gradient(135deg, #ff6b35, #c0392b);
      color: white;
      border-color: transparent;
    }
  }

  .location-group {
    margin-bottom: 40px;

    .group-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0ebe5;

      h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 22px;
        font-weight: 700;
        color: #2c1810;
        margin: 0;
        text-transform: capitalize;
      }

      .count {
        font-family: 'Outfit', sans-serif;
        font-size: 12px;
        background: rgba(192, 57, 43, 0.08);
        color: #c0392b;
        padding: 3px 10px;
        border-radius: 20px;
        font-weight: 600;
      }
    }
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 18px;
  }

  .dharamshala-card {
    background: white;
    border: 1px solid #f0ebe5;
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer;
    text-decoration: none;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(44, 24, 16, 0.12);
    }
  }

  .card-img {
    height: 150px;
    overflow: hidden;
    position: relative;
    background: #f5f0e8;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .category-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(6px);
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      color: #c0392b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: 'Outfit', sans-serif;
    }
  }

  .dharamshala-card:hover .card-img img {
    transform: scale(1.06);
  }

  .card-info {
    padding: 12px 14px;

    h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #2c1810;
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .address {
      font-size: 11px;
      color: #9e8e82;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: 'Outfit', sans-serif;
    }

    .card-tags {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin-bottom: 8px;

      span {
        font-size: 10px;
        padding: 2px 7px;
        border-radius: 10px;
        background: #f5f0e8;
        color: #6b5b4f;
        font-weight: 500;
        font-family: 'Outfit', sans-serif;

        &.green { background: rgba(39,174,96,0.1); color: #27ae60; }
      }
    }

    .card-details {
      display: flex;
      gap: 10px;
      font-size: 10px;
      color: #9e8e82;
      font-family: 'Outfit', sans-serif;
    }
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #c0392b;
    text-decoration: none;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
    transition: gap 0.2s ease;

    &:hover { gap: 10px; }
  }

  .no-results {
    text-align: center;
    padding: 60px 20px;
    color: #9e8e82;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .hero-banner {
      padding: 70px 5% 30px;
      h1 { font-size: 26px; }
      .stats { gap: 20px; }
      .stats .stat .num { font-size: 22px; }
    }
    .cards-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .card-img { height: 110px; }
    .card-info { padding: 8px 10px; }
    .card-info h3 { font-size: 12px; }
    .filter-tab { padding: 6px 14px; font-size: 11px; }
  }
`;

const categoryLabels = {
  "iskcon": "ISKCON Guest Houses",
  "varanasi": "Varanasi (Kashi)",
  "kedarnath": "Kedarnath",
  "ayodhya": "Ayodhya",
  "vrindavan-mathura": "Vrindavan & Mathura",
  "jagannath-puri": "Jagannath Puri",
  "rameshwaram": "Rameshwaram",
};

const categories = ["All", "ISKCON", "Varanasi", "Kedarnath", "Ayodhya", "Vrindavan-Mathura", "Jagannath Puri", "Rameshwaram"];

export const AllDharamshalas = () => {
  const [allData, setAllData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/Dharamshala_data/index.json")
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getImageUrl = (item) => {
    if (item.directory && item.image) {
      return `/Dharamshala_data/${item.directory}/${item.image}`;
    }
    return '/Brand_Logo.jpg';
  };

  const filtered = allData.filter(item => {
    const matchesFilter = filter === "All" || (() => {
      const key = filter.toLowerCase().replace(/\s+/g, '-');
      const cat = item.category.toLowerCase();
      return cat === key || cat.includes(key.split('-')[0]);
    })();

    const matchesSearch = search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(search.toLowerCase())) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Group by category
  const grouped = {};
  filtered.forEach(item => {
    const cat = item.category.toLowerCase();
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  // Sort groups
  const sortedGroups = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

  // eslint-disable-next-line no-unused-vars
  const totalPlaces = Object.keys(grouped).length;

  if (loading) {
    return (
      <Page>
        <Header />
        <div style={{ textAlign: 'center', padding: 80, color: '#9e8e82', fontFamily: "'Outfit', sans-serif" }}>
          Loading dharamshalas...
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <Header />
      <div className="hero-banner">
        <h1>All Dharamshalas & Pilgrim Stays</h1>
        <p className="subtitle">
          Find traditional accommodations at sacred destinations — simple, clean, and spiritually aligned
        </p>
        <div className="stats">
          <div className="stat">
            <div className="num">{allData.length}</div>
            <div className="label">Dharamshalas</div>
          </div>
          <div className="stat">
            <div className="num">{Object.keys(allData.reduce((acc, d) => { acc[d.category] = true; return acc; }, {})).length}</div>
            <div className="label">Sacred Places</div>
          </div>
          <div className="stat">
            <div className="num">{allData.filter(d => d.details && d.details["Food Facility"] === "Yes").length}</div>
            <div className="label">With Food</div>
          </div>
        </div>
      </div>

      <div className="content">
        <Link to="/" className="back-link">← Back to Home</Link>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, location, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="no-results">No dharamshalas found matching your search.</div>
        ) : (
          sortedGroups.map(([category, items]) => (
            <div key={category} className="location-group">
              <div className="group-header">
                <h2>{categoryLabels[category] || category}</h2>
                <span className="count">{items.length} stays</span>
              </div>
              <div className="cards-grid">
                {items.map((item, idx) => (
                  <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="dharamshala-card">
                    <div className="card-img">
                      <img src={getImageUrl(item)} alt={item.name} loading="lazy" onError={(e) => { e.target.src = '/Brand_Logo.jpg'; }} />
                      <div className="category-badge">{item.category}</div>
                    </div>
                    <div className="card-info">
                      <h3>{item.name}</h3>
                      <div className="address">{item.address}</div>
                      <div className="card-tags">
                        {item.details && item.details["Food Facility"] === "Yes" && <span className="green">🍽 Food</span>}
                        {item.details && (item.details["Parking"] === "Yes" || (item.details["Parking"] && item.details["Parking"].includes("available"))) && <span className="green">🅿 Parking</span>}
                        {item.tags && item.tags.filter(t => t.length < 25).slice(0, 2).map((tag, i) => <span key={i}>{tag}</span>)}
                      </div>
                      {item.details && (item.details["Check in time"] || item.details["Check out time"]) && (
                        <div className="card-details">
                          {item.details["Check in time"] && <span>🕐 In: {item.details["Check in time"]}</span>}
                          {item.details["Check out time"] && <span>🕐 Out: {item.details["Check out time"]}</span>}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Page>
  );
};
