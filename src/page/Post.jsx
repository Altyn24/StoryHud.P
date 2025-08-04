import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, clearPost } from "../features/auth/postSlice";
import { getImage } from "../components/getImage";
import { Skeleton, Avatar } from "antd";
import CommentsSection from "./CommentsSelection";
import LikeButton from "./LikeButton";
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
        <Skeleton active title paragraph={{ rows: 2 }} />
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

  const firstText = story.blocks?.find(
    (b) => b.type === "text" && b.content?.trim()
  )?.content;

  return (
    <div className="max-w-3xl mx-auto p-4 pt-24">
      <h1 className="!text-5xl font-bold mb-2">{story.title}</h1>
      <div className="items-center flex mb-3 justify-between">
        <Link to="/profile" className="flex items-center gap-4 ">
          <img
            src={user?.photoURL || avatarDef}
            className="w-10 h-10 rounded-full border-gray-400 border-2"
          />
          <p className="font-bold text-1xl">{user?.name || "Писатель"}</p>
        </Link>
        <button
          className="rounded-3xl border-1 border-black px-3 py-2 hover:bg-black hover:!text-white transition"
          type="submit"
        >
          Подписаться
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Опубликовано:{" "}
        {story.createdAt
          ? new Date(story.createdAt).toLocaleString()
          : "Дата неизвестна"}
      </p>
      <span className="flex gap-5 mb-7 border-gray-300 p-3 border-b border-t justify-between">
        <div className="flex gap-4">
          <LikeButton storyId={id} />
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
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </div>
        <div>
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
        </div>
      </span>
      <div className="prose max-w-none pt-4">
        <div className="mb-10">
          <p className="text-gray-700 text-2xl">{firstText}</p>
          <img
            src={getImage(story.filename)}
            className="rounded-lg mt-4"
            alt="story"
          />
        </div>
      </div>
      <CommentsSection storyId={id} />
    </div>
  );
};

export default Post;
