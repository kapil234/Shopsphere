import React, { useState } from "react";
import {  useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from '../Store/userSlice'

const UserDetails = () => {
const dispatch=useDispatch();
  const user = useSelector((state) => state?.user?.user);

   const [openImage, setOpenImage] = useState(false);
   const navigate=useNavigate();

const handleLogout=()=>{
    dispatch(setUserDetails(null))
    navigate("/")
}
const handleAdmin=()=>{
    navigate("/admin-panel/all-products")
}
  

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
  <div className="px-4"> {/* prevents touching screen edges */}
    <div className="max-w-md mx-auto mt-10 bg-white shadow-2xl rounded-2xl p-6 border">

      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <img
          onClick={() => setOpenImage(true)}
          src={user?.profilePic}
          alt={user?.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 cursor-pointer hover:scale-105 transition"
        />
      </div>

      {/* User Info */}
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b">
            <td className="py-3 font-semibold text-gray-600">Name</td>
            <td className="py-3 text-right">{user?.name}</td>
          </tr>

          <tr className="border-b">
            <td className="py-3 font-semibold text-gray-600">Email</td>
            <td className="py-3 text-right">{user?.email}</td>
          </tr>

          <tr>
            <td className="py-3 font-semibold text-gray-600">Role</td>
            <td className="py-3 text-right capitalize">{user?.role?.toLowerCase() === "admin" ? (
  <button onClick={handleAdmin} className="px-3 py-1 bg-blue-600 text-white rounded-lg">
    Admin
  </button>
) : (
  <p>General</p>
)}</td>
          </tr>
        </tbody>
      </table>

      {/* Logout Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLogout}
          className="px-6 py-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>

    {/* Image Modal */}
    {openImage && (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={() => setOpenImage(false)}
      >
        <img
          src={user?.profilePic}
          alt="Full"
          className="max-h-[85%] max-w-[90%] rounded-xl shadow-2xl"
        />
      </div>
    )}
  </div>
);
    
};

export default UserDetails;