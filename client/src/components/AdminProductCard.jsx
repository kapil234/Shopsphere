import React, { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";
import displayINRCurrency from "../helpers/displayCurrency";

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);

  return (
    <>
      <div className="bg-white rounded shadow p-3 flex flex-col">
        {/* IMAGE */}
        <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded">
          <img
            src={data?.productImage?.[0]}
            alt={data?.productName}
            className="h-full object-contain"
          />
        </div>

        {/* NAME */}
        <h1 className="mt-2 text-sm font-medium line-clamp-2">
          {data.productName}
        </h1>

        {/* PRICE */}
        <p className="mt-1 text-sm font-semibold">
          {displayINRCurrency(data.sellingPrice)}
        </p>

        {/* EDIT BUTTON (ALWAYS BOTTOM) */}
        <div className="mt-auto flex justify-end pt-2">
          <button
            onClick={() => setEditProduct(true)}
            className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white transition"
          >
            <MdModeEditOutline />
          </button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </>
  );
};

export default AdminProductCard;