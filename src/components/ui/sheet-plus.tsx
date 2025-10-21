"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

/** Root/Trigger/Close/Portal */
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/** Radix Overlay (use when modal={true}) */
function SheetOverlay({
  className,
  offsetTop,
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay> & {
  offsetTop?: number | string
}) {
  const top = offsetTop ?? 0
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[40] bg-black/50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      style={{ ...style, top }}
      {...props}
    />
  )
}

/** Lightweight non-modal overlay (works when modal={false}) */
function NonModalOverlay({
  top = 0,
  className,
  closeOnClick = true,
}: {
  top?: number | string
  className?: string
  closeOnClick?: boolean
}) {
  const el = (
    <div
      aria-hidden
      className={cn("fixed inset-x-0 bottom-0 z-[40] bg-black/50", className)}
      style={{ top }}
    />
  )
  return closeOnClick ? <SheetClose asChild>{el}</SheetClose> : el
}

/** Content */
function SheetContent({
  className,
  children,
  side = "right",
  offsetTop,
  withOverlay = true, // show visual overlay in non-modal mode
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  offsetTop?: number | string
  /** For modal={false}: render our own overlay. Keep true for the dim background. */
  withOverlay?: boolean
}) {
  const top = offsetTop ?? 0

  return (
    <SheetPortal>
      {/* For non-modal sheets, Radix won't render Overlay.
          Use our own overlay so you still get the dim background
          while keeping the header/nav interactive. */}
      {withOverlay && <NonModalOverlay top={side === "top" ? top : 0} />}

      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-[50] flex flex-col gap-4 bg-background shadow-lg transition ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          side === "top" &&
            "inset-x-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          className
        )}
        style={{
          ...style,
          ...(side === "top" ? { top } : {}),
        }}
        {...props}
      >
        {children}

       
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/** Header/Footer/Title/Description */
function SheetHeader(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props
  return (
    <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4", className)} {...rest} />
  )
}

function SheetFooter(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props
  return (
    <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...rest} />
  )
}

function SheetTitle(props: React.ComponentProps<typeof SheetPrimitive.Title>) {
  const { className, ...rest } = props
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...rest}
    />
  )
}

function SheetDescription(props: React.ComponentProps<typeof SheetPrimitive.Description>) {
  const { className, ...rest } = props
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetOverlay, // keep exporting: useful if you ever use modal={true}
}
