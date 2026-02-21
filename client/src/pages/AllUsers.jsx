import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser,setAllUsers] = useState([])
    const [openUpdateRole,setOpenUpdateRole] = useState(false)
    const [updateUserDetails,setUpdateUserDetails] = useState({
        email : "",
        name : "",
        role : "",
        _id  : ""
    })

    const fetchAllUsers = async() =>{
        const fetchData = await fetch(SummaryApi.allUser.url,{
            method : SummaryApi.allUser.method,
            credentials : 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success){
            setAllUsers(dataResponse.data)
        }

        if(dataResponse.error){
            toast.error(dataResponse.message)
        }

    }

    useEffect(()=>{
        fetchAllUsers()
    },[])

  return (
     <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">All Users</h2>
        <p className="text-sm text-gray-500">Total: {allUser.length}</p>
      </div>

      {/* ================= TABLE (DESKTOP) ================= */}
   <div className="hidden md:block overflow-x-auto">
  <table className="w-full border-collapse table-fixed">
    <thead>
      <tr className="bg-black text-white text-sm">
        <th className="p-3 text-left w-12">Sr.</th>
        <th className="p-3 text-left w-1/5">Name</th>
        <th className="p-3 text-left w-2/5">Email</th>
        <th className="p-3 text-left w-24">Role</th>
        <th className="p-3 text-left w-36">Created</th>
        <th className="p-3 text-center w-20">Action</th>
      </tr>
    </thead>

    <tbody>
      {allUser.map((el, index) => (
        <tr
          key={el._id || index}
          className="border-b hover:bg-gray-50 text-sm"
        >
          <td className="p-3 text-left align-top">
            {index + 1}
          </td>

          <td className="p-3 text-left align-top font-medium break-words">
            {el.name}
          </td>

          <td className="p-3 text-left align-top break-all">
            {el.email}
          </td>

          <td className="p-3 text-left align-top">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium
                ${
                  el.role === "ADMIN"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              {el.role}
            </span>
          </td>

          <td className="p-3 text-left align-top">
            {moment(el.createdAt).format("LL")}
          </td>

          <td className="p-3 text-center align-top">
            <button
              onClick={() => {
                setUpdateUserDetails(el);
                setOpenUpdateRole(true);
              }}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-500 hover:text-white transition"
            >
              <MdModeEdit />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* ================= CARDS (MOBILE) ================= */}
     <div className="md:hidden space-y-4">
  {allUser.map((el, index) => (
    <div
      key={el._id || index}
      className="border rounded-xl p-4 bg-white shadow-sm"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-gray-900 leading-snug break-words">
            {el.name}
          </h3>

          <p className="text-sm text-gray-500 break-all mt-0.5">
            {el.email}
          </p>
        </div>

        <button
          onClick={() => {
            setUpdateUserDetails(el);
            setOpenUpdateRole(true);
          }}
          className="shrink-0 p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-500 hover:text-white transition"
        >
          <MdModeEdit />
        </button>
      </div>

      {/* BOTTOM */}
      <div className="flex items-center justify-between mt-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${
              el.role === "ADMIN"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
        >
          {el.role}
        </span>

        <p className="text-xs text-gray-400">
          {moment(el.createdAt).format("DD MMM YYYY")}
        </p>
      </div>
    </div>
  ))}
</div>


        {
            openUpdateRole && (
                <ChangeUserRole 
                    onClose={()=>setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )      
        }
    </div>
  )
}

export default AllUsers