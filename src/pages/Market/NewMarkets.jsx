import React, {  useEffect, useState } from 'react'
import LoadingPage from "../../components/LoadingPage";
import { mainAPI } from "../../components/mainAPI";
import "./market_input.css";
import { useParams, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

import {
    showErrorMessage,
    showSuccessMessage,
  } from "../../components/SwalMessages";

 const NewMarkets = ({isCallCenter}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [price, setPrice] = useState();
    const [error, setError] = useState();
    const [refresh, setRefresh] = useState(false);
    const [isPaid,setIsPaid]=useState(false)
    const [amount,setAmount]=useState()
    const [cargoData, setCargoData] = useState({});
    const [loading, setLoading] = useState(false);
    const apiCargo = `${mainAPI}/Api/Admin/All/Cargos/${id}`;
    const jwt = JSON.parse(localStorage.getItem("jwt"));

    const options = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      };
      
    //handle post to cargo owner
    const getCargoDetail = async () => {
        setLoading(true);
        fetch(apiCargo, options)
          .then((res) => res.json())
          .then((res) => {
            setCargoData(res);
          })
          .catch(() => {
            showErrorMessage({ message: "error" });
          })
          .finally(setLoading(false));
      };
    const handlePostCaroOwner = () => {
      if (!amount) {
        showErrorMessage({ message: "Please set Amount" });
      } else postAmount();
    };
    const postAmount = async () => {
     
      const item = { price:amount };
      const id = cargoData.id;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(item),
      };
      const api = `${mainAPI}/Api/Admin/setCargoOwnerPrice/${id}`;
      setLoading(true);
      try {
        const res = await fetch(api, options);
        const data = await res.json();
        localStorage.setItem('message',JSON.stringify(data["message"]))
        const message = localStorage.getItem('message')
        if (res.ok) {
          
          showSuccessMessage({ message: message });
          // setIsPaid(!isPaid)
        }
        else{
          showErrorMessage({ message:message});
        }
      } catch (e) {
        showErrorMessage({ message: e });
      } finally {
        console.log('') // Reloading the Page for getting status;
      }
    };
  
    /// handle post to drivers
    const handlePost = () => {
      if (!price) {
        showErrorMessage({ message: "Please set Price" });
      } else postJob();
    };
    const postJob = async () => {
      const item = { price: price };
      const id = cargoData.id;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(item),
      };
      const postApi = `${mainAPI}/Api/Admin/PostCargo/${id}`;
      setLoading(true);
      try {
        const res = await fetch(postApi, options);
        if (res.ok) {
          const data = await res.json();
          showSuccessMessage({ message: data.message });
        }
      } catch (e) {
        showErrorMessage({ message: e });
      } finally {
        console.log('') // Reloading the Page for getting status;
      }
    };
    useEffect(()=>{
        getCargoDetail()
      },[])
      const goBack = () => {
        navigate(-1)    
      };
    return (

        <div className="main-bar">
            <div onClick={goBack}>
                <h2 style={{}}>Market Detail / {cargoData.cargoOwner} </h2>
            </div>
        <hr className="hr" />
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
      <div>
        {loading ? <LoadingPage message={isPaid ?"Posting Cargo" : 'Sending Amount'} /> : ""}
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            maxWidth: "800px",
            rowGap: "25px",
            marginTop: "30px",
            marginLeft: "130px",
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
              <p>Phone Number</p>
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
              <p>Payment Amount</p>
              <input
              className="underline"
              style={{
              marginTop: '10px',
              marginLeft: 'auto',
              marginRight: 'auto'}}
              type="text"
              placeholder="Amount"
              required
              onChange={(e) => setAmount(e.target.value)}
            />
            </div>
          </div>
        </div>
        {!isCallCenter() && (
        <button className="btn w-300 mx-auto"
        // disabled={isPaid}  
        onClick={()=>handlePostCaroOwner()}>Send</button>
        )}
        <div className="manage-window input new-market-inputs">
          <div>
            <label>Cargo Owner</label>
            <input type="text" disabled defaultValue={cargoData.cargoOwner} />
          </div>
          <div>
            <label>Packaging</label>
            <input type="text" disabled defaultValue={cargoData.packaging} />
          </div>
          <div>
            <label>Type</label>
            <input type="text" disabled defaultValue={cargoData.cargoType} />
          </div>
          <div>
            <label>Pickup</label>
            <input type="text" disabled defaultValue={cargoData.pickUp} />
          </div>
          <div>
            <label>Drop Off</label>
            <input type="text" disabled defaultValue={cargoData.dropOff} />
          </div>
          <div>
            <label>Weight</label>
            <input type="text" disabled defaultValue={cargoData.weight} />
          </div>
          <div>
            <label>Price</label>
            <input
              type="text"
              
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        {!isCallCenter() && (
        <button className="btn w-300 mx-auto" 
        // disabled={!isPaid}
        onClick={() => handlePost()}>
          Post
        </button>
        )}
      </div>
      </div>
      </div>
    );
  };
  export default NewMarkets ;