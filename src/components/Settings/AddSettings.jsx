import React from "react";
import swal from "sweetalert";

async function addSetting( title,value,url,jwt ) {
    let item =
    {
        value,
    };
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(item),
    };
        try {
        const response = await fetch(url, options);
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
async function editSetting( title,value,url,jwt ) {
    let item =
    {
        value,
    };
    const options = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(item),
    };
        try {
        const response = await fetch(url, options);
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
export  {addSetting, editSetting}