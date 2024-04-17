import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { mainAPI } from "../../components/mainAPI";
import { showErrorMessage } from "../../components/SwalMessages";
import SettingList from "./SettingList";
import UserSettingTable from "./UserSettingTable";

const UserSetting = () => {
  const [show, setShow] = useState(false);
  const [name, setname] = useState("");
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [activeCard, setActiveCard] = useState("totalVehicle");
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState([]);
  const [count, setCount] = useState(0);
  const apiVehicleOwners = `${mainAPI}/Api/Admin/All/VehicleOwners`;

  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const options = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };

  const getOwner = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiVehicleOwners, options);
      if (res.status == 401) {
        //showErrorMessage();
        showErrorMessage({
          message: "Unable to Load!! server respond with 401",
        });
      }
      const data = await res.json();
      if (data && res.ok) {
        setOwner(data.vehicleOwnerINF);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOwner();

    setTableData(owner);
    setname("Message");
  }, [count]);

  const ListCardDetail = [
    {
      title: "Message",
      data: owner.length || 0,
      name: "Message",
    },
  ];

  const handleChange = (name) => {
    if (name === activeCard) setShowSetting(!showSetting);
    else setShowSetting(true);
    setActiveCard(name);
    switch (name) {
      case "Message":
        setTableData(owner);
        setname("name");
        break;

      default:
        setTableData("");
    }
  };

  const [showSetting, setShowSetting] = useState(false);

  const showSettingList = () => {
    setShow(!show);

    if (showSetting) setShowSetting(false);
  };

  return (
    <div className="setting-cards">
      <div
        className="setting-title-container"
        onClick={() => showSettingList()}
      >
        User Setting
        <MdKeyboardArrowDown size={20} />
      </div>
      {show && (
        // <div className="setting-list-container" id="show-setting">
        <div>
          <ul className="setting-sublist">
            {ListCardDetail.map((item, index) => (
              <li key={index}>
                {" "}
                <SettingList
                  title={item.title}
                  data={item.data}
                  key={index}
                  handleCardChange={() => handleChange(item.name)}
                  active={activeCard}
                  name={item.name}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        {showSetting && (
          <UserSettingTable
            setShowSetting={setShowSetting}
            target={tableData}
            count={count}
            setCount={setCount}
            owner={owner}
          />
        )}
      </div>
    </div>
  );
};

export default UserSetting;
