import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, clearPost } from "../features/auth/postSlice";
import { useEffect } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostImage from "./PostImage";
import { Spin } from "antd";

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { item: story, status, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => {
      dispatch(clearPost());
    };
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div className="flex justify-center mt-20">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "failed") {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!story) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <PostHeader story={story} />
      <PostImage src={story.filename} />
      <PostContent blocks={story.blocks} />
    </div>
  );
};

export default Post;
