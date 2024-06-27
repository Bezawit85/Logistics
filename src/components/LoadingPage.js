import React from "react";
import ReactLoading from "react-loading";
const LoadingPage = ({ message }) => {
  return (
    <div className="manage-modal ">
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          maxWidth: "300px",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: "30px",
          padding: "10px",
        }}
      >
        <ReactLoading type="spin" width={50} height={20} color="black" />
        <p
          style={{
            marginTop: "10px",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
