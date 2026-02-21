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
  <div className="w-full px-4 mx-auto p-4">
    <div
      className="
        grid
        grid-cols-6            /* Mobile: exactly 6 items per row */
           /* Tablet+: flow horizontally */
        md:grid-cols-[repeat(auto-fit,minmax(80px,1fr))]
        gap-4
        justify-items-center
      "
    >
      {loading
        ? categoryLoading.map((_, index) => (
            <div
              key={"categoryLoading" + index}
              className="h-14 w-14 md:w-20 md:h-20 rounded-full bg-slate-200 animate-pulse mx-auto"
            />
          ))
        : categoryProduct.map((product) => (
            <Link
              key={product?.category}
              to={"/product-category?category=" + product?.category}
              className="cursor-pointer text-center"
            >
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full p-3 bg-slate-200 flex items-center justify-center mx-auto">
                <img
                  src={product?.productImage[0]}
                  alt={product?.category}
                  className="h-full object-scale-down mix-blend-multiply hover:scale-110 transition-all"
                />
              </div>
              <p className="text-[10px] md:text-base capitalize mt-1">
                {product?.category}
              </p>
            </Link>
          ))}
    </div>
  </div>
);}

export default CategoryList;