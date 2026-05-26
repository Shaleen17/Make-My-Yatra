import styled from "styled-components";
export const Icondivcss = styled.div`
  .icondiv {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    div {
      text-align: center;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease;
      position: relative;

      &:hover {
        background: rgba(192, 57, 43, 0.06);
        span { color: #c0392b; }
        p { color: #c0392b; }
      }

      &.active {
        span { color: #c0392b; }
        p { color: #c0392b; font-weight: 700; }

        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 20%;
          width: 60%;
          height: 3px;
          background: linear-gradient(135deg, #ff6b35, #c0392b);
          border-radius: 3px;
        }
      }
    }

    span {
      color: #6b5b4f;
      transition: color 0.2s ease;
    }

    p {
      padding: 0;
      margin: 0;
      color: #6b5b4f;
      font-size: 11px;
      font-weight: 500;
      font-family: 'Outfit', sans-serif;
      transition: color 0.2s ease;
    }
  }

  @media (max-width: 768px) {
    .icondiv {
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      justify-content: flex-start;
      gap: 2px;
      padding: 0 4px;

      &::-webkit-scrollbar {
        display: none;
      }

      div {
        flex: 0 0 auto;
        min-width: 56px;
        padding: 4px 6px;
      }

      p {
        font-size: 9px;
        white-space: nowrap;
      }

      span svg {
        font-size: 32px !important;
      }
    }
  }
`;