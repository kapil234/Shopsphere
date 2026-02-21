import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();

    setAllProduct(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  return (
    <div className="h-full">
      {/* HEADER */}
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">All Product</h2>

        <button
          onClick={() => setOpenUploadProduct(true)}
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full text-sm"
        >
          Upload Product
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          p-3
          h-[calc(100vh-190px)]
          overflow-y-auto

          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {allProduct.map((product, index) => (
          <AdminProductCard
            key={index + "allProduct"}
            data={product}
            fetchdata={fetchAllProduct}
          />
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchdata={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;