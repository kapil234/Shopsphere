import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(8).fill(null);

  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault(); // prevent link navigation
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 400;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 400;
  };

 return (
  <div className="w-full px-4 my-10 relative overflow-hidden">

    {/* Heading */}
    <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
      {heading}
    </h2>

    {/* Arrows */}
    <button
      onClick={scrollLeft}
      className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 items-center justify-center z-10"
    >
      <FaAngleLeft />
    </button>

    <button
      onClick={scrollRight}
      className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 items-center justify-center z-10"
    >
      <FaAngleRight />
    </button>

    {/* Scroll Container */}
    <div
      ref={scrollElement}
      className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
    >
      {data.map((product, index) => (
        <Link
          key={product?._id || index}
          to={"/product/" + product?._id}
          className="
            min-w-[48%]        /* 2 cards mobile */
            md:min-w-[45%]     /* 2 cards tablet */
            lg:min-w-[350px]   /* 3 clean cards desktop */
            bg-white rounded-2xl shadow-sm
            hover:shadow-lg transition
            flex flex-col lg:flex-row
            snap-start overflow-hidden
          "
        >
          {/* IMAGE */}
          <div className="
            h-40
            lg:h-auto
            lg:w-[45%]
            bg-gray-100
            flex items-center justify-center
          ">
            <img
              src={product?.productImage[0]}
              alt={product?.productName}
              className="h-full object-contain p-6 hover:scale-105 transition duration-300"
            />
          </div>

          {/* CONTENT */}
          <div className="p-5 flex flex-col justify-between flex-1">

            <div>
              <h2 className="text-base font-semibold">
                {product?.productName}
              </h2>

              <p className="text-sm text-gray-500 capitalize mt-1">
                {product?.category}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <p className="text-red-600 font-bold text-lg">
                  {displayINRCurrency(product?.sellingPrice)}
                </p>
                <p className="text-gray-400 text-sm line-through">
                  {displayINRCurrency(product?.price)}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => handleAddToCart(e, product?._id)}
              className="mt-5 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-full transition"
            >
              Add to Cart
            </button>

          </div>
        </Link>
      ))}
    </div>
  </div>
);}

export default HorizontalCardProduct;