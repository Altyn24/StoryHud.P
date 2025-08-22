import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchStories } from "../features/stories/storiesSlice";
import StoryCard from "./StoryCards";
import { Flex, Spin, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import FeedHeader from "./FeedHeader";
import { TAGS } from "./TegBar";

function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.stories);

  const [selectedTag, setSelectedTag] = useState("Все");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStories()).catch(() => {
        message.error("Ошибка при загрузке историй");
      });
    }
  }, [status, dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

const filteredStories =
  selectedTag === "Все"
    ? items
    : items.filter((story) => story.tags?.includes(selectedTag));


  return (
    <div className="flex">
      <main className="max-w-xl mx-auto pt-24 container">
        <FeedHeader
          tags={["Все", ...TAGS]}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />

        {status === "loading" && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Flex align="center" gap="middle">
              <Spin size="large" />
            </Flex>
          </div>
        )}

        {status === "failed" && (
          <p className="text-center text-red-500">Ошибка: {error}</p>
        )}

        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {status === "succeeded" &&
              filteredStories.map((story) => (
                <motion.div key={story.id} variants={itemVariants}>
                  <StoryCard story={story} />
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Home;
