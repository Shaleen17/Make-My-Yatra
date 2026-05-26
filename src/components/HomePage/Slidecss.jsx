import styled from "styled-components";

export const Slidecss = styled.div`
  height: 80px;
  width: 350px;
  background-color: white;
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(44, 24, 16, 0.06);
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 4%;
  margin-bottom: 5px;
  border: 1px solid #f0ebe5;
  font-family: 'Outfit', sans-serif;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(44, 24, 16, 0.1);
    transform: translateY(-2px);
  }

  img {
    border-radius: 8px;
    width: 70px;
    height: 55px;
    object-fit: cover;
  }

  p {
    font-size: 13px;
    color: #2c1810;
    font-weight: 500;
    line-height: 1.4;
  }
`;

export const Bigslide = styled.div`
  min-height: 350px;
  box-shadow: 0 2px 12px rgba(44, 24, 16, 0.06);
  width: 90%;
  background-color: white;
  border-radius: 16px;
  margin: auto;
  margin-top: 50px;
  border: 1px solid #f0ebe5;
  padding-bottom: 20px;

  .supreoffers {
    display: flex;
    flex-direction: row;
    width: 90%;
    justify-content: flex-start;
    gap: 60px;
    align-items: center;
    background-color: white;
    margin: auto;
    padding-top: 24px;
    h1 {
      font-size: 30px;
      color: #2c1810;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      white-space: nowrap;
    }
    div {
      display: flex;
      flex-direction: row;
      gap: 20px;
      color: #6b5b4f;
      border-bottom: 2px solid #f0ebe5;
      font-family: 'Outfit', sans-serif;
      font-weight: 500;
      font-size: 13px;
      padding-bottom: 10px;

      h3 {
        cursor: pointer;
        transition: all 0.2s;
        padding: 4px 0;
        position: relative;
        &:hover { color: #c0392b; }
      }
    }
  }

  .parentbigslide { padding: 16px 20px; }

  .bigslideDiv {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 2px 12px rgba(44, 24, 16, 0.06);
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #f0ebe5;
    transition: all 0.3s ease;
    background: #fff;

    &:hover {
      box-shadow: 0 6px 25px rgba(44, 24, 16, 0.12);
      transform: translateY(-3px);
    }

    .slide-img-wrap {
      width: 130px;
      min-width: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 14px 0 10px 14px;

      img {
        width: 110px;
        height: 110px;
        border-radius: 10px;
        object-fit: cover;
      }

      span {
        font-size: 11px;
        color: #9e8e82;
        font-family: 'Outfit', sans-serif;
        margin-top: 6px;
        font-weight: 500;
      }
    }

    .slide-content {
      flex: 1;
      padding: 16px 18px 14px 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      h3 {
        color: #c0392b;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.2px;
        margin: 0 0 6px;
        font-family: 'Outfit', sans-serif;
      }

      h2 {
        font-size: 15px;
        color: #2c1810;
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        line-height: 1.35;
        margin: 0 0 8px;
      }

      .reddiv {
        width: 36px;
        height: 3px;
        background: linear-gradient(135deg, #ff6b35, #c0392b);
        border-radius: 10px;
        margin-bottom: 8px;
      }

      p {
        font-size: 12px;
        color: #9e8e82;
        font-family: 'Outfit', sans-serif;
        margin: 0 0 10px;
        line-height: 1.4;
      }

      h4 {
        font-size: 14px;
        color: #c0392b;
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        margin: 0;
        text-align: right;
      }
    }
  }

  @media (max-width: 768px) {
    width: calc(100% - 28px);
    min-height: 0;
    margin-top: 28px;
    padding: 18px 0 20px;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(44, 24, 16, 0.08);

    .supreoffers {
      width: auto;
      margin: 0 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding-top: 0;
      background: transparent;

      h1 {
        font-size: 25px;
        line-height: 1.15;
        white-space: normal;
      }

      div {
        width: 100%;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        border-bottom: 0;
        padding: 0 0 2px;
      }

      div::-webkit-scrollbar { display: none; }

      div h3 {
        flex: 0 0 auto;
        padding: 8px 14px;
        border-radius: 999px;
        background: #f5f0e8;
        color: #6b5b4f;
        font-size: 12px;
        line-height: 1;
        white-space: nowrap;
      }

      div h3:first-child {
        background: linear-gradient(135deg, #ff6b35, #c0392b);
        color: #ffffff;
      }
    }

    .react-slideshow-container {
      margin-top: 8px;
    }

    .react-slideshow-container .default-nav {
      display: none;
    }

    .parentbigslide {
      padding: 10px 16px 4px;
      width: 100%;
    }

    .bigslideDiv {
      display: grid;
      grid-template-columns: 112px minmax(0, 1fr);
      align-items: stretch;
      width: 100%;
      max-width: 100%;
      min-height: 168px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 22px rgba(44, 24, 16, 0.08);

      .slide-img-wrap {
        width: 100%;
        min-width: 0;
        padding: 0;
        position: relative;
        background: #f5f0e8;

        img {
          width: 100%;
          height: 100%;
          min-height: 168px;
          border-radius: 0;
          object-fit: cover;
        }

        span {
          position: absolute;
          left: 8px;
          top: 8px;
          margin: 0;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #c0392b;
          font-size: 10px;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(44, 24, 16, 0.1);
        }
      }

      .slide-content {
        min-width: 0;
        padding: 14px 14px 12px;
        justify-content: space-between;

        h3 {
          font-size: 9px;
          letter-spacing: 0.8px;
          margin-bottom: 5px;
        }

        h2 {
          font-size: 15px;
          line-height: 1.25;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .reddiv {
          width: 32px;
          height: 3px;
          margin-bottom: 7px;
        }

        p {
          font-size: 12px;
          line-height: 1.35;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        h4 {
          font-size: 13px;
          text-align: left;
        }
      }
    }
  }

  @media (max-width: 380px) {
    .bigslideDiv {
      grid-template-columns: 98px minmax(0, 1fr);
      min-height: 158px;

      .slide-img-wrap img {
        min-height: 158px;
      }

      .slide-content {
        padding: 12px 12px 10px;

        h2 {
          font-size: 14px;
        }

        p {
          font-size: 11px;
        }
      }
    }
  }
`;

export const TripMoney = styled.div`
  width: 88%;
  max-width: 1100px;
  margin: auto;

  .section-title {
    text-align: center;
    margin-bottom: 24px;
    h2 { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 700; color: #2c1810; margin-bottom: 4px; }
    .divider { width: 50px; height: 3px; background: linear-gradient(135deg, #ff6b35, #c0392b); border-radius: 10px; margin: 0 auto 8px; }
    p { font-size: 14px; color: #6b5b4f; font-family: 'Outfit', sans-serif; }
  }

  .maindiv {
    height: auto;
    margin-top: 60px;
    color: #2c1810;
    display: flex;
    font-size: 14px;
    gap: 16px;

    #div2 {
      align-items: center;
      background-color: #ffffff;
      border-radius: 14px;
      border-style: solid;
      border-width: 2px 2px 2px 6px;
      display: flex;
      font-size: 14px;
      padding: 20px 20px;
      flex: 1;
      transition: all 0.3s ease;
      box-shadow: 0 2px 12px rgba(44, 24, 16, 0.04);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(44, 24, 16, 0.1);
      }

      img {
        width: 56px;
        height: 56px;
        padding: 5px;
        border-radius: 12px;
        object-fit: contain;
      }

      p {
        color: #6b5b4f;
        font-size: 13px;
        line-height: 1.4;
        font-family: 'Outfit', sans-serif;
      }

      h3 {
        font-size: 17px;
        font-weight: 700;
        line-height: 1.3;
        margin: 0 0 4px;
        font-family: 'Outfit', sans-serif;
        color: #2c1810;
      }
    }
  }

  @media (max-width: 768px) {
    width: 94%;
    .maindiv {
      flex-direction: column;
      margin-top: 30px;
      gap: 12px;
    }
    #div2 {
      padding: 16px 14px;
      h3 { font-size: 15px; }
      p { font-size: 12px; }
    }
  }

  @media (max-width: 380px) {
    width: 96%;
  }
`;
