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
              {hasTitle ? "Убрать название" : "Название"}
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

            {/* Жирный */}
            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className="text-gray-600 hover:text-black font-bold"
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
                  strokeLinejoin="round"
                  d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z"
                />
              </svg>
            </button>

            {/* Курсив */}
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="text-gray-600 hover:text-black italic"
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
                  d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"
                />
              </svg>
            </button>

            {/* Заголовок */}
            <button
              type="button"
              onClick={() => applyFormat("formatBlock", "h2")}
              className="text-gray-600 hover:text-black font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 19.5H16.5v-1.609a2.25 2.25 0 0 1 1.244-2.012l2.89-1.445c.651-.326 1.116-.955 1.116-1.683 0-.498-.04-.987-.118-1.463-.135-.825-.835-1.422-1.668-1.489a15.202 15.202 0 0 0-3.464.12M2.243 4.492v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501" />
</svg>

            </button>

            {/* Разделитель */}
            {/* <button
              type="button"
              onClick={() => applyFormat("insertHorizontalRule")}
              className="text-gray-600 hover:text-black"
            >
              ―
            </button> */}

            {/* Ссылка */}
            <div className="relative">
              {/* <button
                type="button"
                onClick={() => setShowLinkInput(!showLinkInput)}
                className="text-gray-600 hover:text-black underline"
              >
                🔗
              </button> */}

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
