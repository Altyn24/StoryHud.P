import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import TextEditorTools from "./TextEditorTools";
import { useRef } from "react";

const DRAFT_KEY = "storyhub_draft";

const CreateStory = () => {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const textareaRef = useRef(null);
 
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      const { title, content } = JSON.parse(savedDraft);
      setTitle(title || "");
      setContent(content || "");
    }
  }, []);

  useEffect(() => {
    const draft = { title, content };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [title, content]);

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
      localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Ошибка при добавлении истории: ", error);
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle("");
    setContent("");
  };

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-600">Загрузка профиля...</p>
    );
  }

  return (
    <div className="relative min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto p-4 flex flex-col gap-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Создать историю</h2>
          <button
            type="button"
            onClick={handleClearDraft}
            className="text-sm text-red-500 hover:underline"
          >
            Очистить черновик
          </button>
        </div>

        <div className="">
          <input
            type="text"
            placeholder="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-100 border-b p-2 text-xl outline-none"
          />
        </div>
        <div className="relative">
          <TextEditorTools
            showTools={showTools}
            setShowTools={setShowTools}
            textareaRef={textareaRef}
            setContent={setContent}
          />
          <textarea
            ref={textareaRef}
            placeholder="Расскажи свою историю"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className=" w-full p-4 h-70 text-5xl leading-relaxed border-l border-black outline-none font-mono"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="!text-white px-4 py-2 rounded-2xl bg-gray-500 hover:bg-green-500 transition"
          >
            Опубликовать
          </button>
        </div>
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
