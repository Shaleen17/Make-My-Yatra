import styled from "styled-components";
import { useState } from "react";

const FareContainer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0ebe5;

  .fare-label {
    font-size: 11px;
    color: #9e8e82;
    font-weight: 600;
    letter-spacing: 0.8px;
    margin-bottom: 10px;
    font-family: 'Outfit', sans-serif;
  }

  .fare-options {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .fare-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1.5px solid #e8e0d8;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: 'Outfit', sans-serif;

    input {
      accent-color: #c0392b;
    }

    .fare-name {
      font-size: 13px;
      font-weight: 600;
      color: #2c1810;
    }

    .fare-desc {
      font-size: 10px;
      color: #9e8e82;
    }

    &:hover {
      border-color: #ff6b35;
      background: rgba(255, 107, 53, 0.03);
    }

    &.selected {
      border-color: #c0392b;
      background: rgba(192, 57, 43, 0.05);
    }
  }

  @media (max-width: 768px) {
    .fare-options {
      gap: 8px;
    }
    .fare-option {
      padding: 6px 12px;
    }
  }
`;

export const FareTypes = () => {
  const [selected, setSelected] = useState("comfort");

  const fares = [
    { id: "budget", name: "Budget Yatra", desc: "Dharamshala stays" },
    { id: "comfort", name: "Comfort Yatra", desc: "AC rooms & meals" },
    { id: "premium", name: "Premium Yatra", desc: "Full guided tour" },
  ];

  return (
    <FareContainer>
      <div className="fare-label">SELECT YATRA TYPE</div>
      <div className="fare-options">
        {fares.map((fare) => (
          <div
            key={fare.id}
            className={`fare-option ${selected === fare.id ? "selected" : ""}`}
            onClick={() => setSelected(fare.id)}
          >
            <input
              type="radio"
              name="fare"
              checked={selected === fare.id}
              onChange={() => setSelected(fare.id)}
            />
            <div>
              <div className="fare-name">{fare.name}</div>
              <div className="fare-desc">{fare.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </FareContainer>
  );
};
