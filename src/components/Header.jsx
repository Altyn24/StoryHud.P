import React from "react";
import { Input } from "antd";
// import { useAuthStore } from "../firebase/store/authStore";

const Header = () => {
  return (
    <header className="flex justify-between p-2 mb-5 border-b-1 border-gray-300">
      <div className="flex gap-6">
        <div className="text-3xl font-bold">StoryHub</div>
        <Input placeholder="Поиск" />
      </div>
      <div className="rounded-xl bg-gray-400">Profile</div>
    </header>
  );
};

export default Header;
