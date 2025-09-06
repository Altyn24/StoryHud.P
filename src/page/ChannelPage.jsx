import React, { useEffect, useState } from "react";
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
import { Flex, Spin, message } from "antd";
import StoryCards from "./StoryCards";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function ChannelPage() {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { channel, posts, loading, error, following, followers } = useSelector(
    (state) => state.channel
  );
  const currentUser = useSelector((state) => state.auth.user);
  const [channelOwner, setChannelOwner] = useState(null);

  useEffect(() => {
    async function loadChannelOwner() {
      if (uid === currentUser?.uid) {
        setChannelOwner(currentUser);
      } else {
        const docSnap = await getDoc(doc(db, "users", uid));
        if (docSnap.exists()) {
          setChannelOwner(docSnap.data());
        } else {
          setChannelOwner(null);
        }
      }
    }
    loadChannelOwner();
  }, [uid, currentUser]);

  useEffect(() => {
    if (!uid) return;

    dispatch(fetchOrCreateChannel(uid));
    dispatch(fetchUserPosts(uid));

    if (currentUser?.uid) {
      dispatch(fetchFollowing(currentUser.uid));
    }
    dispatch(fetchFollowers(uid));
  }, [uid, currentUser, dispatch]);

  const handleFollow = () => {
    if (!currentUser) {
      message.warning("Войдите в аккаунт, чтобы подписаться");
      navigate("/login");
      return;
    }
    dispatch(followUser({ followerId: currentUser.uid, followedId: uid }))
      .then(() => message.success("Вы подписались!"))
      .catch(() => message.error("Ошибка при подписке"));
  };

  const handleUnfollow = () => {
    dispatch(unfollowUser({ followerId: currentUser.uid, followedId: uid }))
      .then(() => message.success("Вы отписались"))
      .catch(() => message.error("Ошибка при отписке"));
  };

  const isFollowing = following.includes(uid);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Flex align="center" gap="middle">
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

  if (!channelOwner) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* <p className="text-lg text-gray-600"></p> */}
        <Flex align="center" gap="middle">
          <Spin size="large" />
        </Flex>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-screen-xl container mx-auto p-4 sm:p-6 pt-30">
        <div className="pt-10">
          <div className="">
            <div className="flex justify-between items-center">
              <div className="m-2 md:flex">
                <img
                  src={channelOwner.photoURL || avatarDef}
                  className="h-20 w-20 rounded-full"
                  alt="Аватар"
                />
                <div>
                  <h1 className="text-3xl">{channelOwner.name}</h1>
                  <div className="flex gap-4 text-sm text-[var(--text-color)]">
                    <span>Подписчики: {followers.length}</span>
                  </div>
                </div>
              </div>
              {currentUser?.uid !== uid && (
                <button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className={`cursor-pointer rounded-3xl text-[var(--text-color)] border-1 border-black px-3 py-2 hover:bg-black hover:!text-white transition-colors ${
                    isFollowing
                      ? "bg-black text-[var(--text-color)]"
                      : "bg-[var(--color-bt)]"
                  }`}
                >
                  {isFollowing ? "Отписаться" : "Подписаться"}
                </button>
              )}
            </div>
            <p className="text-[var(--text-color)] text-sm">
              {channelOwner.email}
            </p>
            <p className="text-gray-600 mb-4">
              {channel?.description || "Описание отсутствует"}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-md text-center text-[var(--text-color)]">
            <p>Истории отсутствуют</p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {posts.map((story) => (
              <StoryCards key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
