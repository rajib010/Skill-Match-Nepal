"use client";

import { cn } from "@/lib/utils";
import Blockquote from "@tiptap/extension-blockquote";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import Menubar from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";

function RichTextEditor({
  field,
  setDescriptionCount,
  limit = 1000,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  setDescriptionCount: React.Dispatch<React.SetStateAction<number>>;
  limit?: number;
}) {
  // const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpdate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ editor }: any) => {
      const json = JSON.stringify(editor.getJSON());
      field.onChange(json);
      setDescriptionCount(editor.storage.characterCount.characters());
    },
    [field, setDescriptionCount]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        blockquote: false,
      }),
      Blockquote,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CharacterCount.configure({
        limit,
      }),
      // ListItem
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    immediatelyRender: false,
    onUpdate: handleUpdate,
  });

  //set initial content when field value changes

  useEffect(() => {
    if (!editor || !field.value) return;

    try {
      const content =
        typeof field.value === "string" ? JSON.parse(field.value) : field.value;
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(content);

      if (currentContent !== newContent) {
        editor.commands.setContent(content);
        setDescriptionCount(editor.storage.characterCount.characters());
      }
    } catch {
      //silent passing
    }
  }, [editor, field.value, setDescriptionCount]);

  const charCount = useMemo(
    () => editor?.state.doc.textContent.length ?? 0,
    [editor?.state.doc]
  );

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "border border-input rounded-lg overflow-hidden flex flex-col w-full relative max-h-[600px]"
        )}
      >
        {/* sticky menubar */}

        <div className="z-10 bg-background flex-shrink-0 border-b border-border sticky top-0">
          <Menubar editor={editor} />
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>

        <div className="text-sm text-muted-foreground text-right p-2">
          {charCount} / {limit} Characters
        </div>
      </div>
      {charCount === limit && (
        <span className="text-red-500  p-2 text-sm">
          Max. Characters count reached
        </span>
      )}

      <style jsx global>
        {`
          .ProseMirror h1 {
            font-size: 2.25rem !important;
            font-weight: 800 !important;
            line-height: 2.5rem !important;
            margin-top: 0 !important;
            margin-bottom: 0.875rem !important;
          }

          .ProseMirror h2 {
            font-size: 1.875rem !important;
            font-weight: 700 !important;
            line-height: 2.25rem !important;
            margin-top: 0 !important;
            margin-bottom: 0.75rem !important;
          }

          .ProseMirror h3 {
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            line-height: 2rem !important;
            margin-top: 0 !important;
            margin-bottom: 0.625rem !important;
          }

          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1.5rem !important;
            margin: 1rem 0 !important;
          }

          .ProseMirror ul {
            list-style-type: disc !important;
          }

          .ProseMirror ol {
            list-style-type: decimal !important;
          }

          .ProseMirror li {
            display: list-item !important;
            margin: 0.25rem 0 !important;
          }

          .ProseMirror li p {
            margin: 0 !important;
          }

          .ProseMirror ul ul {
            list-style-type: circle !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }

          .ProseMirror ol ol {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }

          .ProseMirror blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #6b7280;
          }

          .dark .ProseMirror blockquote {
            border-left-color: #374151;
            color: #9ca3af;
          }
        `}
      </style>
    </>
  );
}

export default memo(RichTextEditor);
