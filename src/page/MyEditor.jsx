import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const MyEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
  });

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="border-l p-2 rounded min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default MyEditor;
