import React, { useState, useEffect } from "react";
import { mainAPI } from "../mainAPI";
import swal from "sweetalert";

export default function SendMsg({ target, id: selectedUsers, title }) {
  const [popup, setPop] = useState(false);
  const [data, setData] = useState();
  const [logo, setLogo] = useState();
  const [avatar, setAvatar] = useState();
  const jwt = JSON.parse(localStorage.getItem("jwt"));


  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    const receipientPhone = selectedUsers;
    fetch(`${mainAPI}/Api/Message/CreateMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        message,
        receipientPhone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        swal("Success", "Message sent successfully", "success");
        closePopup();
      })
      .catch((error) => {
        console.error(error);
        swal("Error", "An error occurred while sending the message", "error");
      });
  };

  const handleClickopen = () => {
    if (title === "LogoAvatar") {
      setAvatar();
      setLogo();
    } else {
      const result = target.find(
        (item) => item.selectedUsers === selectedUsers
      );
      setData(result);
    }
    setPop(!popup);
  };

  const closePopup = () => {
    setPop(false);
  };

  function output() {
    if (popup && title !== "LogoAvatar") {
      return (
        <>
          <div className="popup0">
            <div className="popup-innerq">
              <div onClick={closePopup} className="popupclose">
                <h2 className="popupTitle">Send Message</h2>X
              </div>
              <div className="form">
                <form className="popupform" onSubmit={handleSubmit}>
                  <label htmlFor="message">Message:</label>
                  <textarea
                    style={{ height: "150px", width: "450px", resize: "none" }}
                    id="message"
                    name="message"
                  />
                  <textarea
                  style={{ marginTop:"10px", height:"50px", width: "100%", resize: "none"}}
                    type="hidden"
                    name="phoneNumbers"
                    value={selectedUsers.join(",")}
                  />
                  <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <button type="submit" style={{padding:"10px", borderRadius: "15px"}} >Send SMS</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
  return (
    <>
      <div>
        <p
          className="notification_actions"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            className="action_send"
            style={{ padding: "10px", borderRadius: "15px" }}
            onClick={() => handleClickopen()}
          >
            Send SMS
          </button>
        </p>
      </div>

      <div>{output()}</div>
    </>
  );
}
