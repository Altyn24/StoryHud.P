import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setSearchQuery } from "../features/searchSlice";

export default function SearchResults() {
  const searchQuery = useSelector((state) => state.search);
  const stories = useSelector((state) => state.stories.items);
  const dispatch = useDispatch();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return stories.filter((story) => {
      const titleMatch = story.title?.toLowerCase().includes(lowerQuery) || false;
      const textMatch = story.text?.toLowerCase().includes(lowerQuery) || false;
      return titleMatch || textMatch;
    });
  }, [stories, searchQuery]);

  if (!searchQuery.trim()) return null;

  const handleSelect = () => {
    dispatch(setSearchQuery(""));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full left-0 w-full rounded-md bg-[var(--bg-input)] shadow-xl border border-gray-300 z-40 max-h-80 overflow-y-auto"
      >
        <div className="px-4 py-2 text-[var(--text-color)] bg-[var(--bg-color)]">
          Результат поиска
        </div>
        {filtered.length > 0 ? (
          filtered.map((story) => (
            <Link
              key={story.id}
              to={`/post/${story.id}`}
              className="flex items-center backdrop-blur-2xl px-4 py-2 hover:bg-[var(--bg-header)] transition-colors duration-200 border-b border-gray-200 last:border-b-0"
              onClick={handleSelect}
            >
              <span className="text-sm sm:text-base text-[var(--text-color)]">
                {story.title
                  ? story.title
                  : story.text?.slice(0, 50) +
                    (story.text.length > 50 ? "..." : "")}
              </span>
            </Link>
          ))
        ) : (
          <div className="px-4 py-3 text-gray-600">Ничего не найдено</div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
