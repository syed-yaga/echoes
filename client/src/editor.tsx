import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import EditorToolbar from "./EditorToolbox";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 text-gray-200 bg-transparent outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-600 rounded-md overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
