import { getImage } from "../components/getImage.js";
import { Link, useParams } from "react-router-dom";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import LikeButton from "./LikeButton.jsx";
import { useDispatch } from "react-redux";
import { fetchPostById, clearPost } from "../features/auth/postSlice";
import { useEffect } from "react";

const StoryCards = ({ story }) => {
  const firstText = story.blocks.find(
    (b) => b.type === "text" && b.content.trim()
  )?.content;
  const { id } = useParams();

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => dispatch(clearPost());
  }, [dispatch, id]);

  return (
    <div className="bg-white shadow-xl p-4 mb-4 hover:bg-gray-50 transition">
      <div className="flex items-center justify-between">
        <Link to={`/profile`} className="flex gap-1 items-center">
          <img
            src={story.authorPhoto || avatarDef}
            alt="avatar"
            className="w-10 h-10 rounded-full"
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
          <div className="flex-1 mt-3">
            <h3 className="text-lg font-bold mb-1">{story.title}</h3>
            <div className="">
              <p className="text-gray-700 line-clamp-2">{firstText}</p>
            </div>
          </div>
          {story.filename && (
            <div className="justify-center">
              <img
                className="rounded-xl w-[330px] h-auto"
                src={getImage(story.filename)}
                alt="cover"
              />
            </div>
          )}
        </div>
      </Link>
      <br />
    <LikeButton storyId={id}/>
    </div>
  );
};

export default StoryCards;
