import React, { useContext, useState } from 'react'
import shopsphere from "../assest/shopspher-logo.svg"

import { GrSearch } from "react-icons/gr"
import { FaRegCircleUser } from "react-icons/fa6"
import { FaShoppingCart } from "react-icons/fa"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Context from '../context'


const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
 // const [menuDisplay, setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()

  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.get("q") || ""
  const [search, setSearch] = useState(searchQuery)


  // ONLY update input value
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  // ONLY search on icon click
  const handleSearchClick = () => {
    if (search.trim()) {
      navigate(`/search?q=${search}`)
    }
  }

  return (
  <header className="h-14 sm:h-16 bg-white shadow-md sticky top-0 z-40">
    <div className="h-full w-full flex items-center justify-between px-3 sm:px-6 gap-3">

      {/* ================= LEFT : LOGO ================= */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img
          src={shopsphere}
          alt="ShopSphere"
          className="w-[80px] sm:w-[110px] md:w-[130px] h-auto"
        />
        <span className="hidden sm:block font-semibold text-lg md:text-xl text-gray-800">
          ShopSphere
        </span>
      </Link>

      {/* ================= CENTER : SEARCH ================= */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center w-full max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-lg border rounded-full overflow-hidden focus-within:shadow">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 py-1.5 text-sm sm:text-base outline-none"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            onClick={handleSearchClick}
            className="min-w-[36px] sm:min-w-[44px] bg-red-600 h-full flex items-center justify-center text-white"
          >
            <GrSearch />
          </button>
        </div>
      </div>

      {/* ================= RIGHT : USER / CART / LOGIN ================= */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">

        {/* USER ICON */}
        {user?._id && (
          
          <div className="relative">
            <div
              className="cursor-pointer"
              
            ><Link to="/user-details">
              {user?.profilePic ? (
                
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <FaRegCircleUser className="text-2xl" />
              )}</Link>
            </div>

            
          </div>
        )}

        {/* CART */}
        {user?._id && (
          <Link to="/cart" className="relative text-xl">
            <FaShoppingCart />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {context?.cartProductCount}
            </span>
          </Link>
        )}

        {/* LOGIN (HIDDEN AFTER LOGIN) */}
        {!user?._id && (
          <Link
            to="/login"
            className="px-2 py-1 sm:px-4 sm:py-1.5 text-sm sm:text-base rounded-full text-white bg-red-600 hover:bg-red-700"
          >
            Login
          </Link>
        )}

      </div>
    </div>
  </header>
)}
export default Header;