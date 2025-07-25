import React from "react";
// import { instanse } from "./instans/instans.js";
import { getImage } from "../components/getFile.js";

const StoryCards = ({ story }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 hover:bg-gray-50 transition">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={story.authorPhoto}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {story.authorName || "Аноним"}
          </p>
          <div>
            <img src={getImage(story.filename)} />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-bold mb-1">{story.title}</h3>
      <p className="text-gray-700 line-clamp-3">{story.content}</p>
    </div>
  );
};

export default StoryCards;
