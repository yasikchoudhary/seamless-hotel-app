
import {RegisterFormData} from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelSearchResponse, HotelType, PaymentIntentResponse, UserType} from "../../backend/src/shared/types"
import { BookingFormData } from "./forms/BookingForm/BookingForm";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";    //holds the base URL of the API endpoint, allowing for 
                                                          //flexibility and easy configuration across environments.

   export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};



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

export const addMyHotel = async(hotelFormData: FormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials:"include",
        method:"POST",
        body : hotelFormData,
    });

    if(!response.ok){
        throw new Error("Failed to add hotel");
        
       }

       return response.json();
}

export const fetchMyHotels = async () : Promise<HotelType[]> => {

    const response  = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
    
} 


export const fetchMyHotelById = async (hotelId : string) : Promise<HotelType> => {

    const response  = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
        credentials:"include"
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
    
} 


export const updateMyHotelById = async(hotelFormData: FormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,{
        credentials:"include",
        method:"PUT",
        body : hotelFormData,
    });

    if(!response.ok){
        throw new Error("Failed to update hotel");
        
       }

       return response.json();
}

export type SearchParams = {
    destination? : string;
    checkIn? : string;
    checkOut? : string;
    adultCount? : string;
    childChount? : string;
    page?: string;
    facilities? : string[];
    types? : string[];
    stars? : string[];
    maxPrice? : string;
    sortOption? : string;
}

export const searchHotels = async(searchParams : SearchParams):Promise<HotelSearchResponse>=>{
    
    const queryParams = new URLSearchParams();
    queryParams.append("destination" , searchParams.destination || "");
    queryParams.append("checkIn" , searchParams.checkIn || "");
    queryParams.append("checkOut" , searchParams.checkOut || "");
    queryParams.append("adultCount" , searchParams.adultCount || "");
    queryParams.append("childChount" , searchParams.childChount || "");
    queryParams.append("page" , searchParams.page || "");
     
    queryParams.append("maxPrice",searchParams.maxPrice || "");
    queryParams.append("sortOption",searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility)=>queryParams.append("facilities" , facility));

    searchParams.types?.forEach((type)=> queryParams.append("types" , type));
    searchParams.stars?.forEach((star)=> queryParams.append("stars" , star));

    
    
    
    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`
    );

    if(!response.ok){
        throw new Error("Failed to fetch hotel");
        
       }

       return response.json();
}

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if (!response.ok) {
      throw new Error("Error fetching Hotels");
    }
  
    return response.json();
  };


  

export const createPaymentIntent = async (
    hotelId: string,
    numberOfNights: string
  ): Promise<PaymentIntentResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ numberOfNights }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) {
      throw new Error("Error fetching payment intent");
    }
  
    return response.json();
  };


  export const createRoomBooking = async (formData: BookingFormData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );
  
    if (!response.ok) {
      throw new Error("Error booking room");
    }
  };