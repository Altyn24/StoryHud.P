import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, clearPost } from "../features/auth/postSlice";
import { getImage } from "../components/getImage";
import { Skeleton, Avatar } from "antd";
import CommentsSection from "./CommentsSelection";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { item: story, status, error } = useSelector((state) => state.post);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => dispatch(clearPost());
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto p-4 justify-items-center pt-24">
        <Skeleton active title paragraph={{ rows: 1 }} />
        <Skeleton avatar={<Avatar />} />
        <Skeleton.Image
          active
          style={{ width: 500, height: 300, marginTop: 20 }}
        />
      </div>
    );
  }

  if (status === "failed") return <p>Ошибка: {error}</p>;
  if (!story) return <p>История не найдена</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 pt-24">
      {story.title && (
        <h1 className="text-3xl font-bold mb-2 text-[#333333]">
          {story.title}
        </h1>
      )}

      <div className="items-center flex mb-3 justify-between">
        <Link
          to={`/channel/${story.authorId}`}
          className="flex items-center gap-2"
        >
          <img
            src={user?.photoURL || story.authorPhoto || avatarDef}
            className="w-10 h-10 rounded-full border-gray-400 border-2"
            alt="avatar"
          />
          <span>{story.authorName}</span>
        </Link>
        <button
          className="rounded-3xl border-1 border-black px-3 py-2 hover:bg-black hover:!text-white transition-colors"
          type="submit"
        >
          Подписаться
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {story.createdAt
          ? new Date(story.createdAt).toLocaleDateString()
          : "Дата неизвестна"}
      </p>

      {story.text && (
        <p className="text-gray-800 text-lg whitespace-pre-line mb-6">
          {story.text}
        </p>
      )}

      {story.images &&
        story.images.map((img, i) => (
          <img
            key={i}
            className="rounded-xl h-auto mb-4"
            src={getImage(img)}
            alt="post-image"
          />
        ))}

      <CommentsSection storyId={id} />
    </div>
  );
};

export default Post;
