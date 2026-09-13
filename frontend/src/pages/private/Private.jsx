import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import Unauthorized from "../Unauthorized"

const Private = () => {
    const { user } = useSelector((state) => state.auth)
  return user ? (<Outlet/>) : (
    <Unauthorized/>
  )
}

export default Private
