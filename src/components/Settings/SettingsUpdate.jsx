import React, { useState } from "react";
import { MdSearch } from "react-icons/md";
import ReactLoading from "react-loading";
import SystemSetting from "./SystemSetting";
import  UserSetting  from "./UserSetting";
import PersonalSetting from "./PersonalSetting";
import "./settingCard.css";
const SettingsUpdate = () => {
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="main-bar">
      <div>
        <div className="main-bar-content">
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
          {loading ? (
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
          ) : (
            !error && (
              <>
                <h2>Settings</h2>
                <hr />
                <br />
                {/* <div className="setting-card-holder"></div> */}
                <SystemSetting />
                <UserSetting />
                <PersonalSetting/>
                
              </>
            )
          )}
        </div>
        <div className="">
          {/* <div className="search-bar">
            <input
              type="text"
              name="search"
              placeholder="Search..."
              onChange={(e) => filterTable(e)}
            />
            <MdSearch size={25} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SettingsUpdate;
