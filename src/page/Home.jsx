import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchStories } from "../features/stories/storiesSlice";
import StoryCard from "./StoryCards";
import { Flex, Spin, message } from "antd";

function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.stories);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStories()).catch(() => {
        message.error("Ошибка при загрузке историй");
      });
    }
  }, [status, dispatch]);

  return (
    <main className="max-w-2xl mx-auto pt-24 container">
      <h2 className="text-2xl font-bold mb-6">Сегодяшная лента</h2>
      {/* <div className="flex gap-7"></div> */}

      {status === "loading" && (
        <div className="justify-items-center relative">
          <div className="absolute top-35">
            <Flex align="center" gap="middle">
              <Spin size="large" />
            </Flex>
          </div>
        </div>
      )}
      {status === "failed" && (
        <p className="text-center text-red-500">Ошибка: {error}</p>
      )}
      <div className="">
        {items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </main>
  );
}

export default Home;
