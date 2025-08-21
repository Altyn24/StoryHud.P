import React, { useState } from "react";

const predefinedTags = ["спорт", "наука", "технологии", "культура", "игры"];

export default function TagBar({ selectedTags, setSelectedTags }) {
  const [searchTag, setSearchTag] = useState("");

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTag.trim() && !selectedTags.includes(searchTag.trim())) {
      setSelectedTags([...selectedTags, searchTag.trim()]);
      setSearchTag("");
    }
  };

  return (
    <div className="p-3 border-b border-gray-300 dark:border-gray-700">
      <h2 className="font-semibold text-lg mb-2">Теги</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Поиск по тегу..."
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="flex-1 px-2 py-1 rounded border dark:bg-gray-900 dark:border-gray-700"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </form>
    </div>
  );
}
