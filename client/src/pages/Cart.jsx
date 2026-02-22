import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { Navigate, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)
    const navigate=useNavigate();

    const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: 'include',
        headers: {
            "content-type": 'application/json'
        },
    });

    const responseData = await response.json();

    if (responseData.success) {
        // filter out any null or deleted products
        const filteredData = responseData.data.filter(item => item.productId !== null);
        setData(filteredData);

        // update cart count in context
        if (context?.setCartProductCount) {
            const totalCount = filteredData.reduce((acc, item) => acc + item.quantity, 0);
            context.setCartProductCount(totalCount);
        }
    } else {
        // If API fails, set cart to 0
        setData([]);
        context?.setCartProductCount(0);
    }
};

    const handleLoading = async() =>{
        await fetchData()
        context.fetchUserAddToCart();
    }

    useEffect(()=>{
        setLoading(true)
        handleLoading()
        setLoading(false)
    },[])

    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify({ _id : id, quantity : qty + 1 })
        })
        const responseData = await response.json()
        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()

        }
    }

    const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify({ _id : id, quantity : qty - 1 })
            })
            const responseData = await response.json()
            if(responseData.success){
                fetchData()
                context.fetchUserAddToCart()
            }
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify({ _id : id })
        })

        const responseData = await response.json()
        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }
const validData = data.filter(item => item.productId !== null);
    const totalQty = validData.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = validData.reduce((preve,curr)=> preve + ((curr?.productId?.sellingPrice || 0) * curr.quantity) ,0)

    return (

  <div className="w-full px-4">

    {data.length === 0 && !loading && (
      <p className="bg-white py-4 text-center rounded-lg">No Data</p>
    )}

    <div className="flex flex-col lg:flex-row gap-4">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-2/3 space-y-3">

        {loading ? (
          loadingCart.map((_, index) => (
            <div
              key={index}
              className="h-24 bg-slate-200 animate-pulse rounded-lg"
            />
          ))
        ) : (
          validData.map((product) => {
            if (!product?.productId) return null;

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product.productId._id}`)}
                className="bg-white border rounded-xl p-3 flex items-center gap-3 shadow-sm"
              >
                {/* IMAGE */}
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={product.productId.productImage?.[0]}
                    alt="product"
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 leading-tight">
                  <h2 className="text-sm font-semibold line-clamp-1">
                    {product.productId.productName}
                  </h2>

                  <p className="text-xs text-slate-500 capitalize">
                    {product.productId.category}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {product.productId.description || "No description available"}
                  </p>

                  <p className="text-red-600 font-semibold text-sm mt-1">
                    {displayINRCurrency(product.productId.sellingPrice)}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Total:{" "}
                    {displayINRCurrency(
                      product.productId.sellingPrice * product.quantity
                    )}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={(e) =>{ 
                       e.stopPropagation()
                       deleteCartProduct(product._id)}}
                    className="text-red-600 text-sm"
                  >
                    <MdDelete />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) =>{
                         e.stopPropagation()
                          decraseQty(product._id, product.quantity)}}
                      className="w-6 h-6 border border-red-600 rounded text-red-600 text-sm"
                    >
                      −
                    </button>

                    <span className="text-sm">{product.quantity}</span>

                    <button
                      onClick={(e) => {
                         e.stopPropagation()
                         increaseQty(product._id, product.quantity)}}
                      className="w-6 h-6 border border-red-600 rounded text-red-600 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl border p-4 sticky top-24 shadow-sm">
          <h2 className="text-white bg-red-600 px-3 py-1 rounded text-sm text-center">
            Summary
          </h2>

          <div className="flex justify-between mt-3 text-sm">
            <span>Quantity</span>
            <span>{totalQty}</span>
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span>Total</span>
            <span>{displayINRCurrency(totalPrice)}</span>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg text-sm">
            Payment
          </button>
        </div>
      </div>

    </div>
  </div>
);}

    


export default Cart
