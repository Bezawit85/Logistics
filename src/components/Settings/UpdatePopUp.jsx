import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import swal from "sweetalert";
import {editSetting} from './AddSettings'
import { FaEdit } from "react-icons/fa";
import { mainAPI } from "../../components/mainAPI";

export default function UpdatePopUp({target,id,title}) {
    const [popup, setPop] = useState(false);
    const [data, setData] = useState();
    const [value,setvalue]= useState()
    const [logo, setLogo]= useState()
    const [avatar,setAvatar]=useState()

    const handleClickopen = () => {  
        if (title === 'LogoAvatar')
        {
            console.log(target)
            setAvatar(target[avatar])
            setLogo(target[logo])
        }
        else
    {
        const result = target.find(item => item.id === id);
    console.log(result)
    setData(result)
}
    setPop(!popup);

    }

    const closePopup = () => {
        setPop(false);
    }
   

    const jwt = JSON.parse(localStorage.getItem('jwt'));// Getting the token from login api

    const { register, handleSubmit, watch, formState: { errors },
    } = useForm();
    async function UpdateLogoAvatar() {
        console.log('logp')
        const formData = new FormData();
    
        // Append the first image to the FormData object if it exists
        if (logo) {
            formData.append("logo", logo);
        }
    
        // Append the second image to the FormData object if it exists
        if (avatar) {
            formData.append("avatar", avatar);
        }
    
        const options = {
            method: "PUT",
            headers: {
                // Use "multipart/form-data" for file uploads
                // Remove the "Content-Type" header since it's set automatically
                "Accept": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: formData, // Send the FormData object as the request body
        };
    
        try {
            const response = await fetch('${mainAPI}/Api/Admin/UpdateLogo', options);
            const result = await response.json();
            console.log(result);
            localStorage.setItem("message", JSON.stringify(result["message"]));
            const mess = localStorage.getItem("message");
            console.log(mess);
            if (response.ok) {
                swal("Successful",  `${mess}`, "success", {
                    buttons: false,
                    timer: 2000,
                });
                // setPop(false);
            } else {
                console.log("failed");
                swal(`Failed To Register ${mess}`, "Error", "error");
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const onSubmit = (data) => {
        console.log(title,'hii');
        if (title === 'name') {
            // Create_Role();
            editSetting(title,value,`${mainAPI}/Api/Admin/Update/Role/${id}`,jwt)

        }
        if (title === 'driverStatus') {
            // Create_Driver_Status();
            editSetting(title,value,`${mainAPI}/Api/Admin/Update/DriverStatus/All/${id}`,jwt)

        }
        if (title === 'driverState') {
            // Create_Driver_Status();
            editSetting(title,value,`${mainAPI}/Api/Admin/Update/DriverState/All/${id}`,jwt)

        }
        
        if (title === 'alertType') {
            // Create_Alert_Type();
            editSetting(title,value,`${mainAPI}/Api/Admin/AlertType/Update/${id}`,jwt)

        }
  
        if (title === 'medium') {
            // Add_Notification();
            editSetting(title,value,`${mainAPI}/Api/Admin/NotificationMedium/Update/${id}`,jwt)

        }
        if (title === 'conditionName') {
            // Add_Vehicle_Condition();
            editSetting(title,value,`${mainAPI}/Api/Admin/VehicleCondition/Update/${id}`,jwt)
        }
        if (title === 'service') {
            // Add_Service_Needed();
            editSetting(title,value,`${mainAPI}/Api/Admin/Services/Update/${id}`,jwt)

        }
        if (title === 'catagory') { 
            // Add_vehicle_category();
            editSetting(title,value,`${mainAPI}/Api/Admin/VehicleCatagory/Update/${id}`,jwt)

        }
        if (title === 'companyType') {
            // Add_company_type();
            editSetting(title,value,`${mainAPI}/Api/Admin/CompanyType/Update/${id}`,jwt)

        }
        if (title === 'sectorName') {
            // Add_company_sector();
            editSetting(title,value,`${mainAPI}/Api/Admin/CompanySector/Update/${id}`,jwt)

        }
 
        if (title === 'businessType') {
            // Add_company_type();
            editSetting(title,value,`${mainAPI}/Api/Admin/BusinessType/Update/${id}`,jwt)

        }
        if (title === 'businessSector') {
            // Add_company_type();
            editSetting(title,value,`${mainAPI}/Api/Admin/BusinessSector/Update/${id}`,jwt)

        }
      
      if (title === 'triptypes') {
            console.log(value)
            editSetting(title,value,`https://api.bazralogistics.com/Api/Admin/TripType/All/${id}`,jwt)

        }
        if (title === 'cargoType') {
            // Add_Service_Needed();
            editSetting(title,value,`https://api.bazralogistics.com/Api/Admin/CargoType/Update/${id}`,jwt)

        }

    };

    // const [notifications, setNotification] = useState("");
    function output(){
        if( popup && title !== 'LogoAvatar')
        { return<>
                        <div className='popup0'> 
                            <div className='popup-innerq'>
                                <div onClick={closePopup} className='popupclose'>
                                <h2 className='popupTitle'>Edit {title}</h2>
                                    X</div>
                                <div className='fgf'>
                                    <form className='popupform'  onSubmit={handleSubmit(onSubmit)}>
                                    <input type='text'  defaultValue={data[title]}   onChange={(e) => setvalue(e.target.value)}></input>
                                    <div className='send_button'>
                                        <button className='popup_add'>Update</button>
                                        <button onClick={closePopup} className='popup_cancle'>Cancle</button>
                                    </div>
                                    </form>

                                </div>

                            </div>
                        </div>
                        </>
                    }
                  else if(popup && title === 'LogoAvatar')
                  { 
                  return <div className='popup0'> 
                            <div className='popup-innerq'>
                                <div onClick={closePopup} className='popupclose'>
                                <h2 className='popupTitle'>Edit {title}</h2> <span>X</span>
                                </div>
                                    <form className='popupform'  onSubmit={handleSubmit(UpdateLogoAvatar)}>
                                    <input  type='file' defaultValue={logo} placeholder='Logo' onChange={(e) => setLogo(e.target.files[0])}></input>
                                    <input   type='file' defaultValue={avatar} placeholder='Avatar'  onChange={(e) => setAvatar(e.target.files[0])}></input>
                                    <div className='send_button'>
                                        <button className='popup_add'>Update</button>
                                        <button onClick={closePopup} className='popup_cancle'>Cancle</button>
                                    </div>
                                    </form>

                                

                            </div>
                     </div>
                }
    }
    return ( 

        <>
            <div>
                     <p className='notification_actions'>
                            <FaEdit title='Edit' className='action_edit' size="1.4rem" color='green'
                                onClick={()=>handleClickopen()}>

                            </FaEdit>
                     </p>
            </div>
                
            <div>
                {output()
                     }
            </div>
        </>

    )
}
