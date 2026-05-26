import { useState } from "react";
import styled from "styled-components";
import Auth from "../../../auth";

const Style = styled.div`
  .loginMain {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 20px;
    width: 100%;
  }

  .loginMain.full-page {
    background:
      linear-gradient(180deg, rgba(255, 248, 240, 0.96), rgba(250, 247, 242, 1)),
      #faf7f2;
    min-height: 100svh;
  }

  .login-wrap {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    color: #2c1810;
    display: flex;
    flex-direction: row;
    max-height: 92vh;
    max-width: 95vw;
    overflow: hidden;
    position: relative;
    width: 780px;
    z-index: 2;
  }

  .loginMain.full-page .login-wrap {
    box-shadow: 0 18px 60px rgba(44, 24, 16, 0.14);
  }

  .login-left {
    align-items: center;
    background:
      radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.18), transparent 30%),
      linear-gradient(145deg, #2c1810 0%, #6b2f20 54%, #c0392b 100%);
    display: grid;
    justify-items: center;
    min-height: 520px;
    overflow: hidden;
    padding: 34px 26px;
    width: 44%;
  }

  .login-copy {
    color: #ffffff;
    position: relative;
    text-align: left;
  }

  .brand-mark {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 18px;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
    height: 78px;
    margin-bottom: 28px;
    object-fit: cover;
    padding: 8px;
    width: 78px;
  }

  .login-copy h2 {
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-size: 26px;
    line-height: 1.15;
    margin: 0 0 8px;
  }

  .login-copy p {
    color: #f6ddcb;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
  }

  .login-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 34px 36px;
    position: relative;
    width: 56%;
  }

  .close {
    align-items: center;
    background: #fff7f1;
    border: 0;
    border-radius: 999px;
    color: #9e6b5a;
    cursor: pointer;
    display: flex;
    font-size: 18px;
    height: 32px;
    justify-content: center;
    position: absolute;
    right: 16px;
    top: 14px;
    transition: all 0.2s ease;
    width: 32px;
  }

  .close:hover {
    background: #f5e8df;
    color: #2c1810;
  }

  .eyebrow {
    color: #c0392b;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
    margin: 0 0 8px;
    text-transform: uppercase;
  }

  h1 {
    color: #2c1810;
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    line-height: 1.15;
    margin: 0 0 8px;
  }

  .subtitle {
    color: #6b5b4f;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    line-height: 1.55;
    margin: 0 0 18px;
  }

  .mode-toggle {
    background: #f5f0e8;
    border-radius: 999px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 20px;
    padding: 4px;
  }

  .mode-toggle button {
    background: transparent;
    border: 0;
    border-radius: 999px;
    color: #6b5b4f;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 800;
    height: 38px;
  }

  .mode-toggle button.active {
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    box-shadow: 0 4px 12px rgba(192, 57, 43, 0.24);
    color: #ffffff;
  }

  form {
    display: grid;
    gap: 13px;
  }

  .field {
    display: grid;
    gap: 6px;
  }

  .field label {
    color: #5e5149;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
  }

  .field input {
    border: 1.5px solid #e8e0d8;
    border-radius: 8px;
    color: #2c1810;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    height: 44px;
    outline: none;
    padding: 0 13px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
  }

  .field input:focus {
    border-color: #c0392b;
    box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.12);
  }

  .helper {
    color: #8a7a70;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    line-height: 1.4;
    margin: -4px 0 0;
  }

  .message {
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    line-height: 1.45;
    margin: 2px 0;
    padding: 10px 12px;
  }

  .message.error {
    background: #fff0ed;
    color: #a83224;
  }

  .message.success {
    background: #e9fbf2;
    color: #14784c;
  }

  .submit {
    background: linear-gradient(135deg, #ff6b35, #c0392b);
    border: 0;
    border-radius: 999px;
    box-shadow: 0 8px 18px rgba(192, 57, 43, 0.24);
    color: #ffffff;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 900;
    height: 46px;
    margin-top: 4px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    width: 100%;
  }

  .submit:hover:not(:disabled) {
    box-shadow: 0 10px 22px rgba(192, 57, 43, 0.32);
    transform: translateY(-1px);
  }

  .submit:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .switch-copy,
  .terms {
    color: #7a6b62;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    line-height: 1.5;
    margin: 14px 0 0;
    text-align: center;
  }

  .switch-copy button {
    background: transparent;
    border: 0;
    color: #c0392b;
    cursor: pointer;
    font: inherit;
    font-weight: 800;
    padding: 0;
  }

  .terms {
    color: #9e8e82;
    font-size: 11px;
  }

  @media (max-width: 720px) {
    .loginMain {
      align-items: start;
      padding: 12px;
    }

    .login-wrap {
      flex-direction: column;
      overflow-y: auto;
      width: 100%;
    }

    .login-left {
      min-height: 180px;
      width: 100%;
    }

    .login-right {
      padding: 28px 24px;
      width: 100%;
    }
  }
`;

const initialForm = {
  email: "",
  mobile: "",
  name: "",
  password: "",
};

const getErrorMessage = (error) => {
  if (!error.response) {
    return "Login server is not reachable. Please start the backend on port 2345 and try again.";
  }

  const details = error.response?.data?.details;
  if (Array.isArray(details) && details[0]?.message) {
    return details[0].message;
  }
  return error.response?.data?.message || "Authentication failed. Please try again.";
};

export const LoginPanel = ({ handleClick, handleUser, fullPage = false }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const isSignup = mode === "signup";

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setMessage("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    setMessageType("error");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      const response = isSignup
        ? await Auth.signup({
            ...payload,
            mobile: form.mobile.trim() || undefined,
            name: form.name.trim(),
          })
        : await Auth.login(payload);

      setMessageType("success");
      setMessage(response.message || "Welcome to Tirth Sutra.");
      handleUser(response.user);
    } catch (error) {
      setMessageType("error");
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Style>
      <div className={`loginMain ${fullPage ? "full-page" : ""}`}>
        <div className="login-wrap">
          <div className="login-left">
            <div className="login-copy">
              <img className="brand-mark" src="/Brand_Logo.jpg" alt="Tirth Sutra" />
              <h2>Travel with trust</h2>
              <p>Sign in once to manage flights, bookings, and pilgrim journeys.</p>
            </div>
          </div>
          <div className="login-right">
            {handleClick && (
              <button aria-label="Close login" className="close" onClick={handleClick} type="button">
                x
              </button>
            )}

            <p className="eyebrow">Tirth Sutra Account</p>
            <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
            <p className="subtitle">
              {isSignup
                ? "Create a secure account and continue booking in real time."
                : "Login with your registered email and password."}
            </p>

            <div className="mode-toggle">
              <button
                className={!isSignup ? "active" : ""}
                onClick={() => switchMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={isSignup ? "active" : ""}
                onClick={() => switchMode("signup")}
                type="button"
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div className="field">
                  <label>Full name</label>
                  <input
                    autoComplete="name"
                    onChange={updateField("name")}
                    placeholder="Enter your full name"
                    required
                    type="text"
                    value={form.name}
                  />
                </div>
              )}

              <div className="field">
                <label>Email address</label>
                <input
                  autoComplete="email"
                  onChange={updateField("email")}
                  placeholder="yourname@email.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              {isSignup && (
                <div className="field">
                  <label>Mobile number</label>
                  <input
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength="10"
                    onChange={updateField("mobile")}
                    placeholder="10 digit mobile number"
                    type="tel"
                    value={form.mobile}
                  />
                </div>
              )}

              <div className="field">
                <label>Password</label>
                <input
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  minLength="8"
                  onChange={updateField("password")}
                  placeholder="Minimum 8 characters"
                  required
                  type="password"
                  value={form.password}
                />
              </div>
              {isSignup && (
                <p className="helper">Use at least 8 characters. Keep it private and memorable.</p>
              )}

              {message && <div className={`message ${messageType}`}>{message}</div>}

              <button className="submit" disabled={loading} type="submit">
                {loading ? "Please wait..." : isSignup ? "CREATE ACCOUNT" : "LOGIN"}
              </button>
            </form>

            <p className="switch-copy">
              {isSignup ? "Already have an account? " : "New to Tirth Sutra? "}
              <button onClick={() => switchMode(isSignup ? "login" : "signup")} type="button">
                {isSignup ? "Login" : "Create account"}
              </button>
            </p>
            <p className="terms">
              By continuing, you agree to Tirth Sutra's privacy policy and terms.
            </p>
          </div>
        </div>
      </div>
    </Style>
  );
};
