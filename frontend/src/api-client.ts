
import {RegisterFormData} from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";    //holds the base URL of the API endpoint, allowing for 
                                                          //flexibility and easy configuration across environments.

export const register = async(formData: RegisterFormData)=>{  
                                //The formData parameter is expected to adhere to the RegisterFormData type
   
    const response = await fetch(`${API_BASE_URL}/api/users/register` , {
        method: 'POST',
        credentials:"include",          // helps to include any http cookie along with request
        headers:{
            "content-Type":"application/json"
        },
        body: JSON.stringify(formData),
    });
    
    // the code sends a POST request to the registration endpoint. It uses the fetch API to make the request. 
    // The URL is constructed using API_BASE_URL and appended with /api/users/register, forming the complete endpoint URL. 
    // The request is configured with the method set to 'POST', indicating that it's a POST request. 
    // The headers specify that the content type of the request body is JSON. 
    // The formData is converted to a JSON string using JSON.stringify() and sent as the request body.

    const responseBody = await response.json();

    // This line reads the response from the API as JSON using response.json().
    //  It returns a promise that resolves with the JSON representation of the response body.

    if(!response.ok){
        throw new Error(responseBody.message);
    }
};

export const signIn = async (FormData : SignInFormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/auth/login` , {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify(FormData)
    });

    const body = await response.json();

    if(!response.ok){
        throw new Error(body.message);
    }
    return body;
};

export const validateToken = async ()=>{
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials : "include"
    })
    if(!response.ok){
        throw new Error("Token invalid");
    }

    return response.json();
};

export const signOut = async ()=>{
       const response = await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials: "include",
        method: "POST"
       });
   
       if(!response.ok){
        throw new Error("Error during Sign out");
        
       }

}

