import React from "react";
import axios from "axios";
import styled from 'styled-components'
import { AUTH_API_BASE_URL } from "../../../config";
const Style = styled.div`
text-align: center;
width: 100%;
height: 100%;
font-family: 'Outfit', sans-serif;
h1{
  color: #2c1810;
  font-size: 22px;
  font-weight: 700;
}
p{
  margin-top: 20px;
  color: #6b5b4f;
  font-size: 14px;
}
input{
  width: 70%;
  margin: auto;
  height: 30px;
  border: 1.5px solid #e8e0d8;
  margin-top: 30px;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 15px;
  font-family: 'Outfit', sans-serif;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #c0392b;
  }
}
button{
  border: none;
    font-size: 15px;
    margin-top: 24px;
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    font-weight: 700;
    border-radius: 30px;
    color: white;
    width: 180px;
    height: 44px;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    box-shadow: 0 4px 15px rgba(192, 57, 43, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(192, 57, 43, 0.4);
    }
}
`
export const ConfirmOtp = (props) => {

  const { handleChange,value, handleNewUser } = props;
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {

    e.preventDefault();

    axios.post(`${AUTH_API_BASE_URL}/verifyOTP`,{
      phone: value.phone,
      hash:`${value.hash}`,
      otp:`${value.otp}`

    }).then((res)=>{
      alert("Login Success")
      handleNewUser(value.phone)
      
    }).catch((err)=>{
      alert(err.response.data.msg)
    })
  };

  

  return (
   <Style>
      <div className="otp-cont">
      <div className="title-otp">
        <h1>Enter OTP</h1>
        <p>OTP has been sent to your email</p>
      </div>
      <form onSubmit={handleSubmit} className="otpcnf-form">

      <div className="inp">
        <input
          type="number"
          value={value.otp}
          onChange={handleChange('otp')}
          placeholder="Enter OTP"
          required
        />
      </div>
      <button className="cbtn" type="submit" 
        value="Verify & create Account"
      >Verify OTP</button>
      </form>
    </div>
   </Style>
  );
};
