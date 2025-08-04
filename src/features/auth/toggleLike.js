import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const toggleLike = async (storyId, userId) => {
  const likeRef = doc(db, "stories", storyId, "likes", userId);
  const likeSnap = await getDoc(likeRef);

  if (likeSnap.exists()) {
    await deleteDoc(likeRef);
    return false;
  } else {
    await setDoc(likeRef, {
      likedAt: new Date(),
    });
    return true;
  }
};
