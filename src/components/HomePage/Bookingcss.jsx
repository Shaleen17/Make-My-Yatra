import styled from "styled-components";
export const Bookingcss = styled.div`
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(44, 24, 16, 0.12);
  width: 74%;
  max-width: 950px;
  margin: 10px auto 0;
  padding: 16px 24px 14px;
  border: 1px solid rgba(240, 235, 229, 0.5);

  .checkboxdiv {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    color: #6b5b4f;

    div:first-child {
      display: flex;
      align-items: center;
      gap: 12px;

      label {
        cursor: pointer;
        font-weight: 500;
        padding: 4px 12px;
        border-radius: 20px;
        border: 1.5px solid #e8e0d8;
        transition: all 0.2s ease;
        font-size: 11px;
        letter-spacing: 0.5px;

        &:hover {
          border-color: #c0392b;
          color: #c0392b;
        }
      }

      input[type="checkbox"] {
        display: none;
      }

      input[type="checkbox"]:checked + label {
        background: rgba(192, 57, 43, 0.08);
        border-color: #c0392b;
        color: #c0392b;
      }
    }

    div:last-child {
      font-size: 11px;
      color: #9e8e82;
      font-weight: 400;
    }
  }

  @media (max-width: 768px) {
    width: 92%;
    padding: 14px 14px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    .checkboxdiv {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;

      div:first-child {
        gap: 8px;
        flex-wrap: wrap;
      }

      label {
        padding: 5px 12px;
        font-size: 11px;
      }
    }
  }
`;