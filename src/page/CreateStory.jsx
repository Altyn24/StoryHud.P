import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import TextEditorTools from "./TextEditorTools";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { instanse } from "./instans/instans";

const DRAFT_KEY = "storyhub_blocks_draft";

export default function CreateStory() {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([{ type: "text", content: "" }]);
  const [success, setSuccess] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleTextChange = (index, text) => {
    const updated = [...blocks];
    updated[index].content = text;
    setBlocks(updated);
  };

  const insertImageAfter = (index, url) => {
    const updated = [...blocks];
    updated.splice(
      index + 1,
      0,
      { type: "image", src: url },
      { type: "text", content: "" }
    );
    setBlocks(updated);
  };

  const handleImageSelect = (file) => {
    setImagePreview(file);
  };

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const { title, blocks } = JSON.parse(saved);
      setTitle(title || "");
      setBlocks(blocks || [{ type: "text", content: "" }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, blocks }));
  }, [title, blocks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const hasContent = blocks.some(
      (b) => b.type === "text" && b.content.trim()
    );

    if (!title.trim()) {
      setError("Введите название истории.");
      return;
    }

    if (!hasContent) {
      setError("История не может быть пустой.");
      return;
    }

    try {
      let filename = null;
      if (imagePreview) {
        const form_data = new FormData();
        form_data.append("file", imagePreview);
        const response = await instanse.post("/api/upload", form_data);
        filename = response.data.filename;

        if (!filename) {
          setError("Файл не загрузился. Попробуйте снова.");
          return;
        }
        insertImageAfter(blocks.length - 1, filename);
      }

      await addDoc(collection(db, "stories"), {
        title,
        blocks,
        authorId: user.uid,
        authorName: user.name || "Аноним",
        createdAt: serverTimestamp(),
        filename,
      });

      setTitle("");
      setBlocks([{ type: "text", content: "" }]);
      setImagePreview(null);
      localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Ошибка при публикации:", err);
      setError("Ошибка при публикации. Попробуйте снова.");
    }
  };

  return (
    <div className="relative min-h-screen pt-24">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-10">
          <input
            type="text"
            placeholder="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              fontSize: "2rem",
              fontWeight: "800",
              outline: "none",
              marginBottom: "10px",
            }}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="!text-white px-4 py-2 rounded-2xl bg-gray-500 hover:bg-green-500 transition"
            >
              Опубликовать
            </button>
            {error && <p className="text-red-500 font-medium mt-2">{error}</p>}
          </div>
        </div>

        <div className="space-y-6">
          {blocks.map((block, i) => (
            <div key={i} className="relative group">
              {block.type === "text" && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextChange(i, e.target.innerText)}
                  className="min-h-[80px] mt-6 p-3 border-l border-gray-300 outline-none text-xl font-mono"
                >
                  {block.content}
                </div>
              )}
              {imagePreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex flex-col">
                  <img
                    src={URL.createObjectURL(imagePreview)}
                    alt="Preview"
                    className="w-full max-h-70 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="!text-gray-500 hover:!text-black transition-all"
                  >
                    Удалить изображение
                  </button>
                </div>
              )}
              {block.type === "image" && (
                <img
                  src={block.src}
                  alt="user-upload"
                  className="w-full max-h-96 object-contain"
                />
              )}
              <div className="">
                <TextEditorTools
                  showTools={showTools}
                  setShowTools={setShowTools}
                  insertImage={handleImageSelect}
                />
              </div>
            </div>
          ))}
        </div>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            История опубликована!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
