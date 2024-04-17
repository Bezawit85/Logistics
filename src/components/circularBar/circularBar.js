import React, { useEffect, useRef, useState } from "react";
import "./circularBar.css";
function CircularBar({ max, color, text, bgcolor }) {
  const [progress, setProgress] = useState(0);
  const count = useRef(0);
  useEffect(() => {
    //USED FOR SETTING THE CIRCULAR BAR PROGRESS
    const timeout = setInterval(() => {
      if (count.current >= max) clearInterval(timeout);
      if (count.current < max) count.current++;
      setProgress((c) => c + 1);
    }, 10);

    return () => {
      clearInterval(timeout);
    };
  }, [max]);
  return (
    <div
      className="circular-bar-container"
      style={{
        backgroundImage: `conic-gradient(${color ? color : "#2976f2"} ${
          count.current * 3.6
        }deg,${bgcolor ? bgcolor : "#70a7ff"} 3.6deg)`,
      }}
    >
      <div className="circular-bar">
        <div className="circular-bar-percent">
          <p>{count.current}%</p>
          <p className="bar-text">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default CircularBar;
