import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const getLikeCount = async (storyId) => {
  const likesRef = collection(db, "stories", storyId, "likes");
  const snapshot = await getDocs(likesRef);
  return snapshot.size;
};
