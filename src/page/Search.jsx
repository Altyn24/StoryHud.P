import React, { useState } from "react";

const Search = ({ story }) => {
  const [search, setSearch] = useState("");
  const cotigories = ["Всё", "Статьи", "Рассказы", "Сценарии"];

  const handleSearch = () => {};

  return (
    <div className="max-auto m-2 pt-24">
      <h3 className="!text-2xl text-center">Поиск</h3>
      <div className="justify-items-center rounded-xl shadow-2xl py-3">
        <div className="h-[300px] mt-5">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="bg-gray-100 py-2 px-4 rounded-2xl w-sm outline-none"
            placeholder="Поиск"
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

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <input type="checkbox" />
              Ужасы
            </div>
            <div>
              <input type="checkbox" />
              Фантастика
            </div>
            <div>
              <input type="checkbox" />
              Детектив
            </div>
            <div>
              <input type="checkbox" />
              Роман
            </div>
            <div>
              <input type="checkbox" />
              Романтика
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
