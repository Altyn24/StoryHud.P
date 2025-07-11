import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";



const CreateStory = () => {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-600">Загрузка профиля...</p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) return;

    try {
      await addDoc(collection(db, "stories"), {
        title,
        content,
        authorId: user.uid,
        authorName: user.name || "Без названия",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Ошибка при добавлении истории: ", error);
    }
  };

  return (
    <div className="relative min-h-screen">
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
            className="w-full border-b p-2 text-xl outline-none"
          />
          <button
            type="submit"
            className="!text-white px-4 py-2 rounded-2xl bg-green-400 hover:bg-green-500 transition"
          >
            Опубликовать
          </button>
        </div>

        <textarea
          placeholder="Текст истории"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 rounded h-40 text-lg leading-relaxed border border-gray-300 outline-none"
        />
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            История опубликована!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateStory;
