import Item from "antd/es/list/Item";
import React, { useState } from "react";

const Profile = () => {
  const { home, setHome } = useState();

  const button = ["Home", "About"];

  return (
    <div className="max-w-screen h-screen justify-items-center">
      <div className="border-b-2 border-gray-300 w-[670px] mb-5">
        <div className="flex justify-between">
          <h1 className="text-4xl">Name: name</h1>
          <span className="text-5xl">...</span>
        </div>
        <div className="flex gap-5">
          {button.map((item) => (
            <p
              key={item}
              onClick={() => setHome(item)}
              className="hover:underline"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
      <div className="text-2xl">
        Reading List
        <div className="bg-gray-200 ">
          <p>Список историй</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
