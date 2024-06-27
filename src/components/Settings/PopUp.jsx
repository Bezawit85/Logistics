import React, { useState,useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import swal from "sweetalert";
import {addSetting} from './AddSettings'
import { mainAPI, endpoints } from "../../components/mainAPI";

export default function PopUp(props) {


    
    const [popup, setPop] = useState(false);
    const [logo,setLogo]=useState('')
    const [avatar, setAvatar]=useState('')
    const handleClickopen = () => {
        setPop(!popup);
    }

    const closePopup = () => {
        setPop(false);
    }
    const title = props.title

    const jwt = JSON.parse(localStorage.getItem('jwt'));// Getting the token from login api

    const { handleSubmit, formState: { errors },
    } = useForm();
    async function SubmitLogoAvatar() {
        const formData = new FormData();
    
        if (logo) {
            formData.append("logo", logo);
        }
    
        if (avatar) {
            formData.append("avatar", avatar);
        }
    
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            body: formData, 
        };
    
        try {
            const response = await fetch(`${mainAPI}${endpoints.Create.LogoAvatar}`, options);
            const result = await response.json();
            localStorage.setItem("message", JSON.stringify(result["message"]));
            const mess = localStorage.getItem("message");
            if (response.ok) {
                swal("Successful",  `${mess}`, "success", {
                    buttons: false,
                    timer: 2000,
                });
            } else {
                swal(`Failed To Register ${mess}`, "Error", "error");
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const onSubmit = () => {
        if (title === 'name') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.Role}`,jwt)

        }
        if (title === 'driverStatus') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.DriverStatus}`,jwt)

        }
        if (title === 'driverState') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.DriverState}`,jwt)

        }
        if (title === 'alertType') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.AlertType}`,jwt)

        }
        if (title === 'triptypes') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.TripType}`,jwt)

        }
        if (title === 'medium') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.NotificationMedium}`,jwt)

        }
        if (title === 'conditionName') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.VehicleCondition}`,jwt)
        }
        if (title === 'catagory') { 
            addSetting(title,value,`${mainAPI}${endpoints.Create.VehicleCatagory}`,jwt)

        }
        if (title === 'sectorName') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.CompanySector}`,jwt)

        }
        if (title === 'businessType') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.BusinessType}`,jwt)

        }
        if (title === 'businessSector') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.BusinessSector}`,jwt)

        }
        if (title === 'companyType') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.CompanyType}`,jwt)

        }
        if (title === 'service') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.ServiceNeeded}`,jwt)

        }
        if (title === 'cargoType') {
            addSetting(title,value,`${mainAPI}${endpoints.Create.CargoType}`,jwt)

        }

    };
    
    const [value,setvalue]= useState('')
    function output(){
   if( popup && title !== 'LogoAvatar')
                   { return <div>
                        <div className='popup0'> 
                            <div className='popup-innerq'>
                                <div onClick={closePopup} className='popupclose'>
                                <h3 className='popupTitle'>Create {title}</h3> <span>X</span>

                                </div>
                                         
                                   
                                    <form className='popupform'  onSubmit={handleSubmit(onSubmit)}>
                                    <input  type='text' defaultValue={value} placeholder={title}  onChange={(e) => setvalue(e.target.value)}></input>
                                    <div className='send_button'>
                                        <button className='popup_add'>Add</button>
                                        <button onClick={closePopup} className='popup_cancle'>Cancle</button>
                                    </div>
                                    </form>

                              

                            </div>
                        </div>
                    </div>} 
     else if(popup && title === 'LogoAvatar')
                    { 
                    return <div>
                        <div className='popup0'> 
                            <div className='popup-innerq'>
                                <div onClick={closePopup} className='popupclose'>
                                <h2 className='popupTitle'>Create {title}</h2> <span>X</span>
                                </div>
                                    <form className='popupform'  onSubmit={handleSubmit(SubmitLogoAvatar)}>
                                    <input  type='file' defaultValue={logo} placeholder='Logo' onChange={(e) => setLogo(e.target.files[0])}></input>
                                    <input   type='file' defaultValue={avatar} placeholder='Avatar'  onChange={(e) => setAvatar(e.target.files[0])}></input>
                                    <div className='send_button'>
                                        <button className='popup_add'>Add</button>
                                        <button onClick={closePopup} className='popup_cancle'>Cancle</button>
                                    </div>
                                    </form>

                              

                            </div>
                        </div>
                    </div>
                    }
                }
    return ( 

        <>
            <div>
                <div className='Addtitle' onClick={handleClickopen}>Add {title}</div>
            </div>
                
            <div>
                {output()}
            </div>
        </>

    )
}
