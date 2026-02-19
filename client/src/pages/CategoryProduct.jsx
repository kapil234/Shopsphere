import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
    const [data,setData] = useState([])
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el =>{
      urlCategoryListObject[el] = true
    })

    const [selectCategory,setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList,setFilterCategoryList] = useState([])

    const [sortBy,setSortBy] = useState("")

    const fetchData = async()=>{
      const response = await fetch(SummaryApi.filterProduct.url,{
        method : SummaryApi.filterProduct.method,
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify({
          category : filterCategoryList
        })
      })

      const dataResponse = await response.json()
      setData(dataResponse?.data || [])
    }

    const handleSelectCategory = (e) =>{
      const {name , value, checked} =  e.target

      setSelectCategory((preve)=>{
        return{
          ...preve,
          [value] : checked
        }
      })
    }

    useEffect(()=>{
      fetchData()
    },[filterCategoryList])

    useEffect(()=>{
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName =>{
        if(selectCategory[categoryKeyName]){
          return categoryKeyName
        }
        return null
      }).filter(el => el)

      setFilterCategoryList(arrayOfCategory)

      //format for url change when change on the checkbox
      const urlFormat = arrayOfCategory.map((el,index) => {
        if((arrayOfCategory.length - 1 ) === index  ){
          return `category=${el}`
        }
        return `category=${el}&&`
      })

      navigate("/product-category?"+urlFormat.join(""))
    },[selectCategory])


    const handleOnChangeSortBy = (e)=>{
      const { value } = e.target

      setSortBy(value)

      if(value === 'asc'){
        setData(preve => preve.sort((a,b)=>a.sellingPrice - b.sellingPrice))
      }

      if(value === 'dsc'){
        setData(preve => preve.sort((a,b)=>b.sellingPrice - a.sellingPrice))
      }
    }

    useEffect(()=>{

    },[sortBy])
    
  return (
  <div className="container mx-auto px-4 py-6">
    <div className="flex gap-6">

      {/* LEFT SIDE */}
      <aside className="w-60 bg-white p-4 border rounded-lg h-fit sticky top-24">
        
        <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-2">
          Sort by
        </h3>

        <form className="text-sm flex flex-col gap-2 py-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              value="asc"
              checked={sortBy === "asc"}
              onChange={handleOnChangeSortBy}
            />
            Price - Low to High
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              value="dsc"
              checked={sortBy === "dsc"}
              onChange={handleOnChangeSortBy}
            />
            Price - High to Low
          </label>
        </form>

        <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-2 mt-4">
          Category
        </h3>

        <form className="text-sm flex flex-col gap-2 py-3">
          {productCategory.map((cat, index) => (
            <label key={cat?.value || index} className="flex items-center gap-3">
              <input
                type="checkbox"
                value={cat?.value}
                checked={selectCategory[cat?.value] || false}
                onChange={handleSelectCategory}
              />
              {cat?.label}
            </label>
          ))}
        </form>
      </aside>

      {/* RIGHT SIDE */}
      <main className="flex-1">
        <p className="font-medium text-slate-800 text-lg mb-4">
          Search Results : {data.length}
        </p>

        {loading && <p>Loading...</p>}
        {!loading && data.length === 0 && <p>No products found</p>}
        {!loading && data.length > 0 && (
          <VerticalCard data={data} loading={loading} />
        )}
      </main>

    </div>
  </div>
);
}
export default CategoryProduct;