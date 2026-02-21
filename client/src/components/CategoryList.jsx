import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct,setCategoryProduct] = useState([])
    const [loading,setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async() =>{
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
         
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }

    useEffect(()=>{
        fetchCategoryProduct()
    },[])

  return (
    <div className="w-full px-4 mx-auto py-3">
  {/* MOBILE = GRID | DESKTOP = SCROLL */}
  <div className="
    grid grid-cols-4 gap-3
    sm:grid-cols-5
    md:flex md:gap-4 md:overflow-x-auto md:scrollbar-none
  ">

    {loading ? (
      categoryLoading.map((_, index) => (
        <div
          key={"categoryLoading" + index}
          className="h-14 w-14 sm:h-16 sm:w-16 md:w-20 md:h-20 rounded-full bg-slate-200 animate-pulse"
        />
      ))
    ) : (
      categoryProduct.map((product) => (
        <Link
          to={"/product-category?category=" + product?.category}
          key={product?.category}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-slate-200 flex items-center justify-center p-2">
            <img
              src={product?.productImage[0]}
              alt={product?.category}
              className="h-full object-contain mix-blend-multiply hover:scale-110 transition"
            />
          </div>
          <p className="text-xs sm:text-sm capitalize text-center mt-1">
            {product?.category}
          </p>
        </Link>
      ))
    )}
  </div>
</div>
  )
}

export default CategoryList;