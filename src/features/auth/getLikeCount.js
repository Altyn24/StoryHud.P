import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const getLikeCount = async (storyId) => {
  if (!storyId) {
    console.warn("storyId is undefined or invalid");
    return 0;
  }
  try {
    const likesRef = collection(db, `stories/${storyId}/likes`);
    const querySnapshot = await getDocs(likesRef);
    return querySnapshot.size;
  } catch (error) {
    console.error("Ошибка при получении количества лайков:", error);
    return 0;
  }
};