import React from "react";

const TegBar = () => {
  return (
    <div className="contain-content border-black">
      <div className="p-5 flex gap-4">
        {["AI", "Sport", "Movie", "Future"].map((item) => (
          <button className="bg-white py-1 px-2 rounded-3xl hover:bg-gray-100">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TegBar;
