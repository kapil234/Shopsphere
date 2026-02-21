import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Get category from URL
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");

  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(
    urlCategoryListObject
  );
  const [filterCategoryList, setFilterCategoryList] = useState([]);

  // Fetch Products
  const fetchData = async (categories) => {
    try {
      setLoading(true);

      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          category: categories,
        }),
      });

      const dataResponse = await response.json();
      setData(dataResponse?.data || []);
    } catch (error) {
      console.log("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category checkbox
  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;

    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  // Update filter category list when checkbox changes
  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .filter((key) => selectCategory[key]);

    setFilterCategoryList(arrayOfCategory);

    // Update URL
    const queryParams = new URLSearchParams();
    arrayOfCategory.forEach((cat) =>
      queryParams.append("category", cat)
    );

    navigate(`/product-category?${queryParams.toString()}`);
  }, [selectCategory]);

  // Fetch products when category changes
  useEffect(() => {
    fetchData(filterCategoryList);
  }, [filterCategoryList]);

  // Handle sorting
  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    if (value === "asc") {
      setData((prev) =>
        [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice)
      );
    }

    if (value === "dsc") {
      setData((prev) =>
        [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice)
      );
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* FILTER SIDEBAR */}
        <aside className="md:w-64 w-full bg-white p-5 border rounded-xl shadow-sm md:sticky md:top-24 h-fit">
          
          {/* SORT */}
          <h3 className="text-sm font-semibold uppercase text-gray-500 border-b pb-2">
            Sort By
          </h3>

          <form className="text-sm flex flex-col gap-3 py-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value="asc"
                checked={sortBy === "asc"}
                onChange={handleOnChangeSortBy}
                className="accent-red-600"
              />
              Price - Low to High
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value="dsc"
                checked={sortBy === "dsc"}
                onChange={handleOnChangeSortBy}
                className="accent-red-600"
              />
              Price - High to Low
            </label>
          </form>

          {/* CATEGORY */}
          <h3 className="text-sm font-semibold uppercase text-gray-500 border-b pb-2 mt-4">
            Category
          </h3>

          <form className="text-sm flex flex-col gap-3 py-4 max-h-60 overflow-y-auto">
            {productCategory.map((cat, index) => (
              <label
                key={cat?.value || index}
                className="flex items-center gap-3 cursor-pointer hover:text-red-600 transition"
              >
                <input
                  type="checkbox"
                  value={cat?.value}
                  checked={selectCategory[cat?.value] || false}
                  onChange={handleSelectCategory}
                  className="accent-red-600"
                />
                {cat?.label}
              </label>
            ))}
          </form>
        </aside>

        {/* PRODUCT SECTION */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-5">
            <p className="font-semibold text-gray-800 text-base md:text-lg">
              Search Results: {data.length}
            </p>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading products...
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No products found
            </div>
          )}

          {!loading && data.length > 0 && (
            <VerticalCard data={data} loading={loading} />
          )}
        </main>

      </div>
    </div>
  );
};

export default CategoryProduct;