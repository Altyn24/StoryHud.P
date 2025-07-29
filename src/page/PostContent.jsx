import React from "react";

const PostContent = ({ blocks }) => {
  return (
    <div>
      <div className="prose prose-lg whitespace-pre-wrap">
        {blocks
          .filter((b) => b.type === "text" && b.content.trim())
          .map((block, i) => (
            <p key={i}>{block.content}</p>
          ))}
      </div>
    </div>
  );
};

export default PostContent;
