import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, clearPost } from "../features/auth/postSlice";
import { getImage } from "../components/getImage";
import { Skeleton, Avatar } from "antd";
import CommentsSection from "./CommentsSelection";
import avatarDef from "../assets/avatar-people-user-svgrepo-com.svg";
import LikeButton from "./LikeButton";

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { item: story, status, error } = useSelector((state) => state.post);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => dispatch(clearPost());
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto p-4 justify-items-center pt-24">
        <Skeleton active title paragraph={{ rows: 1 }} />
        <Skeleton avatar={<Avatar />} />
        <Skeleton.Image
          active
          style={{ width: 500, height: 300, marginTop: 20 }}
        />
      </div>
    );
  }

  if (status === "failed") return <p>Ошибка: {error}</p>;
  if (!story) return <p>История не найдена</p>;

  const firstText = story.blocks?.find(
    (b) => b.type === "text" && b.content?.trim()
  )?.content;

  return (
    <div className="max-w-3xl mx-auto p-4 pt-24">
      <h1 className="text-3xl font-bold mb-4 text-[#333333] ">{story.title}</h1>
      <div className="items-center flex mb-3 justify-between">
        <Link to={`/channel/${story.authorId}`} className="flex items-center gap-2"> <img
            src={user?.photoURL || avatarDef}
            className="w-10 h-10 rounded-full border-gray-400 border-2"
          />{story.authorName}</Link>
        {/* <Link to="/profile" className="flex items-center gap-4 ">
         
          <p className="font-bold text-1xl">{user?.name || "Писатель"}</p>
        </Link> */}
        <button
          className="rounded-3xl border-1 border-black px-3 py-2 hover:bg-black hover:!text-white transition-colors"
          type="submit"
        >
          Подписаться
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Опубликовано:{" "}
        {story.createdAt
          ? new Date(story.createdAt).toLocaleString()
          : "Дата неизвестна"}
      </p>
      <span className="flex gap-5 mb-7 border-gray-300 p-3 border-b border-t justify-between">
        <div className="flex gap-4">
          <LikeButton storyId={id} />
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
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </div>
        <div>
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
        </div>
      </span>
      <div className="prose max-w-none pt-4">
        <div className="mb-10">
          <p className="text-gray-700 text-lg">{firstText}</p>
          {story.filename && (
            <div>
              <img
                className="rounded-xl h-auto"
                src={getImage(story.filename)}
                alt="cover"
              />
            </div>
          )}
        </div>
      </div>
      <CommentsSection storyId={id} />
    </div>
  );
};

export default Post;

// import React, { useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { db } from "../firebase/firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";

// const Post = () => {
//   const { id } = useParams();
//   const [post, setPost] = React.useState(null);
//   const commentsRef = useRef(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//       const postDoc = await getDoc(doc(db, "stories", id));
//       if (postDoc.exists()) {
//         setPost({ id: postDoc.id, ...postDoc.data() });
//       }
//     };
//     fetchPost();
//   }, [id]);

//   const scrollToComments = () => {
//     commentsRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   if (!post) {
//     return <div className="text-center mt-20 text-gray-500">Загрузка...</div>;
//   }

//   return (
//     <div className="pt-24 min-h-screen bg-[#f5f7fa]">
//       <div className="max-w-3xl mx-auto px-4 py-10">
//         <h1 className="text-3xl font-bold mb-4 text-[#333333]">{post.title}</h1>
//         {post.blocks.map((block, index) => (
//           <div key={index} className="card mb-4">
//             {block.type === "text" && (
//               <div
//                 className="mb-4 text-lg"
//                 dangerouslySetInnerHTML={{ __html: block.content }}
//               />
//             )}
//             {block.type === "image" && (
//               <img
//                 src={post.filename || ""}
//                 alt="post-image"
//                 className="w-full max-h-96 object-contain rounded shadow"
//               />
//             )}
//           </div>
//         ))}

//         <div
//           className="flex items-center gap-2 mb-4 cursor-pointer text-[#6b7280] hover:text-[#acc3db]"
//           onClick={scrollToComments}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="w-6 h-6"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <span>Комментарии ({post.comments?.length || 0})</span>
//         </div>

//         <div ref={commentsRef} id="comments-section" className="mt-8">
//           <h2 className="text-2xl font-semibold mb-4 text-[#333333]">Комментарии</h2>
//           {post.comments && post.comments.length > 0 ? (
//             post.comments.map((comment, index) => (
//               <div key={index} className="card mb-4 p-4">
//                 <p className="text-[#333333]">{comment.text}</p>
//                 <small className="text-[#6b7280]">{comment.author}</small>
//               </div>
//             ))
//           ) : (
//             <p className="text-[#6b7280]">Пока нет комментариев.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Post;
