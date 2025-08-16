import { Link } from "react-router-dom";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import LikeButton from "./LikeButton.jsx";
import { getImage } from "../components/getImage.js";
import { useSelector } from "react-redux";

const StoryCards = ({ story }) => {
  const firstText = story.blocks?.find(
    (b) => b.type === "text" && b.content.trim()
  )?.content;
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="bg-white shadow-xl p-4 mb-4 hover:bg-gray-50 transition rounded-2xl">
      <div className="flex items-center justify-between">
        <Link
          to={`/channel/${story.authorId}`}
          className="flex items-center gap-2"
        >
          <img
            src={user?.photoURL || story.authorPhoto || avatarDef}
            className="w-10 h-10 rounded-full border-gray-400 border-2"
            alt="avatar"
          />
          <p className="text-md font-semibold text-gray-800 hover:underline">
            {story.authorName || "Неизвестный автор"}
          </p>
        </Link>
        <p className="text-sm text-gray-500">
          {story.createdAt
            ? new Date(story.createdAt).toLocaleTimeString()
            : "Дата неизвестна"}
        </p>
      </div>

      <Link to={`/post/${story.id}`} className="block">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 mt-3 sm:w-32">
            <h3 className="text-2xl font-bold mb-1">{story.title}</h3>
            <div>
              <p className="text-gray-700 line-clamp-2">{firstText || "Без описания"}</p>
            </div>
          </div>
          {story.filename && (
            <div className="justify-center">
              <img
                className="rounded-xl w-[200px] h-auto"
                src={getImage(story.filename)}
                alt="cover"
              />
            </div>
          )}
        </div>
      </Link>
      <br />
      <LikeButton storyId={story.id} />
    </div>
  );
};

export default StoryCards;