import { useNavigate } from "react-router-dom";
import { LoginPanel } from "./loginpanel/LoginPanel";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <LoginPanel
      fullPage
      handleClick={() => navigate("/")}
      handleUser={() => navigate("/")}
    />
  );
};
