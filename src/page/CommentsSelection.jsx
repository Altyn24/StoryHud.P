import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import { addCommentToStory } from "../features/auth/addComment";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";

const CommentsSection = ({ storyId }) => {
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

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

    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addCommentToStory(storyId, {
      text,
      authorId: user?.uid || "anon",
      authorName: user?.name || "Аноним",
      photoURL: user?.photoURL || "",
    });

    setText("");
    fetchComments();
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Комментарии</h3>

      <form onSubmit={handleCommentSubmit} className="mb-6">
       <div
  contentEditable
  className="w-full p-3 border border-gray-300 rounded mb-2 min-h-[40px]"
  placeholder="Оставьте комментарий..." // это не сработает в `div`
  onInput={(e) => setText(e.currentTarget.textContent)}
  suppressContentEditableWarning={true}
></div>

        <button
          type="submit"
          className="bg-blue-500 !text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Добавить
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 items-start border-b pb-3"
          >
            <img
              src={comment.photoURL || avatarDef}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{comment.authorName || "Гость"}</p>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
