import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchStories } from "../features/auth/storiesSlice";
import StoryCard from "./StoryCards";
import { Flex, Spin } from "antd";

function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.stories);
  const cotigories = ["Новости", "Рассказы", "Сценарии"];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStories());
    }
  }, [status, dispatch]);

  return (
    <main className="max-w-2xl mx-auto p-4 pt-24">
      <h2 className="text-2xl font-bold mb-6">Сегодяшная лента</h2>
      <div className="flex gap-3">
        {/* {cotigories.map((item) => (
          <li
            key={item}
            className={`m-4 cursor-pointer hover:underline hover:text-blue-600 ${
              cotigories === item ? "hover:text-blue-600" : ""
            }`}
          >
            {item}
          </li>
        ))} */}
      </div>

      {status === "loading" && (
        <div className="justify-items-center relative">
          <div className="absolute top-35">
            <Flex align="center" gap="middle">
              <Spin size="large" />
            </Flex>
          </div>
        </div>
      )}
      {status === "failed" && <p>Ошибка при загрузке историй</p>}
      <div className="">
        {items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </main>
  );
}

export default Home;
