import React from "react";
import { getImage } from "../components/getImage";

const PostImage = ({ src }) => {
  return (
    <div>
      <img
        src={getImage(src)}
        alt="cover"
        className="w-full h-auto rounded-lg shadow mb-6"
      />
    </div>
  );
};

export default PostImage;
