import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import { addCommentToStory, deleteCommentFromStory } from "../features/auth/addComment";
import { motion, AnimatePresence } from "framer-motion";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";

const CommentsSection = ({ storyId }) => {
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchComments = async () => {
    const q = query(
      collection(db, "stories", storyId, "comments"),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const topLevelComments = data.filter((comment) => !comment.parentId);
    const replies = data.filter((comment) => comment.parentId);

    const commentsWithReplies = topLevelComments.map((comment) => ({
      ...comment,
      replies: replies.filter((reply) => reply.parentId === comment.id),
    }));

    setComments(commentsWithReplies);
  };

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addCommentToStory(storyId, {
        text,
        authorId: user?.uid || "anon",
        authorName: user?.name || "Аноним",
        photoURL: user?.photoURL || "",
        parentId: replyTo ? replyTo.id : null,
      });
      setText("");
      setReplyTo(null);
      fetchComments();
      showNotification("Комментарий добавлен!");
    } catch (error) {
      showNotification("Ошибка при добавлении комментария", true);
    }
  };

  const handleDeleteComment = async (commentId) => {
    showNotification("Удалить комментарий?", false, () => {
      deleteComment(commentId);
    });
  };

  const deleteComment = async (commentId) => {
    try {
      await deleteCommentFromStory(storyId, commentId);
      fetchComments();
      showNotification("Комментарий удалён!");
    } catch (error) {
      showNotification("Ошибка при удалении комментария", true);
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setMenuOpen(null);
    document.querySelector("[contentEditable]").focus();
  };

  const toggleMenu = (commentId) => {
    setMenuOpen(menuOpen === commentId ? null : commentId);
  };

  const showNotification = (message, isError = false, onConfirm = null) => {
    setNotification({ message, isError, onConfirm });
    if (!onConfirm) {
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="mt-10">
      {/* Уведомление */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 pt-24 right-4 p-4 rounded-lg shadow-lg ${
              notification.isError ? "bg-red-500" : notification.onConfirm ? "bg-[#acc3db]" : "bg-green-500"
            } text-white flex items-center gap-2`}
          >
            <span>{notification.message}</span>
            {notification.onConfirm && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    notification.onConfirm();
                    setNotification(null);
                  }}
                  className="bg-white !text-black px-2 py-1 rounded hover:bg-gray-200"
                >
                  Да
                </button>
                <button
                  onClick={() => setNotification(null)}
                  className="bg-white !text-black px-2 py-1 rounded hover:bg-gray-200"
                >
                  Нет
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-xl font-bold mb-4">Комментарии</h3>

      <form onSubmit={handleCommentSubmit} className="mb-6">
        <div
          contentEditable
          className="w-full p-3 border-b outline-none mb-2 min-h-[40px]"
          placeholder={replyTo ? `Ответить ${replyTo.authorName}...` : "Оставьте комментарий..."}
          onInput={(e) => setText(e.currentTarget.textContent)}
          suppressContentEditableWarning={true}
        ></div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#acc3db] !text-white px-4 py-2 rounded-2xl hover:bg-blue-200 transition-colors"
          >
            {replyTo ? "Ответить" : "Добавить"}
          </button>
          {replyTo && (
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded-2xl hover:bg-gray-400 transition-colors"
              onClick={() => setReplyTo(null)}
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pb-3"
            >
              <div className="flex gap-3 items-start">
                <img
                  src={comment.photoURL || avatarDef}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{comment.authorName || "Гость"}</p>
                    <div className="relative">
                      <button onClick={() => toggleMenu(comment.id)} className="text-gray-500 hover:text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                          />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {menuOpen === comment.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10"
                          >
                            <button
                              onClick={() => handleReply(comment)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Ответить
                            </button>
                            {comment.authorId === user?.uid && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                              >
                                Удалить
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              </div>
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-10 mt-2 space-y-2">
                  <AnimatePresence>
                    {comment.replies.map((reply) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3 items-start"
                      >
                        <img
                          src={reply.photoURL || avatarDef}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-sm">{reply.authorName || "Гость"}</p>
                            <div className="relative">
                              <button
                                onClick={() => toggleMenu(reply.id)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                  />
                                </svg>
                              </button>
                              <AnimatePresence>
                                {menuOpen === reply.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10"
                                  >
                                    <button
                                      onClick={() => handleReply(reply)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Ответить
                                    </button>
                                    {reply.authorId === user?.uid && (
                                      <button
                                        onClick={() => handleDeleteComment(reply.id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                      >
                                        Удалить
                                      </button>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{reply.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentsSection;