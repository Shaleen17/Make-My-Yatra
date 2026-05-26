import styled from 'styled-components'
export const Navbar = styled.div`
  min-height: 520px;
  background-image: url('/Home_page_Back.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(26, 15, 8, 0.85) 0%,
      rgba(44, 24, 16, 0.6) 40%,
      rgba(44, 24, 16, 0.4) 70%,
      rgba(26, 15, 8, 0.75) 100%
    );
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  .laltain {
    display: none;
  }

  .mmtlogo {
    position: absolute;
    left: 25px;
    top: 12px;
    width: 50px;
    height: 50px;
    border-radius: 6px;
    object-fit: contain;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
  }

  .topdiv {
    padding: 10px 30px 0;
    height: 60px;
    display: flex;
    gap: 10px;
    flex-direction: row-reverse;
    align-items: center;
  }

  .login {
    position: relative;
  }

  .tagline {
    text-align: center;
    color: #f5efe8;
    margin-top: 10px;
    padding: 0 20px;
    animation: slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .tagline h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 4px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    letter-spacing: 0.5px;
  }

  .tagline p {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: rgba(245, 239, 232, 0.85);
    font-weight: 300;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.4;
  }

  .tagline .sanskrit {
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-size: 12px;
    color: #d4a847;
    margin-top: 4px;
    font-weight: 500;
  }

  .button {
    width: 200px;
    margin: auto;
    margin-top: 4px;
    button {
      width: 200px;
      height: 44px;
      color: white;
      font-weight: 600;
      border: none;
      cursor: pointer;
      position: relative;
      top: -20px;
      font-size: 16px;
      letter-spacing: 1px;
      border-radius: 30px;
      background: linear-gradient(135deg, #ff6b35 0%, #c0392b 100%);
      box-shadow: 0 4px 20px rgba(192, 57, 43, 0.4);
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      font-family: 'Outfit', sans-serif;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(192, 57, 43, 0.5);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  a {
    color: white;
    text-decoration: none;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    min-height: auto;
    padding-bottom: 24px;
    background-attachment: scroll;

    .mmtlogo {
      left: 12px;
      top: 10px;
      width: 38px;
      height: 38px;
    }

    .topdiv {
      padding: 10px 12px 0;
      height: 50px;
    }

    .tagline {
      margin-top: 8px;
      padding: 0 16px;
    }

    .tagline h1 {
      font-size: 22px;
    }

    .tagline p {
      font-size: 12px;
    }

    .tagline .sanskrit {
      font-size: 11px;
    }

    .button {
      width: 170px;
      margin-top: 8px;
      button {
        width: 170px;
        height: 42px;
        font-size: 14px;
        top: -16px;
        box-shadow: 0 6px 22px rgba(192, 57, 43, 0.45);
      }
    }
  }

  @media (max-width: 380px) {
    .tagline h1 {
      font-size: 20px;
    }

    .button {
      width: 150px;
      button {
        width: 150px;
        height: 40px;
        font-size: 13px;
      }
    }
  }
`
