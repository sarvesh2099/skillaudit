import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

import React from 'react'

const Protected = ({children}) => {
    const {loading,user} = useAuth()

    if(loading){
        return( <nmain><h1>Loading...</h1></nmain>
        )}

    if(!user){
        return <Navigate to="/login" />
    }    
  return (
    children
  )
}

export default Protected
