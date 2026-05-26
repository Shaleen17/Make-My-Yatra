import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LoginPanel } from "./loginpanel/LoginPanel";
import Auth from "../../auth";
import styled from 'styled-components'

const Style = styled.div`
.loginTrigger {
    min-width: 120px;
    display: flex;
    cursor: pointer;
    gap: 2%;
    font-weight: 800;
    align-items: center;
    font-size: 0.9em;
  }
  .login-logo {
    min-width: 30px;
    min-height: 25px;
    background: #c0392b;
    border-radius: 50%;
    text-align: center;
    vertical-align: center;
    color: white;
    padding-top: 10px;
  }
  .account {
    button {
      min-width: 150px;
      height: 34px;
      color: white;
      font-weight: 600;
      border: none;
      cursor: pointer;
      font-size: 13px;
      margin-right: 50px;
      border-radius: 25px;
      background: linear-gradient(
        to right,
        #ff8c5a 0%,
        #ff6b35 50%,
        #e05a2b 50%,
        #c0392b 100%);
    }
  }

  .userLogged {
    min-height: 40px;
    gap: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    button {
      min-width: 64px;
      height: 30px;
      background-color: #c0392b;
      color: #ffffff;
      font-weight: 600;
      border: none;
      border-radius: 999px;
      cursor: pointer;
    }
  }
  .white {
    color: #2c1810;
    font-weight: 700;
    font-size: 13px;
    align-items: center;
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .loginTrigger {
      min-width: auto;
    }

    .account button {
      min-width: 92px;
      height: 32px;
      margin-right: 0;
      font-size: 12px;
    }

    .userLogged {
      min-height: 34px;
      gap: 6px;
    }

    .userLogged button {
      min-width: 58px;
      height: 28px;
      font-size: 11px;
    }

    .white {
      max-width: 76px;
      font-size: 12px;
    }
  }
  
`

const OverlayStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  visibility: hidden;
  opacity: 0;
  background: rgba(0, 0, 0, 0.6);
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &.active {
    visibility: visible;
    opacity: 1;
  }
`

export const Login = () => {
  
  const [user, setUser] = useState(() => Auth.getStoredUser() || { name: "Traveller" });
  const [isLoggedIn, setIsLoggedIn] = useState(() => Auth.isAuthenticated());
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
    let active = true;
    const unsubscribe = Auth.subscribe(({ authenticated, user: nextUser }) => {
      if (!active) {
        return;
      }

      setUser(nextUser || Auth.getStoredUser() || { name: "Traveller" });
      setIsLoggedIn(Boolean(authenticated));
      if (!authenticated) {
        setShowLogin(false);
      }
    });

    if (Auth.isAuthenticated()) {
      Auth.fetchCurrentUser()
        .then((currentUser) => {
          if (active) {
            setUser(currentUser);
            setIsLoggedIn(true);
          }
        })
        .catch(() => {
          if (active) {
            setIsLoggedIn(Auth.isAuthenticated());
          }
        });
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const logOut = async (event)=>{
    event.stopPropagation();
    await Auth.logout();
    setUser({ name: "Traveller" });
    setIsLoggedIn(false);
    setShowLogin(false);
  }

  const toggleLogin = () => {
    setShowLogin(prev => !prev);
  };

  const handleUser = (user)=>{
    setUser(user || { name: "Traveller" })
    setIsLoggedIn(true);
    setShowLogin(false);
  }

  return (
    <Style>
      <div className="loginTrigger" onClick={isLoggedIn ? undefined : toggleLogin}>
        {isLoggedIn ? (        
          <div className="userLogged">
            <div className="white">Hi {user?.name || "Traveller"}</div>
            <button onClick={logOut} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="account">
            <button>Login</button>
          </div>
        )}
      </div>
      {createPortal(
        <OverlayStyle className={showLogin ? 'active' : ''}>
          <LoginPanel
            handleClick={toggleLogin}
            handleUser={handleUser}
          />
        </OverlayStyle>,
        document.body
      )}
    </Style>
  );
};
