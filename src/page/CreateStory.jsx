import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreateStory = () => {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-600">Загрузка профиля...</p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Заполните поля");
      return;
    }

    try {
      await addDoc(collection(db, "stories"), {
        title,
        content,
        authorId: user.uid,
        authorName: user.name || "Без название",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");
      alert("История добавлена!");
    } catch (error) {
      console.error("Ошибка при добавлении истории: ", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-4 flex flex-col gap-8"
    >
      <h2 className="text-2xl font-bold">Создать историю</h2>
      <div className="flex">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-b p-2"
        />
        <button
          type="submit"
          className="!text-white px-4 py-2 rounded-2xl bg-green-400"
        >
          Опубликовать
        </button>
      </div>
      <textarea
        placeholder="Текст истории"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 rounded h-40 "
      />
    </form>
  );
};

export default CreateStory;
