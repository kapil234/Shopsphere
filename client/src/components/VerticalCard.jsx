import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'

const VerticalCard = ({loading,data = []}) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }



  return (
    <div
      className="
        grid grid-cols-2 gap-3
        sm:grid-cols-2
        md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]
        md:gap-4
        px-2
      "
    >
      {loading ? (
        loadingList.map((_, index) => (
          <div
            key={index}
            className="bg-white rounded shadow"
          >
            <div className="bg-slate-200 h-40 p-4 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
              <div className="flex gap-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-full" />
              </div>
              <div className="h-8 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))
      ) : (
        data.map((product) => (
          <Link
            key={product?._id}
            to={`/product/${product?._id}`}
            onClick={scrollTop}
            className="bg-white rounded shadow"
          >
            {/* IMAGE */}
            <div className="bg-slate-200 h-36 sm:h-40 p-3 flex items-center justify-center">
              <img
                src={product?.productImage[0]}
                alt={product?.productName}
                className="h-full w-full object-contain mix-blend-multiply hover:scale-105 transition"
              />
            </div>

            {/* INFO */}
            <div className="p-3 space-y-1">
              <h2 className="font-medium text-xs sm:text-sm line-clamp-1 text-black">
                {product?.productName}
              </h2>

              <p className="text-[11px] sm:text-xs capitalize text-slate-500">
                {product?.category}
              </p>

              <div className="flex gap-2 items-center">
                <p className="text-red-600 font-medium text-xs sm:text-sm">
                  {displayINRCurrency(product?.sellingPrice)}
                </p>
                <p className="text-slate-500 line-through text-xs">
                  {displayINRCurrency(product?.price)}
                </p>
              </div>

              <button
                className="w-full text-xs bg-red-600 hover:bg-red-700 text-white py-1 rounded-full mt-1"
                onClick={(e) => handleAddToCart(e, product?._id)}
              >
                Add to Cart
              </button>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};



export default VerticalCard;