import React from "react";
import { getImage } from "../components/getImage.js";
import { Link } from "react-router-dom";

const StoryCards = ({ story }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 hover:bg-gray-50 transition">
      {/* <div className="flex"> */}
      <div className="flex items-center mb-2 justify-between">
        <Link to={"/profile"} className="flex gap-4 items-center">
          <img
            src={story.authorPhoto || "https://i.pravatar.cc/100"}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />{" "}
          <p className="text-md font-semibold text-gray-800 hover:underline">
            {story.authorName || "Аноним"}
          </p>
        </Link>{" "}
        <p className="text-sm text-gray-500">
          {story.createdAt?.toDate().toLocaleDateString() || "Неизвестно"}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="mt-3">
          <h3 className="text-lg font-bold mb-1">{story.title}</h3>
          <p className="text-gray-700 line-clamp-3">{story.blocks[0].type}</p>
        </div>

        <div className="grid">
          <img
            className="rounded-xl border-none max-h-screen w-[200px]"
            src={getImage(story.filename)}
          />
        </div>
      </div>
    </div>
    // </div>
  );
};

export default StoryCards;
