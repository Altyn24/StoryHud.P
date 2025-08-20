import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function SearchResults() {
  const searchQuery = useSelector((state) => state.search);
  const stories = useSelector((state) => state.stories.items);

  if (!searchQuery.trim()) return null;

  const filtered = stories.filter((story) => {
    const titleMatch = story.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const textMatch = story.text?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return titleMatch || textMatch;
  });

  return (
    <div className="absolute top-full p-1 w-full rounded-sm bg-white shadow-lg border border-gray-200 z-40 max-h-100 overflow-y-auto">
      <div className="p-3 text-gray-400">Результат поиска</div>
      {filtered.length > 0 ? (
        filtered.map((story) => (
          <Link
            key={story.id}
            to={`/post/${story.id}`}
            className="px-4 py-2 hover:bg-gray-100 flex border-gray-400 border-b m-3"
          >
            {story.title ? story.title : story.text?.slice(0, 50) + (story.text.length > 50 ? "..." : "")}
          </Link>
        ))
      ) : (
        <div className="p-4 text-gray-500">Ничего не найдено</div>
      )}
    </div>
  );
}