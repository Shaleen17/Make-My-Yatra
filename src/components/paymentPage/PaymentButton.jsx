import styled from "styled-components";
import React from "react";
import displayRazorpay from "./PayGateway";
const Style = styled.div`
  button {
    cursor: pointer;
    min-width: 230px;
    height: 48px;
    border-radius: 999px;
    background: linear-gradient(135deg, #ff7544, #c0392b);
    border: none;
    color: white;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 0;
    padding: 0 28px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  button:hover {
    box-shadow: 0 10px 22px rgba(192, 57, 43, 0.28);
    transform: translateY(-1px);
  }
`;

const PaymentButton = ({ label = "BOOK NOW", onBeforePay }) => {
  const handleClick = () => {
    if (onBeforePay) {
      onBeforePay();
    }
    displayRazorpay();
  };

  return (
    <Style>
      <button type="button" onClick={handleClick}>
        {label}
      </button>
    </Style>
  );
};

export default PaymentButton;
