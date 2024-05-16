import { useMutation, useQueryClient } from "react-query";
import * as apiClient from"../api-client";
import { useAppContext } from "../contexts/AppContext";
const SignOutButton = ()=>{

    const queryClient = useQueryClient();

    const{showToast} = useAppContext();

    const mutation = useMutation(apiClient.signOut,{
        onSuccess:async()=>{
            // show toast
            await queryClient.invalidateQueries("validateToken")
            showToast({message: "Signed Out!" , type :"SUCCESS"})
        },onError:(error : Error)=>{
            // show toast
            showToast({message:error.message , type:"ERROR"});

        }
    });

    const halndleClick = ()=>{
        mutation.mutate();
    }
    return(
        <button onClick = {halndleClick}className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">
            Sign Out
        </button>
    );
};

export default SignOutButton;