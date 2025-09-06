import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function TextEditorTools({
  showTools,
  setShowTools,
  insertImage,
  toggleTitle,
  hasTitle,
}) {
  const fileInputRef = useRef();
  const panelRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [link, setLink] = useState("");

  // Закрытие при клике вне панели
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowTools(false);
      }
    }

    if (showTools) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTools, setShowTools]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      insertImage(file);
      fileInputRef.current.value = "";
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleInsertLink = () => {
    if (link.trim()) {
      applyFormat("createLink", link.trim());
      setLink("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="z-10 absolute right-10 top-1">
      {/* Панель инструментов */}
      <AnimatePresence>
        {showTools && (
          <motion.div
            ref={panelRef} // 👉 отслеживаем панель
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="items-center backdrop-blur-2xl bg-[var(--bg-input)] border rounded-xl shadow-md px-4 py-2 flex gap-2 z-10 sm:w-[100]"
          >
            {/* Кнопки (оставил твои) */}
            <button
              type="button"
              onClick={toggleTitle}
              className="text-[var(--text-color)] hover:text-black"
            >
              {hasTitle ? "Без название" : "Название"}
            </button>

            <label htmlFor="imageStory">
              <input
                type="file"
                ref={fileInputRef}
                id="imageStory"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <span className="cursor-pointer text-gray-600 hover:text-black">
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
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </span>
            </label>

            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className="text-gray-600 hover:text-black font-bold"
            >
              B
            </button>

            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="text-gray-600 hover:text-black italic"
            >
              I
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
