import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { toggleLike } from "../features/stories/storiesSlice";
import { getLikeCount } from "../features/auth/getLikeCount";

const LikeButton = ({ storyId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const story = useSelector((state) =>
    state.stories.items.find((s) => s.id === storyId)
  );
  const isLiked = story?.likedByUser || false;

  const fetchLikes = async () => {
    if (!storyId) {
      console.warn("storyId is undefined in LikeButton");
      setLikeCount(0);
      return;
    }
    setLoading(true);
    try {
      const count = await getLikeCount(storyId);
      setLikeCount(count);
    } catch (error) {
      console.error("Ошибка при загрузке лайков:", error);
      setLikeCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [storyId]);

  const handleLike = async () => {
    if (!user) {
      message.warning("Войдите в аккаунт, чтобы поставить лайк");
      navigate("/login");
      return;
    }
    if (!storyId) {
      message.error("Невозможно поставить лайк: история не найдена");
      return;
    }
    setLoading(true);
    try {
      await dispatch(toggleLike({ storyId, userId: user.uid })).unwrap();
      await fetchLikes();
      message.success(isLiked ? "Лайк удалён" : "Лайк поставлен");
    } catch (error) {
      message.error("Ошибка при обновлении лайка");
      console.error("Ошибка лайка:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading || !storyId}
      className={`flex items-center gap-2 text-gray-600 hover:text-red-500 disabled:opacity-50 ${
        isLiked ? "text-red-500" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isLiked ? "red" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
