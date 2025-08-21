import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchStories } from "../features/stories/storiesSlice";
import StoryCard from "./StoryCards";
import { Flex, Spin, message, Skeleton } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import TagBar from "./TegBar";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex">
      <main className="max-w-2xl mx-auto pt-24 container">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-6"
        >
          Сегодяшная лента
        </motion.h2>

        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="justify-items-center relative"
          >
            <div className="absolute top-35">
              <Flex align="center" gap="middle">
                <Spin size="large" />
              </Flex>
            </div>
          </motion.div>
        )}
        {status === "failed" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-red-500"
          >
            Ошибка: {error}
          </motion.p>
        )}
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className=""
          >
            {status === "loading" && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                    <Skeleton active paragraph={{ rows: 2 }} className="mb-4" />
                  </motion.div>
                ))}
              </>
            )}
            {status === "succeeded" &&
              items.map((story) => (
                <motion.div key={story.id} variants={itemVariants}>
                  <StoryCard story={story} />
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
         {/* <aside className="w-72 p-4 border-r dark:border-gray-700 text-white">
        <TagBar selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      </aside> */}
      </main>
    </div>
  );
}

export default Home;

{
  /* <div className="relative">
        
        <div className="fixed right-0 pt-24 grid grid-cols-4 bg-[#acc3db]/50 p-6 rounded-2xl">
          {["AI", "Sport", "Movie", "Future", "games"].map((item) => (
            <div className="">

            <button className="bg-white h-8 px-3 rounded-3xl hover:bg-gray-100">
              {item}
            </button>
            </div>
          ))}
        </div>
          <div className="border-t border-black m-1">Actual</div>
      </div> */
}
