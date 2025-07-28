import React from "react";
import { replace, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/", { replace: true });
  };
  return (
    <div>
      <h1>404</h1>
      <button onClick={handleClick}>Вернутся на главную страницу</button>
    </div>
  );
};

export default NotFound;
