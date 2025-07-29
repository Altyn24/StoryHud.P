import React from "react";

const PostHeader = ({ story }) => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <img
            src={story.authorPhoto || "https://i.pravatar.cc/100"}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>{story.authorName || "Аноним"}</span>
         <span>
  {story.createdAt
    ? new Date(story.createdAt).toLocaleDateString()
    : "Дата неизвестна"}
</span>

        </div>
      </div>
    </div>
  );
};

export default PostHeader;
