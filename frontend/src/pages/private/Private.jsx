import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import Unauthorized from "../Unauthorized"

const Private = () => {
    const [ok , setOk] = useState(false)
    const {token} = useSelector((state) => state.auth)
    useEffect(() => {
        if(token){
            setOk(true)
        }else{
            setOk(false)
        }
    },[])
  return ok ? (<Outlet/>) : (
    <Unauthorized/>
  )
}

export default Private