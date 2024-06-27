import React, { useEffect, useState } from 'react'
import "./market_input.css";
import CircularBar from "../../components/circularBar/circularBar";
import MarketDetailTable from "./MarketDetailTable";
import { mainAPI, endpoints } from "../../components/mainAPI";
import { useParams,useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

import {
    showErrorMessage,
    showSuccessMessage,
  } from "../../components/SwalMessages";
const ActiveMarkets = ({isCallCenter}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const jwt = JSON.parse(localStorage.getItem("jwt")); // Getting the token from login api
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [cargoData,setCargoData]=useState({})
    const [cargoDriver, setCargoDriver] = useState([]);
    const apiCargo = `${mainAPI}${endpoints.List.Cargo}/${id}`;
    const apiCargoDriver = `${mainAPI}${endpoints.List.CargoDrivers}/${id}`;
     /****isNew */
     const handleRefresh = () => {
        setRefresh(!refresh)
    
      };
    const options = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    const getCargoDriver = () => {
      setLoading(true);
      fetch(apiCargoDriver, options)
        .then((res) => res.json())
        .then((res) => {
          setCargoDriver(res.cargoDriversINFs);
        })
        .catch((e) => {
          if (e.message == "Failed to fetch")
            showErrorMessage({ message: "net::ERR_INTERNET_DISCONNECTED" });
          else showErrorMessage({ message: "some thing went wrong" });
        })
        .finally(setLoading(false));
    };
    const getCargoDetail = async () => {
        setLoading(true);
        fetch(apiCargo, options)
          .then((res) => res.json())
          .then((res) => {
            setCargoData(res);
            
          })
          .catch((e) => {
            showErrorMessage({ message: "error" });
          })
          .finally(setLoading(false));
      };
      useEffect(() => {
       
        getCargoDetail();
        getCargoDriver();
    
       
      }, [refresh]);


    ///    HANDLE SENDTOCARGO FUNCTION
    const handleSendToCargo = async () => {
      //showSuccessMessage({ message: "Cargo handled" });
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      };
      const sendToCargoApi = `${mainAPI}${endpoints.List.AcceptedCargo}/${id}`;
  
      try {
        const res = await fetch(sendToCargoApi, options);
        if (res.ok) {
          const data = await res.json();
          showSuccessMessage({ message: "success" });
        }
      } catch (e) {
        showErrorMessage({ message: e.message });
      }
    };
    //useEffect
    const goBack = () => {
        navigate(-1)    
      };
    return (
        <div className='main-bar'>
                <div onClick={goBack}>
                <h2 style={{}}>Market Detail / {cargoData.cargoOwner} </h2>
            </div>            <hr className="hr" />
             <div className="main-bar-content">
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
                    <div onClick={handleRefresh}>
                        <div  className="chart-container char-market">
                        <CircularBar
                            text={loading ? "loading" : "Finished"}
                            max={((cargoData.weight - cargoData.remaining) / cargoData.weight) * 100}
                            color={"green"}
                            bgcolor={"#88F6A0"}
                        />
                        <div >
                            <p>
                            Total weight <span style={{ fontWeight: "bold" }}> {cargoData.weight}</span>
                            </p>
                
                            <p>
                            Remaining <span style={{ fontWeight: "bold" }}> {cargoData.remaining}</span>
                            </p>
                        </div>
                        <CircularBar
                            text={loading ? "loading" : "Remaining"}
                            max={(cargoData.remaining / cargoData.weight) * 100}
                            color={"red"}
                            bgcolor={"#FF8378"}
                        />
                        
                        </div>
                        <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            flexWrap: "wrap",
                            maxWidth: "800px",
                            rowGap: "25px",
                            marginTop: "30px",
                            marginLeft: "auto",
                             marginRight: "auto",
                        }}
                        >
                        <div>
                            <div className="cargo-d">
                            <p>Date</p>
                            <p className="underline"> {cargoData.date}</p>
                            </div>
                            <div className="cargo-d">
                            <p>Packaging </p>
                            <p className="underline">{cargoData.packaging}</p>
                            </div>
                        </div>
                        <div>
                            <div className="cargo-d">
                            <p>Payment</p>
                            <p className="underline"> {cargoData.payment || "NULL"}</p>
                            </div>
                            <div className="cargo-d">
                            <p>Cargo Type</p>
                            <p className="underline"> {cargoData.cargoType}</p>
                            </div>
                        </div>
                        <div>
                            <div className="cargo-d">
                            <p style={{ textAlign: "center" }}>Trip</p>
                            <p className="underline">
                                {cargoData.pickUp} <span style={{ fontWeight: "bold" }}>To</span>{" "}
                                {cargoData.dropOff}
                            </p>
                            </div>
                            <div className="cargo-d">
                            <p>Status</p>
                            <p className="underline">{cargoData.status}</p>
                            </div>
                        </div>
                        </div>
                        
                        {!isCallCenter() && cargoData.status === "ACCEPT" && (
                        <button
                            onClick={() => handleSendToCargo()}
                            className="btn w-300 mx-auto btn-bg-blue"
                        >
                            Send To Cargo Owner
                        </button>
                        
                        )}
                        {/* PASSING CARGO ID FOR MARKETDETAIL TABLE FOR PAYMENT  */}
                        <MarketDetailTable
                        target={cargoDriver}
                        marketStatus={cargoData.status}
                        cargoId={cargoData.id}
                        />
                    </div>
                         )}
            </div>
      </div>
    );
  };
  export default ActiveMarkets;