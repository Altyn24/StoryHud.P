import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, clearPost } from "../features/auth/postSlice";
import { getImage } from "../components/getImage";
import { Skeleton, Avatar } from "antd";
import CommentsSection from "./CommentsSelection";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { followUser, unfollowUser } from "../features/auth/channelSlice";
import { message } from "antd";

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { item: story, status, error } = useSelector((state) => state.post);
  const user = useSelector((state) => state.auth.user);
const isFollowing = useSelector((state) =>
  story?.authorId ? state.channel.following.includes(story.authorId) : false
);


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

  const handleFollow = () => {
    if (!user) {
      message.warning("Войдите в аккаунт, чтобы подписаться");
      return;
    }
    dispatch(followUser({ followerId: user.uid, followedId: story.authorId }));
  };

  const handleUnfollow = () => {
    dispatch(
      unfollowUser({ followerId: user.uid, followedId: story.authorId })
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pt-24">
      {story.title && (
        <h1 className="text-3xl font-bold mb-2">
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
          onClick={isFollowing ? handleUnfollow : handleFollow}
          className={`rounded-3xl border-1 border-black  px-3 py-2 hover:bg-black hover:!text-white transition-colors ${
            isFollowing ? "bg-black !text-white" : "bg-white"
          }`}
        >
          {isFollowing ? "Отписаться" : "Подписаться"}
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
