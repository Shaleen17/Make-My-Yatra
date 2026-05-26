import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Section = styled.section`
  padding: 60px 0 40px;
  background: #ffffff;

  .section-header { text-align: center; margin-bottom: 32px; padding: 0 20px; }
  .section-header h2 { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 700; color: #2c1810; margin-bottom: 8px; }
  .section-header .divider { width: 60px; height: 3px; background: linear-gradient(135deg, #ff6b35, #c0392b); border-radius: 10px; margin: 0 auto 12px; }
  .section-header p { font-family: 'Outfit', sans-serif; font-size: 15px; color: #6b5b4f; max-width: 600px; margin: 0 auto; }

  .filter-tabs { display: flex; justify-content: center; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; padding: 0 16px; }
  .filter-tab { font-family: 'Outfit', sans-serif; padding: 8px 20px; border-radius: 25px; border: 1.5px solid #e8e0d8; background: transparent; color: #6b5b4f; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.25s ease; }
  .filter-tab:hover { border-color: #c0392b; color: #c0392b; }
  .filter-tab.active { background: linear-gradient(135deg, #ff6b35, #c0392b); color: white; border-color: transparent; }

  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 0 5%; max-width: 1200px; margin: 0 auto; }

  .dharamshala-card { background: #ffffff; border: 1px solid #f0ebe5; border-radius: 14px; overflow: hidden; transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1); cursor: pointer; }
  .dharamshala-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(44, 24, 16, 0.12); }

  .card-img { height: 160px; overflow: hidden; position: relative; background: #f5f0e8; }
  .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .dharamshala-card:hover .card-img img { transform: scale(1.06); }
  .card-img .category-badge { position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.92); backdrop-filter: blur(6px); padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; color: #c0392b; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Outfit', sans-serif; }

  .card-info { padding: 14px 16px; }
  .card-info h3 { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600; color: #2c1810; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-info .address { font-size: 12px; color: #9e8e82; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .card-tags span { font-size: 10px; padding: 3px 8px; border-radius: 12px; background: #f5f0e8; color: #6b5b4f; font-weight: 500; font-family: 'Outfit', sans-serif; }
  .card-tags span.green { background: rgba(39,174,96,0.1); color: #27ae60; }

  .card-details { display: flex; gap: 12px; font-size: 11px; color: #9e8e82; font-family: 'Outfit', sans-serif; }

  .view-all-btn { display: block; width: fit-content; margin: 40px auto 0; padding: 12px 36px; background: transparent; border: 2px solid #c0392b; color: #c0392b; border-radius: 30px; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
  .view-all-btn:hover { background: linear-gradient(135deg, #ff6b35, #c0392b); color: white; border-color: transparent; transform: translateY(-2px); box-shadow: 0 4px 20px rgba(192,57,43,0.3); }

  .loading { text-align: center; padding: 40px; color: #9e8e82; font-family: 'Outfit', sans-serif; }

  @media (max-width: 768px) {
    padding: 40px 0 24px;
    .section-header h2 { font-size: 24px; }
    .section-header p { font-size: 13px; }
    .filter-tabs { gap: 6px; scroll-snap-type: x mandatory; }
    .filter-tabs::-webkit-scrollbar { display: none; }
    .filter-tab { padding: 7px 14px; font-size: 11px; scroll-snap-align: start; }
    .cards-grid {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      gap: 12px;
      padding: 0 16px 8px;
    }
    .cards-grid::-webkit-scrollbar { display: none; }
    .dharamshala-card {
      flex: 0 0 min(70vw, 260px);
      scroll-snap-align: center;
    }
    .card-img { height: 130px; }
    .card-info { padding: 10px 12px; }
    .card-info h3 { font-size: 13px; }
  }
`;

const categories = ["All", "ISKCON", "Varanasi", "Kedarnath", "Ayodhya", "Vrindavan-Mathura", "Jagannath Puri", "Rameshwaram"];

export const DharamshalaSection = () => {
  const [filter, setFilter] = useState("All");
  const [allData, setAllData] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/Dharamshala_data/index.json")
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setItems(data.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (allData.length === 0) return;
    if (filter === "All") {
      setItems(allData.slice(0, 8));
    } else {
      const key = filter.toLowerCase().replace(/\s+/g, '-');
      const filtered = allData.filter(d => {
        const cat = d.category.toLowerCase();
        return cat === key || cat.includes(key.split('-')[0]);
      });
      setItems(filtered.slice(0, 8));
    }
  }, [filter, allData]);

  const getImageUrl = (item) => {
    if (item.directory && item.image) {
      return `/Dharamshala_data/${item.directory}/${item.image}`;
    }
    return '/Brand_Logo.jpg';
  };

  if (loading) return <Section><div className="loading">Loading dharamshalas...</div></Section>;

  return (
    <Section id="dharamshala-section">
      <div className="section-header">
        <div className="divider"></div>
        <h2>Dharamshala & Pilgrim Stays</h2>
        <p>Traditional accommodations built for pilgrims — simple, clean, and spiritually aligned</p>
      </div>

      <div className="filter-tabs">
        {categories.map(cat => (
          <button key={cat} className={`filter-tab ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {items.map((item, idx) => (
          <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className="dharamshala-card">
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
            </div>
          </a>
        ))}
      </div>

      <Link to="/dharamshalas" style={{ textDecoration: 'none' }}>
        <button className="view-all-btn">
          View All Dharamshalas →
        </button>
      </Link>
    </Section>
  );
};
