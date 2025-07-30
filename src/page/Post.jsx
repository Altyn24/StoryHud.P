import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, clearPost } from "../features/auth/postSlice";
import { getImage } from "../components/getImage";
import { Skeleton } from "antd";

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { item: story, status, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => dispatch(clearPost());
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <Skeleton active title paragraph={{ rows: 2 }} />
        <Skeleton.Image active style={{ width: "100%", height: 300, marginTop: 20 }} />
      </div>
    );
  }

  if (status === "failed") return <p>Ошибка: {error}</p>;
  if (!story) return <p>История не найдена</p>;

  const firstText = story.blocks?.find(
    (b) => b.type === "text" && b.content?.trim()
  )?.content;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Опубликовано:{" "}
        {story.createdAt
          ? new Date(story.createdAt).toLocaleString()
          : "Дата неизвестна"}
      </p>
      <div className="prose max-w-none">
        <div className="mb-10">
          <p className="text-gray-700 !text-2xl">{firstText}</p>
          <img
            src={getImage(story.filename)}
            className="rounded-lg mt-4"
            alt="story"
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
