import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { instanse } from "./instans/instans";
import TextEditorTools from "./TextEditorTools";

const DRAFT_KEY = "storyhub_draft";

export default function CreateStory() {
  const user = useSelector((state) => state.auth.user);
  const [content, setContent] = useState({ title: null, text: "", images: [] });
  const [success, setSuccess] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [error, setError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [tags, setTags] = useState("");
  const editorRef = useRef(null);

  const handleTextChange = (e) => {
    const newText = e.target.innerText;
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

  function handleTagsChage(e) {
    const value = e.target.value;
    setTags(value.split(",").map((tag) => tag.trim()));
  }

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setContent({
        title: parsed.title || null,
        text: parsed.text || "",
        images: [],
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ title: content.title, text: content.text })
    );
  }, [content.title, content.text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsPublishing(true);

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);

    if (!content.text.trim() && content.images.length === 0) {
      setError("Пост не может быть пустым.");
      setIsPublishing(false);
      return;
    }

    try {
      let uploadedImages = [];
      if (content.images.length > 0) {
        for (const image of content.images) {
          if (!(image instanceof File)) {
            throw new Error("Некорректный формат изображения");
          }
          const formData = new FormData();
          formData.append("file", image);
          const response = await instanse.post("/api/upload", formData);
          uploadedImages.push(response.data.filename);
        }
      }
      const previewImage = uploadedImages[0] || null;

      await addDoc(collection(db, "stories"), {
        title: content.title || null,
        text: content.text,
        images: uploadedImages,
        previewImage,
        tegs: tagsArray,
        authorId: user.uid,
        authorName: user.name || "Аноним",
        createdAt: serverTimestamp(),
      });

      setContent({ title: null, text: "", images: [] });
      setTags("");
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
    <div className="relative min-h-screen pt-24 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 space-y-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTools(!showTools)}
            className="absolute right-0 top-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
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
          </button>

          <AnimatePresence>
            {showTools && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className=""
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

        <div className="mt-12">
          {content.title !== null && (
            <input
              type="text"
              placeholder="Название"
              value={content.title}
              onChange={handleTitleChange}
              className="w-full !text-2xl font-bold outline-none mb-6 placeholder-gray-400"
            />
          )}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dir="ltr"
            onInput={handleTextChange}
            className="min-h-[300px] p-2 border-t border-gray-200  outline-none text-xl leading-relaxed focus:border-blue-500 transition"
          >
            {content.text === "" ? "" : null}
          </div>
          <input
            type="text"
            placeholder="Теги"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-2 outline-none w-full border-b border-gray-200"
          />
          {content.images.length > 0 && (
            <div className="mt-6 space-y-4">
              {content.images.map((image, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-100 rounded-xl flex flex-col items-center"
                >
                  {image instanceof File ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${i + 1}`}
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="mt-2 text-sm text-red-500 hover:text-red-700 transition"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-black font-bold text-center">{error}</p>}

        <button
          type="submit"
          disabled={isPublishing}
          className="w-full py-3 px-3 !text-white font-semibold rounded-xl bg-green-500 hover:bg-green-600 transition flex items-center justify-center"
        >
          {isPublishing ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          {isPublishing ? "Публикация..." : "Опубликовать"}
        </button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            Пост опубликован!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
