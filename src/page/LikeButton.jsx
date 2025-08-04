import React, { useEffect, useState } from "react";
import { toggleLike } from "../features/auth/toggleLike";
import { getLikeCount } from "../features/auth/getLikeCount";
import { useSelector } from "react-redux";

const LikeButton = ({ storyId }) => {
  const user = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchLikes = async () => {
    const count = await getLikeCount(storyId);
    setLikeCount(count);
  };

  const handleLike = async () => {
    if (!user) return alert("Нужно войти, чтобы лайкать");

    const result = await toggleLike(storyId, user.uid);
    setLiked(result);
    fetchLikes();
  };

  useEffect(() => {
    fetchLikes();
  }, [storyId]);

  return (
    <button onClick={handleLike} className="flex items-center gap-1 mt-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={liked ? "red" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.018-4.5-4.5-4.5-1.403 0-2.649.655-3.5 1.68a4.49 4.49 0 0 0-3.5-1.68c-2.482 0-4.5 2.015-4.5 4.5 0 7.125 8 11.25 8 11.25s8-4.125 8-11.25z"
        />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
