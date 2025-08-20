import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function TextEditorTools({
  showTools,
  setShowTools,
  insertImage,
  toggleTitle,
  hasTitle,
}) {
  const fileInputRef = useRef();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [link, setLink] = useState("");

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
    <div className="absolute left-2 top-2 z-10">
      {/* Кнопка "+"
      <button
        type="button"
        onClick={() => setShowTools(!showTools)}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
      >
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button> */}

      {/* Панель инструментов */}
      <AnimatePresence>
        {showTools && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-0 ml-12 bg-white border rounded-xl shadow-md p-4 flex gap-3 z-10"
          >
            {/* Переключатель заголовка */}
            <button
              type="button"
              onClick={toggleTitle}
              className="text-gray-600 hover:text-black"
            >
              {hasTitle ? "Убрать название" : "Добавить название"}
            </button>

            {/* Загрузка изображения */}
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
                🖼️
              </span>
            </label>

            {/* Жирный */}
            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className="text-gray-600 hover:text-black font-bold"
            >
              B
            </button>

            {/* Курсив */}
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="text-gray-600 hover:text-black italic"
            >
              I
            </button>

            {/* Заголовок */}
            <button
              type="button"
              onClick={() => applyFormat("formatBlock", "h2")}
              className="text-gray-600 hover:text-black font-semibold"
            >
              H2
            </button>

            {/* Разделитель */}
            <button
              type="button"
              onClick={() => applyFormat("insertHorizontalRule")}
              className="text-gray-600 hover:text-black"
            >
              ―
            </button>

            {/* Ссылка */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLinkInput(!showLinkInput)}
                className="text-gray-600 hover:text-black underline"
              >
                🔗
              </button>

              <AnimatePresence>
                {showLinkInput && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-8 top-0 bg-white border rounded-lg shadow-md p-2 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Вставьте ссылку..."
                      className="border px-2 py-1 rounded text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleInsertLink}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      OK
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
