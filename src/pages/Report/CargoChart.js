import React from "react";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";

const CargoChart = ({ chartData2 }) => {
  const exportChart = (id, dimensions) => {
    const chartEl = document.getElementById(id);
    if (chartEl) {
      const image = chartEl.toDataURL("image/png", 1.0);

      const pdf = new jsPDF("landscape");

      const width = chartEl.width;
      const height = chartEl.height;
      pdf.addImage(image, "PNG", ...dimensions, width, height);
      pdf.save("CargoChart.pdf");
    }
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-box" style={{ marginTop: "-50px" }}>
        <Bar
          id="myChart2"
          data={chartData2}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
          width={400}
        />
        <button
          className="bttn"
          onClick={() => exportChart("myChart2", [50, 50, 200, 150])}
          style={{ padding: "10px", alignSelf: "right", marginTop: "10px" }}
        >
          Download Chart
        </button>
      </div>
    </div>
  );
};

export default CargoChart;
