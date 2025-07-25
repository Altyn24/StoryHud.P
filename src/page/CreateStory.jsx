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
    const form_data = new FormData();
    console.log(e.target[3].files);

    form_data.append("file", e?.target[3]?.files[0]);
    console.log(form_data.get("file"));

    // const hasContent = blocks.some(
    //   (b) => b.type === "text" && b.content.trim()
    // );

    // if (!title || !hasContent) return;

    console.log("Запрос начался");
    try {
      const filename = await instanse.post("/api/upload", form_data);

      console.log("Filename", filename.data.filename);

      await addDoc(collection(db, "stories"), {
        title,
        blocks,
        authorId: user.uid,
        authorName: user.name || "Аноним",
        createdAt: serverTimestamp(),
        filename: filename.data.filename
      });

      setTitle("");
      setBlocks([{ type: "text", content: "" }]);
      localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Ошибка при публикации:", err);
    }
  };

  return (
    <div className="relative min-h-screen">
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

              {block.type === "image" && (
                <img
                  src={block.src}
                  alt="user-upload"
                  className="w-full max-h-96 object-contain rounded shadow"
                />
              )}

              <TextEditorTools
                showTools={showTools}
                setShowTools={setShowTools}
                insertImage={(url) => insertImageAfter(i, url)}
              />
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
