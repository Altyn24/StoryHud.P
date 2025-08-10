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
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>

      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
