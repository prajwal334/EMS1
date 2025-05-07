import React from "react";
import { useAuth } from '../../context/authContext.jsx';

const Navbar = () => {
    const {user} = useAuth()
    return(
        <div className="flex items-center justify-between h-12 bg-blue-700 text-white px-5">
            <p>Welcome {user.name}</p>
            <button className='px-4 py-1 bg-blue-600 hover:bg-blue-800 rounded'>Logout</button>
        </div>
    )
}
export default Navbar;