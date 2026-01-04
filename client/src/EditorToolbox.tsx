import { Editor } from "@tiptap/react";
import { Button } from "flowbite-react";

type Props = {
  editor: Editor | null;
};

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-2 border-b border-gray-600 p-2 bg-gray-900">
      {/* Bold */}
      <Button
        size="xs"
        outline
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </Button>

      {/* Italic */}
      <Button
        size="xs"
        outline
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </Button>

      {/* Bullet list */}
      <Button
        size="xs"
        outline
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </Button>

      {/* Heading */}
      <Button
        size="xs"
        outline
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>

      {/* Link */}
      <Button
        size="xs"
        outline
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        Link
      </Button>
    </div>
  );
}
