import React from "react";
import "./errorPage.css";
import imgNotfound from "../assets/image/cuate.png";
function ErrorPage() {
  return (
    <div className="error-container">
      <div className="error-msg">
        <img src={imgNotfound} />
        <h1>404</h1>
        <h2>Page Not found</h2>
      </div>
    </div>
  );
}

export default ErrorPage;
