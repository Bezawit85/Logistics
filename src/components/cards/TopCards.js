import React from "react";
import "./topCard.css";
function TopCards({
  title,
  icon,
  data,
  color,
  handleCardChange,
  active,
  name,
}) {
  const Icon = icon;
  const activecard = document.querySelectorAll("active-card");
  activecard.forEach((element) => {
    element.classList.remove("active-card");
  });
  return (
    <div
      className={`topcard-container ${active === name ? "active-card" : ""}`}
      style={{ backgroundColor: color }}
      onClick={handleCardChange}
    >
      <div className="card-title">
        {title}
      </div>
      <div className="card-data">
        <div className="card-val">{data}</div>
        <div className="card-icon">
          <Icon size={20} color="white" />
        </div>
      </div>
    </div>
  );
}

export default TopCards;
