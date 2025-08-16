import React, { useState } from "react";

const Search = ({ search, setSearch }) => {
  const [openSearch, setOpensearch] = useState(false);

  const cotigories = ["Всё", "Статьи", "Рассказы", "Посты"];
  const handleSearch = () => {};

  return (
    <div className="">
    
      {/* <input
        type="text"
        className="rounded-xl bg-[#d5e5f4] px-4 py-2 outline-none"
        placeholder="Поиск"
      /> */}
      
      
      <h3 className="!text-2xl text-center">Поиск</h3>
      <div className="justify-items-center rounded-xl shadow-2xl py-3">
        <div className="h-[300px] mt-5">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="bg-gray-100 py-2 px-4 rounded-2xl w-sm outline-none"
            placeholder="Поиск"
            // onFocus={()=> setOpensearch(openSearch)}
          />
          <div className="flex gap-7 mt-3 justify-center">
            {cotigories.map((item) => (
              <span
                key={item}
                className={`mb-4 cursor-pointer text-gray-500 hover:text-red-400 transition-all ${
                  cotigories === item ? "hover:text-blue-600" : ""
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
