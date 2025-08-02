import React from "react";
import { useSelector } from "react-redux";

const Comments = () => {
  const user = useSelector((state) => state.auth.user);
  // const [comment, setComment] = useState([]);

  return (
    <div className="mb-50 border-t ">
      <div className="pt-5">
        <h2 className="text-2xl">Комментарии:</h2>
        <div className="">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={user.photoURL || "https://i.pravatar.cc/100"}
              alt=""
              className="w-10 h-10 rounded-full border-gray-400 border-2"
            />
            <p className="font-bold text-1xl">{user?.name || "Писатель"}</p>
          </div>
          <div>
            <input
              type="text"
              className="px-2 py-3 m-3 outline-none bg-gray-100 rounded-md w-full"
              placeholder="Что вы думаете?"
            />
          </div>
        </div>
        <snap className="border-l h-full"></snap>
      </div>
    </div>
  );
};

export default Comments;
