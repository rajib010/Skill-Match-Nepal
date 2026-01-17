"use client";

import { generateHTML, JSONContent } from "@tiptap/react";
import { useMemo } from "react";
import parse from "html-react-parser";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

export function RenderDescription({ json }: { json: JSONContent }) {
  const output = useMemo(() => {
    if (!json || json.type !== "doc") {
      return null;
    }

    try {
      const html = generateHTML(json, [
        StarterKit.configure({
          bold: {},
          italic: {},
          strike: {},
          code: {},
          listItem: {},
          orderedList: {},
          bulletList: {},
          blockquote: {},
          heading: {
            levels: [1, 2, 3],
          },
          paragraph: {},
          hardBreak: {},
          horizontalRule: {},
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ]);
      return html;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return `<div class="text-red-500 p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20">
        <strong>Error rendering content:</strong> ${
          error.message || "Unknown error"
        }
        <br />
        <small>Check console for details</small>
      </div>`;
    }
  }, [json]);

  if (!output) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20">
        Failed to render content. Check console for errors.
      </div>
    );
  }

  return (
    <div className="prose text-container prose-li:marker:text-primary max-w-none">
      <style jsx>{`
        .prose pre {
          background-color: var(--tw-prose-pre-bg);
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
        }
        .prose code {
          background-color: var(--tw-prose-code-bg);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .prose blockquote {
          border-left: 4px solid var(--tw-prose-quote-borders);
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        .prose ul,
        .prose ol {
          padding-left: 1.5rem;
        }
        .prose hr {
          border-top: 1px solid var(--tw-prose-hr);
          margin: 2rem 0;
        }
      `}</style>
      {parse(output)}
    </div>
  );
}
