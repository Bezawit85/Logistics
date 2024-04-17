import React, { useEffect, useState } from "react";
import { mainAPI } from "../../components/mainAPI";
import MarketTable from "./MarketTable";
import ReactLoading from "react-loading";
import { MdSearch } from "react-icons/md";
const Market = () => {
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState("");
  const [loading, setLoading] = useState(false);
  const [cargos, setCargos] = useState("");
  const [alldata, setAllData] = useState();
  const [current, setCurrent] = useState(1);
  const [finished, setFinished] = useState([]);
  const apiCargo = `${mainAPI}/Api/Admin/All/Cargos`;
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  useEffect(() => {
    const getMarket = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiCargo, options);
        if (res.ok) {
          const data = await res.json();
          let tmp1 = data.cargos.filter((cargo) => cargo.status !== "FINISHED");
          setAllData(tmp1);
          setCargos(tmp1);
          let temp = data.cargos.filter((cargo) => cargo.status === "FINISHED");
          setFinished(temp);
          console.log(data.cargos, temp);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getMarket();
  }, [refresh]);
  const filterTable = (e) => {
    let { value } = e.target;
    value = value.toLowerCase();
    const result = alldata.filter((cargo) => {
      return (
        cargo.cargoOwner.toLowerCase().includes(value) ||
        cargo.pickUp.toLowerCase().includes(value) ||
        cargo.dropOff.toLowerCase().includes(value) ||
        cargo.weight.toLowerCase().includes(value) ||
        cargo.status.toLowerCase().includes(value)
      );
    });
    setCargos(result);
    if (value == "") setCargos(alldata);
  };
  return (
    <div className="main-bar">
      <div className="main-bar-wrapper">
      <div>
        <h2 style={{}}>Market</h2>
        <hr className="hr" />
        
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                flexDirection: "column",
                rowGap: "50px",
              }}
            >
              <ReactLoading type="bars" width={100} height={50} color="black" />
              <p>Loading Data Please Wait</p>
            </div>
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
                {error}
              </p>
              <button
                className="btn center w-300"
                onClick={() => setRefresh(!refresh)}
              >
                Refresh Page
              </button>
            </>
          ) : (
            ""
          )}
          {!loading && !error && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "30px",
                  marginTop: "30px",
                }}
              >
                <h4
                  style={{
                    borderBottom: `${current == 1 ? "2px solid black" : ""} `,
                    padding: "5px",
                    cursor: "pointer",
                    transform: "0.3s ease-in-out",
                  }}
                  onClick={() => {
                    setCurrent(1);
                    setCargos(alldata);
                  }}
                >
                  AVAILABLE
                </h4>
                <h4
                  style={{
                    borderBottom: `${current == 2 ? "2px solid black" : ""} `,
                    padding: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setCurrent(2);
                    setCargos(finished);
                  }}
                >
                  FINISHED
                </h4>
              </div>
              <div className="search-bar">
                <input
                  type="text"
                  name="search"
                  placeholder="Search..."
                  onChange={(e) => filterTable(e)}
                />
                <MdSearch size={25} />
              </div>
              <MarketTable target={cargos} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Market;