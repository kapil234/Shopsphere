import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

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
    <div className="container mx-auto p-4">

  {data.length === 0 && !loading && (
    <p className="bg-white py-5 text-center">No Data</p>
  )}

  <div className="flex flex-col lg:flex-row gap-10">

    {/* LEFT SIDE - PRODUCTS */}
    <div className="w-full lg:w-2/3 space-y-4">

      {loading ? (
        loadingCart.map((_, index) => (
          <div
            key={index}
            className="h-40 bg-slate-200 animate-pulse rounded-xl"
          />
        ))
      ) : (
        validData.map((product) => {
          if (!product?.productId) return null;

          return (
            <div
              key={product._id}
              className="bg-white border rounded-xl p-5 flex gap-6 items-center"
            >
              {/* IMAGE */}
              <div className="w-40 h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                <img
                  src={product.productId.productImage?.[0]}
                  alt="product"
                  className="object-contain h-full"
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">
                  {product.productId.productName}
                </h2>

                <p className="text-sm text-slate-500 capitalize">
                  {product.productId.category}
                </p>

                <p className="text-slate-600 mt-2 text-sm">
                  {product.productId.description || "No description available"}
                </p>

                <div className="mt-3">
                  <p className="text-red-600 font-semibold text-xl">
                    {displayINRCurrency(product.productId.sellingPrice)}
                  </p>
                  <p className="text-slate-600 text-sm">
                    Total:{" "}
                    {displayINRCurrency(
                      product.productId.sellingPrice * product.quantity
                    )}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col justify-between items-end h-full">
                <button
                  onClick={() => deleteCartProduct(product._id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                >
                  <MdDelete />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decraseQty(product._id, product.quantity)}
                    className="w-9 h-9 border border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    −
                  </button>

                  <span className="text-lg font-medium">
                    {product.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(product._id, product.quantity)}
                    className="w-9 h-9 border border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white"
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

    {/* RIGHT SIDE - SUMMARY */}
    <div className="w-full lg:w-1/3">
      <div className="bg-white rounded-xl border p-5 sticky top-24">
        <h2 className="text-white bg-red-600 px-4 py-2 rounded">
          Summary
        </h2>

        <div className="flex justify-between mt-4 text-lg">
          <span>Quantity</span>
          <span>{totalQty}</span>
        </div>

        <div className="flex justify-between text-lg mt-2">
          <span>Total</span>
          <span>{displayINRCurrency(totalPrice)}</span>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg">
          Payment
        </button>
      </div>
    </div>

  </div>
</div>
    )}

export default Cart
