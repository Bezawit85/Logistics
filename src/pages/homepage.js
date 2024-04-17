import React, { useEffect, useState } from "react";
import "./home.css";
import BarChar from "../components/Charts/BarChar";
import { Chart } from "chart.js/auto";
import DoughnutChart from "../components/Charts/DoughnutChart";
import CircularBar from "../components/circularBar/circularBar";
import { useLoadContext } from "../components/context/DataLoadContext";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { showSignInMessage } from "../components/SwalMessages";
const Homepage = () => {
  const [data, setData] = useState({
    labels: ["Vehicle", "User", "Driver", "Compony"],
    datasets: [{ label: "DATA", data: [1, 2, 3, 4] }],
  });
  // GETTING DATA FROM LOADCONTEXT
  const { payload, loading, error, setRefresh } = useLoadContext();
  const navigater = useNavigate();
  useEffect(() => {
    if (error == "session expired") {
      showSignInMessage(() => (window.location.href = "/"));
    }
    const populateDate = () => {
      setData({
        labels: ["OnRoute", "Assigned", "Unassigned", "permite"],
        datasets: [
          {
            label: "Summary",
            data: [
              payload.onRoute.length,
              payload.assigned.length,
              payload.unassigned.length,
              payload.permit.length,
            ],
          },
        ],
      });
    };
    populateDate();
  }, [loading]);
  return (
    <div className="main-bar">
      <div className=" main-bar-wrapper">
        <div>
          <h2 style={{}}>Driver Analysis</h2>
          <hr className="hr" />
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                flexDirection: "column",
                rowGap: "10px",
              }}
            >
              <ReactLoading type="cylon" width={60} height={20} color="black" />
              <p>Loading Data Please Wait</p>
            </div>
          ) : (
            ""
          )}
          {error ? (
            <>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  marginTop: "50px",
                  color: "red",
                }}
              >
                {error === "Failed to fetch" ? "NO INTERNET CONNECTION" : error}
              </p>
              <button
                className="btn w-300 center"
                onClick={() => setRefresh(true)}
              >
                Refresh Page
              </button>
            </>
          ) : (
            <div className="chart-container">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <div>
                  {/* IT IS BETTER TO SAY PERCENT THAN MAX */}
                  <CircularBar
                    text={loading ? "loading" : "onRoute"}
                    max={
                      (payload.onRoute.length / payload.allDrivers.length) * 100
                    }
                    color={""}
                  />
                  <CircularBar
                    text={loading ? "loading" : "Assigned"}
                    max={
                      (payload.assigned.length / payload.allDrivers.length) *
                      100
                    }
                    // (12/20)*100
                    color={""}
                  />
                </div>
                <div>
                  <CircularBar
                    text={loading ? "loading " : "UnAssigned"}
                    max={
                      (payload.unassigned.length / payload.allDrivers.length) *
                      100
                    }
                    color={""}
                  />
                  <CircularBar
                    text={loading ? "loading " : "Permit"}
                    max={
                      (payload.permit.length / payload.allDrivers.length) * 100
                    }
                    color={""}
                  />
                </div>
              </div>
              {/* <div style={{ maxWidth: "400px", position: "relative" }}>
          <DoughnutChart chartData={data} />
        </div> */}
              <div
                style={{
                  maxWidth: "400px",
                  position: "relative",
                  height: "300px",
                }}
              >
                <BarChar chartData={data} />
              </div>
            </div>
          )}
          <div>
            <Link className="link-goto" to={"/driver"}>
              Go To Driveres
            </Link>
          </div>
        </div>
      </div>
      {/* *************************MARKET PAGE *************** */}
      <div className="main-bar-wrapper">
        <div>
          <h2>Market Analysis</h2>
          <hr className="hr"></hr>
          {error ? (
            <>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  marginTop: "50px",
                  color: "red",
                }}
              >
                {error}
              </p>
              <button
                className="btn w-300 center"
                onClick={() => setRefresh(true)}
              >
                Refresh Page
              </button>
            </>
          ) : (
            <div className="chart-container">
              <div style={{ maxWidth: "400px", position: "relative" }}>
                <DoughnutChart chartData={data} />
              </div>
              <div
                style={{
                  maxWidth: "700px",
                  position: "relative",
                  height: "300px",
                }}
              >
                <BarChar chartData={data} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
