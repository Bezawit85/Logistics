import React from "react";
import { Bar } from "react-chartjs-2";
function BarChar({ chartData }) {
  return (
    <Bar
      data={chartData}
      options={{ responsive: true, maintainAspectRatio: false }}
      width={"400"}
    />
  );
}

export default BarChar;
