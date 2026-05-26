import axios from "axios"
import styled from 'styled-components'
import { AUTH_API_BASE_URL } from "../../../config";
const Style = styled.div`
.loginForm {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .acc-type {
    display: flex;
    justify-content: center;
    gap: 0;
    padding: 4px;
    border-radius: 30px;
    background-color: #f5f0e8;
    align-items: center;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
  }
  .acc-type > div {
    width: 50%;
    padding: 8px 16px;
    border-radius: 26px;
    transition: all 0.25s ease;
    color: #6b5b4f;
  }
  .active-login {
    color: white !important;
    background: linear-gradient(135deg, #ff6b35, #c0392b) !important;
    box-shadow: 0 2px 8px rgba(192, 57, 43, 0.3);
  }

  .login-title {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #6b5b4f;
    margin: 4px 0 0;
  }

  .google-signup {
    display: flex;
    width: 100%;
    align-items: center;
    text-align: center;
    font-weight: 600;
    font-size: 13px;
    border: 1.5px solid #e8e0d8;
    border-radius: 8px;
    justify-content: center;
    cursor: pointer;
    padding: 10px;
    gap: 8px;
    font-family: 'Outfit', sans-serif;
    color: #2c1810;
    transition: all 0.2s ease;
    background: white;

    &:hover {
      border-color: #c0392b;
      background: #faf7f2;
    }
  }
  .g-logo {
    width: 22px;
    height: 22px;
  }
  .g-logo > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: contain;
  }

  .social-row {
    display: flex;
    gap: 10px;
    justify-content: center;

    .social-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1.5px solid #e8e0d8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
      font-size: 20px;

      &:hover {
        border-color: #c0392b;
        background: #faf7f2;
        transform: translateY(-1px);
      }

      img {
        width: 22px;
        height: 22px;
        object-fit: contain;
      }
    }
  }

  .other-option {
    font-size: 12px;
    color: #9e8e82;
    font-family: 'Outfit', sans-serif;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 4px 0;

    &::before, &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e8e0d8;
    }
  }

  .tc {
    text-align: center;
    text-decoration: none;
    font-size: 11px;
    color: #9e8e82;
    font-family: 'Outfit', sans-serif;
    margin-top: 8px;
  }
  .tc > a {
    text-decoration: none;
    color: #c0392b;
    font-weight: 500;

    &:hover { text-decoration: underline; }
  }
  .cbtn {
    width: 100%;
    margin: auto;
    padding: 12px;
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    color: white;
    font-size: 15px;
    font-weight: 700;
    border: 0;
    border-radius: 30px;
    box-shadow: 0 4px 15px rgba(192, 57, 43, 0.3);
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(192, 57, 43, 0.4);
    }
  }
  .indicate {
    color: #c0392b;
    font-size: 11px;
    margin: 0;
    font-family: 'Outfit', sans-serif;
  }
  .hide {
    display: none;
  }
  .inp-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;

    label {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #6b5b4f;
    }
  }
  .inp {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e8e0d8;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus-within {
      border-color: #c0392b;
    }
  }
  .inp > input {
    border: 0;
    outline: 0;
    font-size: 15px;
    width: 100%;
    font-family: 'Outfit', sans-serif;
    color: #2c1810;

    &::placeholder {
      color: #bbb;
    }
  }
  
`
export const LoginForm = (props) => {

  const { handleOtpStatus,handleChange,hashHandleChange,value } = props;

  const handleSubmit = (e) => {
    
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(value.phone)) {

      axios.post(`${AUTH_API_BASE_URL}/sendOTP`,{
        phone: value.phone,

      }).then((res)=>{
        console.log(res.data.otp)
        const hash = res.data.hash;
        hashHandleChange(hash);
      })

      handleOtpStatus();
    }
    
    else{
      alert("Please enter a valid email address")
      
    }
   
  };

  return (
    <Style>
      <div className="loginForm">

        <div className="acc-type">
          <div className="active-login">PERSONAL ACCOUNT</div>
          <div>YATRA GROUP</div>
        </div>

        <p className="login-title">Login or create an account</p>

        <form onSubmit={handleSubmit}>

          <div className="inp-wrap">
            <label>Email Address</label>

            <div className="inp">
              <input
                type="email"
                onChange={handleChange('phone')}
                placeholder="yourname@email.com"
                value={value.phone}
                required
              />
            </div>

            <p
              className={
                value.phone.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.phone) ? "hide" : "indicate"
              }
            >
              Please enter a valid email address.
            </p>
          </div>

          <div>
            <input type="submit" className="cbtn" value="CONTINUE" />
          </div>
        </form>

        <p className="other-option">Or Login/Signup With</p>

        <div className="social-row">
          <div className="social-btn">
            <img
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-logos-vector-eps-cdr-svg-download-10.png"
              alt="Google"
            />
          </div>
          <div className="social-btn">
            ✉️
          </div>
        </div>

        <p className="tc">
          By proceeding, you agree to Tirth Sutra's{" "}
          <a href="#">Privacy Policy</a>, <a href="#">User Agreement</a> and{" "}
          <a href="#">T&Cs</a>
        </p>
      </div>
    </Style>
  );
};
