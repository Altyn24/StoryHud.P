import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrCreateChannel,
  fetchUserPosts,
  followUser,
  unfollowUser,
  fetchFollowing,
  fetchFollowers,
} from "../features/auth/channelSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Flex, Spin } from "antd";
import StoryCards from "./StoryCards";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { message } from "antd";

export default function ChannelPage() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { channel, posts, loading, error, following, followers } = useSelector(
    (state) => state.channel
  );
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (uid) {
      dispatch(fetchOrCreateChannel(uid));
      dispatch(fetchUserPosts(uid));
      if (user?.uid) {
        dispatch(fetchFollowing(user.uid));
      }
      dispatch(fetchFollowers(uid));
    }
  }, [uid, dispatch, user]);

  const handleFollow = () => {
    if (!user) {
      message.warning("Войдите в аккаунт, чтобы подписаться");
      navigate("/login");
      return;
    }
    dispatch(followUser({ followerId: user.uid, followedId: uid }))
      .then(() => message.success("Вы подписались!"))
      .catch(() => message.error("Ошибка при подписке"));
  };

  const handleUnfollow = () => {
    dispatch(unfollowUser({ followerId: user.uid, followedId: uid }))
      .then(() => message.success("Вы отписались"))
      .catch(() => message.error("Ошибка при отписке"));
  };

  const isFollowing = following.includes(uid);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Flex aling="center" gap="middle">
          <Spin size="large" />
        </Flex>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">Ошибка: {error}</p>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600"></p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl container mx-auto p-4 sm:p-6 pt-30">
      <div className="pt-10">
        {user.name && (
          <div>
            <div className="flex justify-between items-center">
              <div className="m-2 md:flex">
                <img
                  src={user.photoURL || avatarDef}
                  className="h-20 w-20 rounded-full"
                />
                <div className="">
                  <h1 className="text-3xl">{user.name}</h1>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Подписчики: {followers.length}</span>
                  </div>
                </div>
              </div>
              {user?.uid !== uid && (
                <button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className={`cursor-pointer rounded-3xl border-1 border-black px-3 py-2 hover:bg-black hover:!text-white transition-colors ${
                    isFollowing ? "bg-black !text-white" : "bg-white"
                  }`}
                >
                  {isFollowing ? "Отписаться" : "Подписаться"}
                </button>
              )}
            </div>{" "}
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-600 mb-4">
              {channel.description || "Описание отсутствует"}
            </p>
          </div>
        )}
      </div>
      {posts.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-md text-center text-gray-600">
          <p>Истории отсутствуют</p>
          {user?.uid === uid && (
            <button
              onClick={() => navigate("/create")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Написать первую историю
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((story) => (
            <StoryCards key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
