import { getImage } from "../components/getImage.js";
import { Link } from "react-router-dom";

const StoryCards = ({ story }) => {
  const firstText = story.blocks.find(
    (b) => b.type === "text" && b.content.trim()
  )?.content;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 hover:bg-gray-50 transition">
      <Link to={`/post/${story.id}`} className="block">
        <div className="flex items-center mb-2 justify-between">
          <Link to={`/profile`} className="flex gap-4 items-center">
            <img
              src={story.authorPhoto || "https://i.pravatar.cc/100"}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-md font-semibold text-gray-800 hover:underline">
              {story.authorName || "Аноним"}
            </p>
          </Link>
          <p className="text-sm text-gray-500">
            {story.createdAt
              ? new Date(story.createdAt).toLocaleDateString()
              : "Дата неизвестна"}
          </p>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 mt-3">
            <h3 className="text-lg font-bold mb-1">{story.title}</h3>
            <p className="text-gray-700 line-clamp-3">{firstText}</p>
          </div>

          <div className="shrink-0">
            <img
              className="rounded-xl w-[200px] h-auto object-cover"
              src={getImage(story.filename)}
              alt="cover"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StoryCards;
