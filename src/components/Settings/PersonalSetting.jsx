import React, { useState,useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { mainAPI } from "../../components/mainAPI";
import { showErrorMessage } from "../../components/SwalMessages";
import SettingList from './SettingList';
import SettingTable from './SettingTable';

const PersonalSetting = () => {
    // const [showSetting, setShowSetting] = useState(false);
    const [show, setShow] = useState(false);

    const showSettingList = () => {
        setShow(!show);
     
      };
return(
    <>
    <div  className="setting-cards">
    <div
        className="setting-title-container"
        onClick={() => showSettingList()}
      >
        Personal Setting
        <MdKeyboardArrowDown size={20} />

      </div>
      </div>
    
    </>
)

}
export default PersonalSetting