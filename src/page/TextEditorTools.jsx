import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TextEditorTools = ({
  showTools,
  setShowTools,
  textareaRef,
  setContent,
}) => {
  const insertAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    const newText = current.slice(0, start) + textToInsert + current.slice(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + textToInsert.length;
    }, 0);
  };

  const insertDivider = () => {
    const plainDivider = `\n\n⋯ ⋯ ⋯\n\n`;
    insertAtCursor(plainDivider);
  };

  return (
    <div className="absolute left-[-50px] top-2 z-10">
      <button
        type="button"
        onClick={() => setShowTools(!showTools)}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
      >
         <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
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
            className="mt-2 space-y-2 bg-white border rounded shadow-lg p-2 w-[160px]"
          >
            <button
              onClick={insertDivider}
              type="button"
              className="text-sm px-3 py-1 hover:bg-gray-100 rounded w-full text-left"
            >
              Вставить разделитель
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextEditorTools;
