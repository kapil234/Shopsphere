import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole,setUserRole] = useState(role)

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value)
    }

    const updateUserRole = async() =>{
        const fetchResponse = await fetch(SummaryApi.updateUser.url,{
            method : SummaryApi.updateUser.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                userId : userId,
                role : userRole
            })
        })

        const responseData = await fetchResponse.json()

        if(responseData.success){
            toast.success(responseData.message)
            onClose()
            callFunc()
        }

        console.log("role updated",responseData)

    }

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-3">
  <div className="bg-white w-full max-w-sm rounded-md shadow p-4">

    {/* CLOSE */}
    <button onClick={onClose} className="ml-auto block text-gray-500">
      <IoMdClose size={20} />
    </button>

    {/* TITLE */}
    <h1 className="text-base font-semibold mb-3 text-center">
      Change User Role
    </h1>

    {/* INFO */}
    <p className="text-sm mb-1">
      <span className="font-medium">Name:</span> {name}
    </p>
    <p className="text-sm mb-3 break-all">
      <span className="font-medium">Email:</span> {email}
    </p>

    {/* ROLE */}
    <div className="mb-4">
      <label className="text-sm font-medium">Role</label>
      <select
        className="w-full border px-2 py-1 mt-1 rounded"
        value={userRole}
        onChange={handleOnChangeSelect}
      >
        {Object.values(ROLE).map((el) => (
          <option key={el} value={el}>
            {el}
          </option>
        ))}
      </select>
    </div>

    {/* BUTTON */}
    <button
      onClick={updateUserRole}
      className="w-full py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Change Role
    </button>

  </div>
</div>)}
export default ChangeUserRole;