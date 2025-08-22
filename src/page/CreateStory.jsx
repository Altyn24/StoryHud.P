import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { instanse } from "./instans/instans";
import TextEditorTools from "./TextEditorTools";
import TagBar, { TAGS } from "./TegBar";
import { getImage } from "../components/getImage";

const DRAFT_KEY = "storyhub_draft";

export default function CreateStory() {
  const user = useSelector((state) => state.auth.user);
  const [content, setContent] = useState({ title: null, text: "", images: [] });
  const [tags, setTags] = useState([]); // массив тегов
  const [success, setSuccess] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [error, setError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setContent({
        title: parsed.title || null,
        text: parsed.text || "",
        images: parsed.images || [],
      });
      setTags(parsed.tags || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        title: content.title,
        text: content.text,
        images: content.images,
        tags,
      })
    );
  }, [content, tags]);

  const handleTextChange = (e) => {
    const newText = e.target.innerHTML;
    setContent((prev) => ({ ...prev, text: newText }));
  };

  const handleTitleChange = (e) => {
    setContent((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleImageSelect = (file) => {
    if (file) {
      setContent((prev) => ({ ...prev, images: [...prev.images, file] }));
    }
  };

  const removeImage = (index) => {
    setContent((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsPublishing(true);

    if (!content.text.trim() && content.images.length === 0) {
      setError("Пост не может быть пустым.");
      setIsPublishing(false);
      return;
    }

    try {
      let uploadedImages = [];
      for (const image of content.images) {
        if (image instanceof File) {
          const formData = new FormData();
          formData.append("file", image);
          const response = await instanse.post("/api/upload", formData);
          uploadedImages.push(response.data.filename);
        } else {
          uploadedImages.push(image);
        }
      }

      const previewImage = uploadedImages[0] || null;

      await addDoc(collection(db, "stories"), {
        title: content.title || null,
        text: content.text,
        images: uploadedImages,
        previewImage,
        tags, // сохраняем массив тегов
        authorId: user.uid,
        authorName: user.name || "Аноним",
        createdAt: serverTimestamp(),
      });

      setContent({ title: null, text: "", images: [] });
      setTags([]);
      localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Ошибка при публикации:", err);
      setError("Ошибка при публикации. Попробуйте снова.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-lg"
      >
        {/* Панель инструментов */}
        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setShowTools(!showTools)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </motion.button>
          <AnimatePresence>
            {showTools && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                <TextEditorTools
                  showTools={showTools}
                  setShowTools={setShowTools}
                  insertImage={handleImageSelect}
                  toggleTitle={() =>
                    setContent((prev) => ({
                      ...prev,
                      title: prev.title === null ? "" : null,
                    }))
                  }
                  hasTitle={content.title !== null}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Заголовок и текст */}
        <div className="mt-6">
          {content.title !== null && (
            <input
              type="text"
              placeholder="Название"
              value={content.title}
              onChange={handleTitleChange}
              className="w-full text-2xl font-semibold text-gray-900 outline-none mb-4 placeholder-gray-400"
            />
          )}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleTextChange}
            className="min-h-[200px] p-4 border-t border-gray-200 outline-none text-lg leading-relaxed focus:border-blue-500 transition-colors"
          >
            {content.text === "" ? "" : null}
          </div>

          {/* Выбор тегов */}
          <div className="flex justify-end mb-5">
            <button
              type="button"
              onClick={() => setShowTags(!showTags)}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>Теги</span>
              <motion.svg
                animate={{ rotate: showTags ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </button>
          </div>

          <AnimatePresence>
            {showTags && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <TagBar selectedTags={tags} setSelectedTags={setTags} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Превью изображений */}
          {content.images.length > 0 && (
            <div className="mt-6 space-y-4">
              {content.images.map((image, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-100 rounded-lg flex flex-col items-center"
                >
                  <img
                    src={
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : getImage(image)
                    }
                    alt={`Preview ${i + 1}`}
                    className="w-full max-h-96 object-contain rounded-md"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => removeImage(i)}
                    className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Удалить
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="font-bold text-center mt-4">{error}</p>}
        <div className="flex justify-end">
          {/* <button className="bg-gray-300 !text-gray-100 rounded-2xl py-3 px-3 transition-colors hover:bg-gray-400">
            Черновик
          </button> */}

          <motion.button
            type="submit"
            disabled={isPublishing}
            className="py-3 px-3 !text-white font-medium rounded-2xl bg-gray-300 hover:bg-green-300 transition-colors flex items-center justify-center"
          >
            {isPublishing ? (
              "..."
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            )}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-300 text-white px-6 py-3 rounded-md shadow-md"
          >
            Пост опубликован!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
