import { Link } from "react-router-dom";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { getImage } from "../components/getImage.js";
import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { lazy, Suspense } from "react";

const LikeButton = lazy(() => import("./LikeButton.jsx"));

const StoryCards = ({ story }) => {
  const user = useSelector((state) => state.auth.user);
  const [commentCount, setCommentCount] = useState(0);

  const hasContent = story.title || story.text;
  const previewText = story.text || "Без содержания";

  const fetchCommentCount = useCallback(async () => {
    try {
      const q = query(collection(db, "stories", story.id, "comments"));
      const snapshot = await getDocs(q);
      setCommentCount(snapshot.size);
    } catch (error) {
      console.error("Ошибка при подсчёте комментариев:", error);
      setCommentCount(0);
    }
  }, [story.id]);

  useEffect(() => {
    fetchCommentCount();
  }, [fetchCommentCount]);

  return (
    <div className="bg-white border-b border-gray-200 p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/channel/${story.authorId}`} className="flex items-center gap-3">
          <img
            src={user?.photoURL || story.authorPhoto || avatarDef}
            className="w-10 h-10 rounded-full border border-gray-300"
            alt="avatar"
          />
          <p className="text-sm font-medium text-gray-900 hover:underline">
            {story.authorName || "Неизвестный автор"}
          </p>
        </Link>
        {/* <p className="text-sm text-gray-500">
          {story.createdAt
            ? new Date(story.createdAt).toLocaleDateString()
            : "Дата неизвестна"}
        </p> */}
      </div>

      <Link to={`/post/${story.id}`} className="block">
        {hasContent ? (
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              {story.title && (
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">
                  {story.title}
                </h3>
              )}
              {story.text && (
                <p className="text-gray-700 text-base line-clamp-3">
                  {previewText}
                </p>
              )}
            </div>
            {story.previewImage && (
              <div className="w-full sm:w-[200px] h-auto">
                <img
                  className="rounded-lg w-full h-auto object-cover"
                  src={getImage(story.previewImage)}
                  alt="cover"
                />
              </div>
            )}
          </div>
        ) : (
          story.previewImage && (
            <div className="w-full">
              <img
                className="rounded-lg w-full h-auto object-cover"
                src={getImage(story.previewImage)}
                alt="full-cover"
              />
            </div>
          )
        )}
      </Link>

      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 justify-end">
        <Suspense fallback={<div className="text-sm text-gray-400">Загрузка...</div>}>
          <LikeButton storyId={story.id} />
        </Suspense>
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <span>{commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default StoryCards;