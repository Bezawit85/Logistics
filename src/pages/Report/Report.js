import React, { useState, useEffect } from "react";
import { mainAPI } from "../../components/mainAPI";
import { Pagination } from "antd";
import "../home.css";
import { useLoadContext } from "../../components/context/DataLoadContext";
import CompanyReport from "./CompanyReport";
import CompanyChart from "./CompanyChart";
import CargoReport from "./CargoReport";
import CargoChart from "./CargoChart";
import TotalRevenue from "./TotalRevenue";

const Report = () => {
  const { error, setRefresh } = useLoadContext();
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const [records, setRecords] = useState([]);
  const [inputs, setInputs] = useState([]);

  const [page, setPage] = useState(1);
  const [postPerPage, setpostPerPage] = useState(6);
  const lastIndexOfPage = page * postPerPage;
  const firstIndexPage = lastIndexOfPage - postPerPage;
  const totalPages = records.length;
  const currentPage = records.slice(firstIndexPage, lastIndexOfPage);
  const onShowSizeChange = (current, pageSize) => {
    setpostPerPage(pageSize);
  };

  const [page2, setPage2] = useState(1);
  const [postPerPage2, setpostPerPage2] = useState(6);
  const lastIndexOfPage2 = page2 * postPerPage2;
  const firstIndexPage2 = lastIndexOfPage2 - postPerPage2;
  const totalPagesCargo = inputs.length;
  const currentPageCargo = inputs.slice(firstIndexPage2, lastIndexOfPage2);

  const onShowSizeChangeCargo = (current, pageSize) => {
    setpostPerPage2(pageSize);
  };
  const chartData = {
    labels: currentPage.map((record) => record.firstName),
    datasets: [
      {
        label: "Vehicle",
        data: currentPage.map((record) => record.totalVehicles),
        backgroundColor: "#FF8C00",
        borderWidth: 1,
      },
      {
        label: "Driver",
        data: currentPage.map((record) => record.totalDrivers),
        backgroundColor: "#70b8e9",
        borderWidth: 1,
      },
      {
        label: "Revenue",
        data: currentPage.map((record) => record.revenue),
        backgroundColor: "#f4c430",
        borderWidth: 1,
      },
    ],
  };

  const chartData2 = {
    labels: currentPageCargo.map((input) => input.ownerName),
    datasets: [
      {
        label: "Revenue",
        data: currentPageCargo.map((input) => input.revenue),
        backgroundColor: "#FF8C00",
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async (url, setDataCallback) => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        };

        const response = await fetch(url, { headers });

        if (response.status === 401) {
          console.log("Unable to Load!! server responded with 401");
        }

        const data = await response.json();

        if (data && response.ok) {
          console.log(data);
          setDataCallback(data.vehicleOwnerINF || data.cargoOwners);
        }

        if (response.status === 400) {
          console.log("Invalid API server 400");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(`${mainAPI}/Api/Admin/All/VehicleOwners`, setRecords);
    fetchData(`${mainAPI}/Api/Admin/All/CargoOwners`, setInputs);
  }, [jwt, mainAPI]);
  return (
    <div className="main-bar">
      <div className="main-bar-wrapper">
        <div className="reportWrapper">
          <TotalRevenue />
        </div>

        <div className="reportWrapper">
          <h2>Total Report / Company </h2>
          <hr className="hr" />
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
              <CompanyReport records={records} currentPage={currentPage} />
              <CompanyChart chartData={chartData} />
            </div>
          )}
          <div className="page">
          <Pagination
            onChange={(page) => setPage(page)}
            pageSize={postPerPage}
            current={page}
            total={totalPages}
            onShowSizeChange={onShowSizeChange}
          />
          </div>
        </div>
        {/* *************************Reports PAGE *************** */}

        <div className="reportWrapper">
          <h2>Total Report / Cargo</h2>
          <hr className="hr" />
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
              <CargoReport
                inputs={inputs}
                currentPageCargo={currentPageCargo}
              />
              <CargoChart chartData2={chartData2} />
            </div>
          )}
          <div className='page'>
          <Pagination
            onChange={(page2) => setPage2(page2)}
            pageSize={postPerPage2}
            current={page2}
            total={totalPagesCargo}
            onShowSizeChange={onShowSizeChangeCargo}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
