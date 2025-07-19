import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchStories } from "../features/auth/storiesSlice";
import StoryCard from "./StoryCards";
import { Flex, Spin } from "antd";

function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.stories);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStories());
    }
  }, [status, dispatch]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Сегодяшная лента</h2>

      {status === "loading" && (
        <div className="justify-items-center">
          {" "}
          <Flex align="center" gap="middle">
            <Spin size="large" />
          </Flex>
        </div>
      )}
      {status === "failed" && <p>Ошибка при загрузке историй</p>}

      {items.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </main>
  );
}

export default Home;
