import React,{useState} from 'react'
import './Signin.css'
import swal from "sweetalert";
import { Link } from 'react-router-dom'
import { AiOutlineEye } from "react-icons/ai";
import { mainAPI } from '../mainAPI';
export default function ConfirmPass(){

    const [error, setError] = useState(false);
    const [pass, showPass] = useState(false);
    const [confirm, setConfirm]= useState(false)
    const ConfirmUrl = `${mainAPI}/Api/User/SetPin`;

    let [isConfirmed, setisConfirmed] =useState(false)
    let mess
     let isPin =false
     if(isPin){
        mess = localStorage.getItem("message")

     }
     const toggleEye = (name) => {
     if(name === 'confirm') setConfirm(!confirm)
     else   showPass(!pass);
      };
    const [username, setusername] = useState("");
    const [pin, setpin]= useState("")
    const [newpassword, setnewpassword] =useState("")
    const [confirmPassword, setconfirmpassword]= useState("")
    

    function onSubmit(e)
    {
        e.preventDefault()
        handleConfirm()
    }
    
   /******************************Confirm *********/

   async function handleConfirm() {

   let item = { 
               newpassword,
              confirmPassword,
              username,
              pin
            }
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer`, },
        body: JSON.stringify(item),
    };
    try {
        const response = await fetch(ConfirmUrl, options);
        const result = await response.json();
        localStorage.setItem("message", JSON.stringify(result["message"]));
      const  mess = localStorage.getItem("message");
        if (response.ok) {
            swal("Successful",`${mess}`, "success", { buttons: false, timer: 2000, })
              setTimeout(()=>{setisConfirmed(!isConfirmed)}, 5000)
        } else {
             swal({
                title: "Failed To Change",
                text: `${mess} `,
                icon: "error",
                dangerMode: true,
                buttons: {
                  confirm: true,
                },
                cancelButtonColor: "#d33",
                showClass: {
                  popup: "animate__animated animate__shakeX",
                },
              });
            
        }
    } catch (error) {
        swal({
            title: "something went wrong",
            text: `net::ERR_INTERNET_DISCONNECTED`,
            icon: "warning",
            dangerMode: true,
            buttons: {
              confirm: true,
            },
            cancelButtonColor: "#d33",
            showClass: {
              popup: "animate__animated animate__shakeX",
            },
          });
        // window.location.href = "/dashboard"; 
    }
}
    return(
        <>
            <div className='confirmWrapper'>
                <div className='left-side'>
                    <div className='left-SideInner'>
                    <span className="signInBold">Bazra Tracker System</span>
                    <p>
                        A system that  controls every movement of a driver and ensures 
                        timely delivery of its packages.
                            <strong> Trusted by everyone.</strong>{" "}
                        </p>
                    <Link to='/'> <p type='button'>Sign in</p> </Link>

                    </div>
                </div>
                    <form  className='SigninForm' onSubmit={onSubmit}>
                        <h3>Change Password</h3>
                        <div className='Signin'>
                            <label>Phone number</label>
                            <input className="signInput" type='text' 
                            placeholder='Enter your phone number'
                            onChange={e => setusername(e.target.value)} 
                            name="username"
                            ></input>
                            <label>PIN</label>
                            <input className="signInput" type='password'
                             placeholder='Enter your Pin'
                             onChange={e => setpin(e.target.value)}
                                   name="pin"
                                   />
                            <label>Password</label>
                            <div className="passWrapper">
                                <input className="signInput"
                                    id="passInput"
                                    type={pass ? "text" : "password"}
                                    placeholder="Password"
                                    onChange={e => setnewpassword(e.target.value)} 
                                    name="newpassword"
                                />
                                <AiOutlineEye onClick={()=>toggleEye('pass')} className="eye" />
                                </div>
                                {error && newpassword.length <= 0 ? (
                                <span className="validateText">please enter your password</span>
                                ) : (
                                ""
                                )}
                            <label>Confirm Password</label>
                            <div className="passWrapper">
                                <input className="signInput"
                                    id="ConfpassInput"
                                    type={confirm ? "text" : "password"}
                                    placeholder="Password"
                                    onChange={e => setconfirmpassword(e.target.value)} 
                                    name='confirmpassword'
                                />
                                <AiOutlineEye onClick={()=>toggleEye('confirm')} className="eye" />
                                </div>
                                {newpassword !== confirmPassword ? (
                                <span className="validateText">password did not match</span>
                                ) : (
                                ""
                                )}
                           <Link to='/'> <p type='button'>Sign in</p> </Link>

                        </div>
                        <div className="signin-div">
                            <button className="signIn-btn">Confirm Password</button>
                        </div>             
                               </form> 
                
                
                </div>
    </>
    
    )
}