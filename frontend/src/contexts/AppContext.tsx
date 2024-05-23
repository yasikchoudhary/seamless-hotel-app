import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
import {loadStripe , Stripe} from '@stripe/stripe-js';


const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || ""



// This defines a TypeScript type ToastMessage which represents the shape of a toast message object.
//  It has two properties: message, which is a string representing the message content, and type, 
//  which is a string literal type specifically constrained to either "SUCCESS" or "ERROR"

type ToastMessage = {
     message: string;
     type: "SUCCESS" | "ERROR";
}

// type AppContext representing the shape of the context object. It has one property showToast,
//  which is a function that takes a ToastMessage object as its parameter and returns void

type AppContext = {
    showToast : (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
}

// AppContext using the React.createContext function. The generic parameter <AppContext | undefined> 
// specifies the type of the context's value, which can be an AppContext object or undefined. 
// The initial value of the context is undefined.

const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY);


export const AppContextProvider = ({children} : {children:React.ReactNode})=>{
        
    const[toast,setToast] = useState<ToastMessage | undefined>(undefined);  // iski value gyi sabse niche 
      
    const {isError} = useQuery("validateToken" , apiClient.validateToken,{
      retry:false,
    })
      return(
        <AppContext.Provider value={{
            showToast: (toastMessage)=> {
               setToast(toastMessage);    // iski value gyi upar set toast array mae 
                
            },
            isLoggedIn: !isError,
            stripePromise
        }}>
          
          {toast &&(
          <Toast                         // toast ki value true hai toh yeh value lega upar se and send krega toast ko 
          message={toast.message}
           type= {toast.type} 
           onClose={()=> setToast(undefined)}
           />)}

            {children}
        </AppContext.Provider>
      );
};

export const useAppContext = ()=>{
    const context = useContext(AppContext);
    return context as AppContext;
}