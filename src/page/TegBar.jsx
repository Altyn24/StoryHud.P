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
          <motion.button
            key={tag}
            onClick={() => toggleTag(tag)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              selectedTags.includes(tag)
                ? "bg-blue-600 !text-white border-blue-600"
                : "bg-gray-100 !text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
