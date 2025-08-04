import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const addCommentToStory = async (storyId, commentData) => {
  const commentRef = collection(db, "stories", storyId, "comments");
  await addDoc(commentRef, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
};
