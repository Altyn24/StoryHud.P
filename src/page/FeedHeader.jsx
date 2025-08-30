import React from "react";
import { motion } from "framer-motion";

export default function FeedHeader({ tags, selectedTag, setSelectedTag }) {
  return (
    <div className="border-b border-gray-200 sticky top-[64px] dark:bg-[var(--bg-color)] z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-4"
      >
        {tags.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}