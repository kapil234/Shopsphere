import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {
    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // get real search value like: ?q=phone
    const searchParams = new URLSearchParams(query.search)
    const searchValue = searchParams.get("q")   // must match your URL key

    const fetchProduct = async () => {
        setLoading(true)
        const response = await fetch(
          SummaryApi.searchProduct.url + `?q=${searchValue}`
        )
        const dataResponse = await response.json()
        setLoading(false)
        setData(dataResponse.data || [])
    }

    useEffect(() => {
        if (searchValue) {
            fetchProduct()
        }
    }, [searchValue])

    return (
      <div className='container mx-auto p-4'>
        {loading && (
          <p className='text-lg text-center'>Loading ...</p>
        )}

        <p className='text-lg font-semibold my-3'>
          Search Results : {data.length}
        </p>

        {data.length === 0 && !loading && searchValue && (
          <p className='bg-white text-lg text-center p-4'>
            No Data Found....
          </p>
        )}

        {data.length !== 0 && !loading && (
          <VerticalCard loading={loading} data={data}/>
        )}
      </div>
    )
}

export default SearchProduct
