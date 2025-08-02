import React, { useState } from "react";

const Search = ({story}) => {
  const [search, setSearch] = useState("");

const handleSearch = ()=>{

}


  return (
    <div className="max-w-screen max-auto m-2 pt-24">
      <h3 className="!text-2xl text-center">Поиск</h3>
      <div className="justify-items-center rounded-xl shadow-2xl py-3">
        <div className="h-[300px]">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="bg-gray-100 py-2 px-4 rounded-2xl w-sm outline-none"
            placeholder="Поиск"
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
