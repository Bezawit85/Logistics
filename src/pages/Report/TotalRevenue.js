import { useState, useEffect } from "react";
import "./Table.css";
import * as React from "react";
import { mainAPI } from "../../components/mainAPI";
const TotalRevenue = () => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
 const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
        try {
            const headers = {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${jwt}`,
            }
      const response = await fetch(`${mainAPI}/Api/Admin/Report/All/Revenue`, {headers});
        const data = await response.json();
        const revenues = data.revenues;
        const revenue = revenues.reduce((total, record) => total + record.revenue, 0);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div>
      <h2>Total Revenue: {totalRevenue}</h2>
    </div>
  );
};
export default TotalRevenue;
