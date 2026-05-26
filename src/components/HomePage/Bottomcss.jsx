import styled from "styled-components";
export const Bottomcss = styled.div`
  .div1 {
    display: flex;
    justify-content: space-between;
    width: 88%;
    max-width: 1100px;
    margin: auto;
    padding-top: 40px;
    font-family: 'Outfit', sans-serif;

    h3 {
      font-size: 11px;
      letter-spacing: 1px;
      color: #2c1810;
      padding: 0;
      margin-bottom: 12px;
    }
    p {
      line-height: 1;
      font-size: 13px;
      cursor: pointer;
      color: #6b5b4f;
      margin-bottom: 8px;
      transition: color 0.2s;
    }
    p:hover { color: #c0392b; }
  }

  .div2 {
    width: 88%;
    max-width: 1100px;
    margin: auto;
    margin-top: 40px;
    font-family: 'Outfit', sans-serif;
    padding-top: 30px;
    border-top: 1px solid #f0ebe5;

    h3 {
      font-size: 11px;
      letter-spacing: 1px;
      color: #2c1810;
      padding: 0;
      margin-bottom: 8px;
    }
    p {
      font-size: 13px;
      cursor: pointer;
      color: #6b5b4f;
      line-height: 1.6;
    }
  }

  .div3 {
    display: flex;
    margin-top: 40px;
    justify-content: space-around;
    gap: 40px;
    padding: 40px 5%;
    background-color: #f5f0e8;
    font-family: 'Outfit', sans-serif;

    h3 {
      font-size: 15px;
      padding: 0;
      color: #2c1810;
      font-weight: 600;
      margin-bottom: 8px;
    }
    p {
      font-size: 13px;
      color: #6b5b4f;
      line-height: 1.6;
    }
  }

  .div4 {
    background: linear-gradient(135deg, #1a0f08, #2c1810);
    color: #f5efe8;
    font-size: 14px;
    padding: 30px 0 40px;
    font-family: 'Outfit', sans-serif;

    .fb {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 90%;
      max-width: 1100px;
      margin: auto;

      .onee {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .brand-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #f5efe8;
        }

        .social-links {
          display: flex;
          gap: 20px;
          a {
            font-size: 13px;
            text-decoration: none;
            transition: opacity 0.2s;
            &:hover { opacity: 0.8; }
          }
        }
      }

      .copy {
        text-align: right;
        p {
          margin: 0;
          color: #f5efe8;
          font-size: 14px;
          line-height: 1.6;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .div1 {
      flex-direction: column;
      gap: 24px;
      padding-top: 24px;
    }
    .div2 {
      padding-left: 16px;
      padding-right: 16px;
    }
    .div3 {
      flex-direction: column;
      gap: 24px;
      padding: 24px 16px;
    }
    .div4 {
      padding-bottom: calc(40px + 82px + env(safe-area-inset-bottom));
    }
    .div4 .fb {
      flex-direction: column;
      gap: 16px;
      text-align: center;
      .onee { align-items: center; }
      .copy { text-align: center; }
      .social-links { flex-direction: column; gap: 8px; }
    }
  }
`;
