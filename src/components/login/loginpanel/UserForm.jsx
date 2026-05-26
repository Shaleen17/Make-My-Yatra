import React from "react";
import { useState } from "react";
import styled from "styled-components";
const Style = styled.div`
  form {
      width: 80%;
      padding-top: 30px;
      margin: auto;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    font-family: 'Outfit', sans-serif;
    input{
        height: 30px;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1.5px solid #e8e0d8;
        font-size: 15px;
        font-family: 'Outfit', sans-serif;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
          border-color: #c0392b;
        }
    }
    label{
        font-size: 13px;
        font-weight: 500;
        color: #6b5b4f;
    }
    p{
        line-height: 15px;
        color: #c0392b;
        font-size: 11px;
    }
    button{
        border: none;
        margin: auto;
    font-size: 15px;
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
  }
`;
export default function UserForm({ handleNewUser }) {
  const [newUser, setNewUser] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewUser(newUser);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };
  return (
    <Style>
      <form onSubmit={handleSubmit} className="userform">
        <label>Enter full name</label>
        <input
          type="text"
          onChange={handleChange}
          name="name"
          placeholder="Enter your full name"
          required
        />

        <label>Enter password</label>
        <input
          type="password"
          onChange={handleChange}
          name="password"
          placeholder="Password"
          required
        />

        <p>
          Must be at least 8 characters with one alphabet, one number and one special character @$!%*#?&
        </p>

        <button className="cbtn" type="submit" value="SAVE AND CONTINUE" >Save & Continue</button>
      </form>
    </Style>
  );
}
