import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  AlignCenterIcon,
  AlignJustify,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import { IconBlockquote } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface iAppProps {
  editor: Editor | null;
}

export default function Menubar({ editor }: iAppProps) {
  if (!editor) return;

  return (
    <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {/* bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  editor.isActive("bold") && "bg-muted text-muted-foreground"
                )}
              >
                <BoldIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          {/* italic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  editor.isActive("italic") && "bg-muted text-muted-foreground"
                )}
              >
                <ItalicIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          {/* underline */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                className={cn(
                  editor.isActive("underline") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <UnderlineIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          {/* strike */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  editor.isActive("strike") && "bg-muted text-muted-foreground"
                )}
              >
                <StrikethroughIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>

          {/* blockquote */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => {
                  if (!editor) return;
                  editor.chain().focus().toggleBlockquote().run();
                }}
                className={cn(
                  editor.isActive("blockquote") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <IconBlockquote />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Blockquote</TooltipContent>
          </Tooltip>

          {/* h1 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 1 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading1Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          {/* h2 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 2 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading2Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          {/* h3 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 3 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading3Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>

          {/* list item */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  editor.isActive("bulletList") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <ListIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          {/* ordered list */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  editor.isActive("orderedList") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <ListOrderedIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-2"></div>
          <div className="flex flex-wrap gap-1">
            {/* align left */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "left" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "left" }) &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <AlignLeftIcon />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>

            {/* align center */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "center" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "center" }) &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <AlignCenterIcon />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>

            {/* align right */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "right" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "right" }) &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <AlignRightIcon />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>

            {/* justify content */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "justify" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  className={cn(
                    editor.isActive({ textAlign: "justify" }) &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <AlignJustify />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Justify</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-2"></div>
          <div className="flex flex-wrap gap-1">
            {/* undo button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <UndoIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            {/* redo button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <RedoIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
