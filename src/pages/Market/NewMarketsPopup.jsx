import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import beep from './beep.mp3';


export default function NewMarketsPopup() {
  const [jobStatus, setJobStatus] = useState(null);
  const [checkPoint, setCheckPoint] = useState(null);
  const url2 = "https://api.bazralogistics.com/Api/Admin/All/Cargos";
  const jwt = JSON.parse(localStorage.getItem('jwt')); // Getting the token from login api

  const playBeep = () => {
    const audio = new Audio(beep);
    audio.play();
  };

  const options = {
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  };

  useEffect(() => {
    const APICall = setInterval(async () => {
      try {
        const response = await fetch(url2, options);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const newJobStatus = data.cargos.filter(item => item.status === 'NEW').length;
        setJobStatus(newJobStatus);
        showNotification(newJobStatus);
        setCheckPoint(prevCheckPoint => {
            if (prevCheckPoint !== null && prevCheckPoint < newJobStatus) {
              playBeep();
            }
            return newJobStatus;
          });
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }, 60000);

    return () => clearInterval(APICall);
  }, []);

  const showNotification = (status) => {
    toast.success(`${status} : New Markets `, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  return (
    <div >
    {jobStatus != null && jobStatus >= 1 && <Link to='/market'><ToastContainer 
    style={{
      width: "200px", // Set the desired width
      maxHeight: "50px",
      fontSize:'.75em',// Set the desired height
    }} /></Link> }
    </div>
  );
}
