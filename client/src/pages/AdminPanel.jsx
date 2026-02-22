import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";


const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);

  const [open, setOpen] = useState(false);



  // Lock body scroll when sidebar is open (mobile)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <div className="flex bg-gray-100 min-h-[100dvh]">
      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow flex items-center justify-between px-3 z-50">
        <button onClick={() => setOpen(prev => !prev)}>
          <FiMenu className="text-2xl" />
        </button>

        <p className="font-semibold">Admin Panel</p>

        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaRegCircleUser className="text-xl" />
        )}
      </header>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-blur backdrop-blur-md bg-opacity-40 z-30 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed md:static top-14 md:top-0 left-0
        h-[calc(100dvh-3.5rem)] md:h-auto w-60 bg-white shadow-md z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Profile */}
        <div className="h-32 flex flex-col items-center justify-center border-b">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <FaRegCircleUser className="text-4xl" />
          )}
          <p className="font-semibold mt-1">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          <Link
            to="all-users"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded hover:bg-blue-100"
          >
            All Users
          </Link>

          <Link
            to="all-products"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded hover:bg-blue-100"
          >
            All Products
          </Link>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 mt-5 md:mt-0 px-3 pb-3 md:p-3">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;