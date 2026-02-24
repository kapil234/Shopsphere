import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get category from URL
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryList = urlSearch.getAll("category");

  const initialCategoryObject = {};
  urlCategoryList.forEach((el) => {
    initialCategoryObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(
    initialCategoryObject
  );

  // ================= FETCH PRODUCTS =================
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
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE CATEGORY SELECT =================
  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;

    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  // ================= HANDLE SORT =================
  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);

    setData((prev) => {
      const sorted = [...prev];

      if (value === "asc") {
        sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
      }

      if (value === "dsc") {
        sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
      }

      return sorted;
    });
  };

  // ================= MAIN EFFECT =================
  useEffect(() => {
    const selected = Object.keys(selectCategory).filter(
      (key) => selectCategory[key]
    );

    // Update URL
    const queryParams = new URLSearchParams();
    selected.forEach((cat) => {
      queryParams.append("category", cat);
    });

    navigate(`/product-category?${queryParams.toString()}`, {
      replace: true,
    });

    // Fetch only if category exists
    if (selected.length > 0) {
      fetchData(selected);
    } else {
      setData([]);
    }
  }, [selectCategory]);
  return (
    <div className="w-full px-4 md:px-8 py-6">
  <div className="flex flex-col md:flex-row gap-6">

    {/* ================= MOBILE FILTER BUTTON ================= */}
    <div className="md:hidden flex justify-between items-center">
      <p className="font-semibold text-gray-800">
        Search Results: {data.length}
      </p>

      <button
        onClick={() => setOpenFilter(true)}
        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
      >
        Filter
      </button>
    </div>

    {/* ================= DESKTOP SIDEBAR ================= */}
    <aside className="hidden md:block md:w-64 bg-white p-5 border rounded-xl shadow-sm sticky top-24 h-fit">

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
            className="flex items-center gap-3 cursor-pointer hover:text-red-600"
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

    {/* ================= PRODUCT SECTION ================= */}
    <main className="flex-1">

      {/* Desktop result count */}
      <div className="hidden md:flex justify-between items-center mb-5">
        <p className="font-semibold text-gray-800 text-lg">
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

  {/* ================= MOBILE FILTER PANEL ================= */}
 {openFilter && (
  <div className="fixed inset-0 z-50 md:hidden">

    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setOpenFilter(false)}
    />

    {/* COMPACT FILTER PANEL */}
    <div
      className="
       absolute top-15 left-1/2 -translate-x-1/2
    w-[92%] max-w-sm
    bg-white
    rounded-xl
    h-[45vh]
    flex flex-col
    shadow-xl"
    
    >

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button
          onClick={() => setOpenFilter(false)}
          className="text-xs text-red-600"
        >
          Close
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-2 text-xs">

        {/* SORT */}
        <p className="text-[11px] font-semibold text-gray-500 border-b pb-1 text-center">
          SORT BY
        </p>

        <form className="flex flex-col gap-2 py-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="asc"
              checked={sortBy === "asc"}
              onChange={handleOnChangeSortBy}
              className="accent-red-600 scale-90"
            />
            Price - Low to High
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="dsc"
              checked={sortBy === "dsc"}
              onChange={handleOnChangeSortBy}
              className="accent-red-600 scale-90"
            />
            Price - High to Low
          </label>
        </form>

        {/* CATEGORY */}
        <p className="text-[11px] font-semibold text-gray-500 border-b pb-1 mt-2 text-center">
          CATEGORY
        </p>

        <form className="flex flex-col gap-2 py-2">
          {productCategory.map((cat, index) => (
            <label
              key={cat?.value || index}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                value={cat?.value}
                checked={selectCategory[cat?.value] || false}
                onChange={handleSelectCategory}
                className="accent-red-600 scale-90"
              />
              {cat?.label}
            </label>
          ))}
        </form>
      </div>

      {/* FOOTER */}
      <div className="border-t px-4 py-2">
        <button
          onClick={() => setOpenFilter(false)}
          className="w-full bg-red-600 text-white text-xs py-2 rounded-md"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
)}
</div>

  )}
export default CategoryProduct;