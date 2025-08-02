import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

export default function TextEditorTools({ showTools, setShowTools }) {
  const ref = useRef();

  return (
    <div className="absolute -left-12 top-2 z-10">
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
      </button>
      <AnimatePresence>
        {showTools && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 space-y-2 bg-white border rounded shadow-lg p-2 h-50 flex flex-col gap-1 "
          >
            <label htmlFor="imageStory" onClick={() => ref.current.click()}>
              <input
                type="file"
                ref={ref}
                id="imageStory"
                style={{display: "none"}}
              />   <svg
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
            </label>
            <button type="button" className="">...</button>
            <button type="button" ></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
