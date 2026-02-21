import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import {toast} from 'react-toastify'

const UploadProduct = ({
    onClose,
    fetchData
}) => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    sellingPrice : ""
  })
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
  const [fullScreenImage,setFullScreenImage] = useState("")


  const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
        return{
          ...preve,
          [name]  : value
        }
      })
  }

  const handleUploadProduct = async(e) => {
    const file = e.target.files[0]
    const uploadImageCloudinary = await uploadImage(file)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [ ...preve.productImage, uploadImageCloudinary]
      }
    })
  }

  const handleDeleteProductImage = async(index)=>{
    console.log("image index",index)
    
    const newProductImage = [...data.productImage]
    newProductImage.splice(index,1)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [...newProductImage]
      }
    })
    
  }


  {/**upload product */}
  const handleSubmit = async(e) =>{
    e.preventDefault()
    
    const response = await fetch(SummaryApi.uploadProduct.url,{
      method : SummaryApi.uploadProduct.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(data)
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData?.message)
        onClose()
        fetchData()
    }


    if(responseData.error){
      toast.error(responseData?.message)
    }
  

  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-3">
  <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden">

    {/* HEADER */}
    <div className="relative flex items-center px-4 py-3 border-b bg-white">
  {/* Center title */}
  <h2 className="absolute left-1/2 -translate-x-1/2 font-semibold text-lg">
    Upload Product
  </h2>

  {/* Close button */}
  <button
    onClick={onClose}
    className="ml-auto text-2xl hover:text-red-600 transition"
  >
    <CgClose />
  </button>
</div>

    {/* FORM */}
    <form
      onSubmit={handleSubmit}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
    >
      {/* Product Name */}
      <div>
        <label className="text-sm font-medium">Product Name</label>
        <input
          type="text"
          name="productName"
          value={data.productName}
          onChange={handleOnChange}
          placeholder="Enter product name"
          className="mt-1 w-full p-2 bg-slate-100 border rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          required
        />
      </div>

      {/* Brand */}
      <div>
        <label className="text-sm font-medium">Brand Name</label>
        <input
          type="text"
          name="brandName"
          value={data.brandName}
          onChange={handleOnChange}
          placeholder="Enter brand name"
          className="mt-1 w-full p-2 bg-slate-100 border rounded focus:outline-none focus:ring-1 focus:ring-red-500"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          name="category"
          value={data.category}
          onChange={handleOnChange}
          className="mt-1 w-full p-2 bg-slate-100 border rounded"
          required
        >
          <option value="">Select Category</option>
          {productCategory.map((el, index) => (
            <option key={el.value + index} value={el.value}>
              {el.label}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium">Product Images</label>

        <label htmlFor="uploadImageInput">
          <div className="mt-1 h-32 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition">
            <FaCloudUploadAlt className="text-4xl text-gray-400" />
            <p className="text-sm text-gray-500 mt-1">
              Click to upload images
            </p>
          </div>
        </label>

        <input
          type="file"
          id="uploadImageInput"
          className="hidden"
          onChange={handleUploadProduct}
        />

        {/* Thumbnails */}
        {data.productImage.length > 0 ? (
          <div className="flex gap-2 mt-3 flex-wrap">
            {data.productImage.map((el, index) => (
              <div key={index} className="relative group">
                <img
                  src={el}
                  className="w-20 h-20 object-cover rounded border cursor-pointer"
                  onClick={() => {
                    setOpenFullScreenImage(true);
                    setFullScreenImage(el);
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleDeleteProductImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-red-600 mt-1">
            * Please upload at least one image
          </p>
        )}
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={handleOnChange}
            className="mt-1 w-full p-2 bg-slate-100 border rounded"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Selling Price</label>
          <input
            type="number"
            name="sellingPrice"
            value={data.sellingPrice}
            onChange={handleOnChange}
            className="mt-1 w-full p-2 bg-slate-100 border rounded"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleOnChange}
          rows={4}
          className="mt-1 w-full p-2 bg-slate-100 border rounded resize-none"
        />
      </div>

      {/* SUBMIT */}
      <div className="sticky bottom-0 bg-white pt-3">
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Upload Product
        </button>
      </div>
    </form>
  </div>

  {/* FULL SCREEN IMAGE */}
  {openFullScreenImage && (
    <DisplayImage
      onClose={() => setOpenFullScreenImage(false)}
      imgUrl={fullScreenImage}
    />
  )}
</div>)}
export default UploadProduct;