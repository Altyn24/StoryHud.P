import { collection, addDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const addCommentToStory = async (storyId, commentData) => {
  try {
    const commentRef = collection(db, "stories", storyId, "comments");
    await addDoc(commentRef, {
      ...commentData,
      createdAt: serverTimestamp(),
      parentId: commentData.parentId || null,
    });
  } catch (error) {
    throw new Error(`Не удалось добавить комментарий: ${error.message}`);
  }
};

export const deleteCommentFromStory = async (storyId, commentId) => {
  try {
    const commentRef = doc(db, "stories", storyId, "comments", commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    throw new Error(`Не удалось удалить комментарий: ${error.message}`);
  }
};