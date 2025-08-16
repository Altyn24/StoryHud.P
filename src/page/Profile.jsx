import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import StoryCards from "./StoryCards";
import { fetchFollowers, fetchFollowing } from "../features/auth/channelSlice";
// import { fetchStories } from "../features/stories/storiesSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [stories, setStories] = useState([]);
  const { following, followers } = useSelector((state) => state.channel);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return;

      const q = query(
        collection(db, "stories"),
        where("authorId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStories(data);
    };

    fetchStories();
    if (user) {
      dispatch(fetchFollowers(user.uid));
      dispatch(fetchFollowing(user.uid));
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-500">Загрузка профиля...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pt-24 h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {user.name || user.displayName || "Писатель"}{" "}
          <div className="flex gap-3 text-sm">
            <span>Подписки: {following.length}</span>
            <span>Подписчики: {followers.length}</span>
          </div>
        </h1>
        <img
          src={user.photoURL || avatarDef}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Мои публикации</h2>

      {stories.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-md text-center text-gray-600">
          <p>У вас пока нет публикаций.</p>
          <button
            onClick={() => navigate("/create")}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Написать историю
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => (
            <StoryCards key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
