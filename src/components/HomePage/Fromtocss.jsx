import styled from "styled-components";
export const Fromtocss = styled.div`
  .fromtodiv {
    display: flex;
    align-items: flex-end;
    gap: 0;
    margin-bottom: 8px;

    > div:not(.swap-icon) {
      flex: 1;
      padding: 8px 12px;
      border: 1.5px solid #e8e0d8;
      border-radius: 8px;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: #c0392b;
      }

      h3 {
        font-size: 10px;
        color: #9e8e82;
        font-weight: 600;
        letter-spacing: 0.8px;
        margin-bottom: 4px;
        font-family: 'Outfit', sans-serif;
      }

      select {
        width: 100%;
        border: none;
        outline: none;
        font-size: 14px;
        font-weight: 600;
        color: #2c1810;
        background: transparent;
        font-family: 'Outfit', sans-serif;
        cursor: pointer;
      }
    }

    .swap-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #fff8f0;
      border: 2px solid #e8e0d8;
      font-size: 16px;
      color: #c0392b;
      cursor: pointer;
      margin: 0 -10px;
      z-index: 2;
      position: relative;
      top: -6px;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover {
        background: #c0392b;
        color: white;
        border-color: #c0392b;
        transform: rotate(180deg);
      }
    }
  }

  .fromtodiv2 {
    display: flex;
    gap: 8px;

    > div {
      flex: 1;
      padding: 8px 12px;
      border: 1.5px solid #e8e0d8;
      border-radius: 8px;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: #c0392b;
      }

      h3 {
        font-size: 10px;
        color: #9e8e82;
        font-weight: 600;
        letter-spacing: 0.8px;
        margin-bottom: 4px;
        font-family: 'Outfit', sans-serif;
      }

      .date {
        width: 100%;
        border: none;
        outline: none;
        font-size: 14px;
        font-weight: 600;
        color: #2c1810;
        background: transparent;
        font-family: 'Outfit', sans-serif;
        cursor: pointer;
      }

      select {
        width: 100%;
        border: none;
        outline: none;
        font-size: 14px;
        font-weight: 600;
        color: #2c1810;
        background: transparent;
        font-family: 'Outfit', sans-serif;
        cursor: pointer;
      }
    }
  }

  @media (max-width: 768px) {
    .fromtodiv {
      flex-direction: column;
      gap: 6px;

      > div:not(.swap-icon) {
        padding: 10px 14px;

        select, .date {
          font-size: 13px;
          min-height: 28px;
        }
      }

      .swap-icon {
        margin: -4px auto;
        transform: rotate(90deg);
        top: 0;
        width: 32px;
        height: 32px;
        font-size: 14px;
      }

      .swap-icon:hover {
        transform: rotate(270deg);
      }
    }

    .fromtodiv2 {
      flex-direction: column;
      gap: 6px;

      > div {
        padding: 10px 14px;

        .date {
          font-size: 13px;
          min-height: 28px;
        }
      }
    }
  }
`;