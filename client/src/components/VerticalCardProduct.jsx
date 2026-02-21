import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const VerticalCardProduct = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    const [scroll,setScroll] = useState(0)
    const scrollElement = useRef()

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }

    const fetchData = async() =>{
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        console.log("horizontal data",categoryProduct.data)
        setData(categoryProduct?.data)
    }

    useEffect(()=>{
        fetchData()
    },[])

    const scrollRight = () =>{
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () =>{
        scrollElement.current.scrollLeft -= 300
    }


  return (
  <div className="w-full px-3 my-6 relative">

    {/* Heading */}
    <h2 className="text-lg md:text-2xl font-semibold mb-4">
      {heading}
    </h2>

    {/* Desktop Arrows */}
    <button
      onClick={scrollLeft}
      className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-9 h-9 items-center justify-center z-10"
    >
      <FaAngleLeft />
    </button>

    <button
      onClick={scrollRight}
      className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-9 h-9 items-center justify-center z-10"
    >
      <FaAngleRight />
    </button>

    {/* Scroll Container */}
    <div
      ref={scrollElement}
      className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none"
    >
      {loading
        ? loadingList.map((_, index) => (
            <div
              key={index}
              className="min-w-[48%] md:min-w-[300px] bg-white rounded-xl shadow-sm p-3 snap-start"
            >
              <div className="h-36 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="mt-3 h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-2 h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
              <div className="mt-3 h-8 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
          ))
        : data.map((product, index) => (
            <Link
              key={product?._id || index}
              to={"product/" + product?._id}
              className="min-w-[48%] md:min-w-[300px] bg-white rounded-xl shadow-sm hover:shadow-md transition snap-start flex flex-col"
            >
              {/* Image Section */}
              <div className="h-36 bg-gray-100 rounded-t-xl flex items-center justify-center p-3">
                <img
                  src={product?.productImage[0]}
                  alt={product?.productName}
                  className="h-full object-contain hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col flex-1">
                <h2 className="text-sm font-medium text-gray-800 line-clamp-1">
                  {product?.productName}
                </h2>

                <p className="text-xs text-gray-500 capitalize">
                  {product?.category}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-red-600 font-semibold text-sm">
                    {displayINRCurrency(product?.sellingPrice)}
                  </p>
                  <p className="text-gray-400 text-xs line-through">
                    {displayINRCurrency(product?.price)}
                  </p>
                </div>

                <button
                  onClick={(e) =>
                    handleAddToCart(e, product?._id)
                  }
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded-full transition"
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
    </div>
  </div>
);}
export default VerticalCardProduct;