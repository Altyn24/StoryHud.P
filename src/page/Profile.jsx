import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const [stories, setStories] = useState([]);
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
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-500">Загрузка профиля...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Привет, {user?.name || "Писатель"}!
        </h1>
        <img
          src={user?.photoURL || "https://via.placeholder.com/100"}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Мои публикации</h2>

      {stories.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded text-center text-gray-600">
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
            <div key={story.id} className="bg-white shadow p-4 rounded">
              <Link
                to={`/story/${story.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {story.title}
              </Link>
              <p className="text-sm text-gray-500">
                Опубликовано:{" "}
                {story.createdAt?.toDate().toLocaleDateString() || "Неизвестно"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
