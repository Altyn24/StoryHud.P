import { motion } from "framer-motion";

export const TAGS = ["Спорт", "Игры", "Наука", "Технологии", "Фильмы"];

export default function TagBar({ selectedTags, setSelectedTags }) {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 justify-end">
        {TAGS.map((tag) => (
          <motion.div
            key={tag}
            onClick={() => toggleTag(tag)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`px-3 py-1 rounded-full text-sm border-none transition-all ${
              selectedTags.includes(tag)
                ? "bg-[#b7d5f1] !text-black"
                : "bg-gray-100 hover:bg-[#d5e5f4]"
            }`}
          >
            {tag}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
