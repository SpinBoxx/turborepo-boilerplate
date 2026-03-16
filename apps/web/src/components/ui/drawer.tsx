"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const DrawerCreateHandle = DrawerPrimitive.createHandle;

const DrawerProvider = DrawerPrimitive.Provider;

const Drawer = DrawerPrimitive.Root;

const DrawerPortal = DrawerPrimitive.Portal;

function DrawerTrigger(props: DrawerPrimitive.Trigger.Props) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose(props: DrawerPrimitive.Close.Props) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerSwipeArea(props: DrawerPrimitive.SwipeArea.Props) {
	return <DrawerPrimitive.SwipeArea data-slot="drawer-swipe-area" {...props} />;
}

function DrawerIndentBackground(props: DrawerPrimitive.IndentBackground.Props) {
	return (
		<DrawerPrimitive.IndentBackground
			data-slot="drawer-indent-background"
			{...props}
		/>
	);
}

function DrawerIndent(props: DrawerPrimitive.Indent.Props) {
	return <DrawerPrimitive.Indent data-slot="drawer-indent" {...props} />;
}

function DrawerBackdrop({
	className,
	...props
}: DrawerPrimitive.Backdrop.Props) {
	return (
		<DrawerPrimitive.Backdrop
			className={cn(
				"fixed inset-0 z-50 bg-black opacity-[calc(var(--drawer-backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] [--drawer-backdrop-opacity:0.42] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*300ms)] data-[swiping]:duration-0 supports-[-webkit-touch-callout:none]:absolute",
				className,
			)}
			data-slot="drawer-backdrop"
			{...props}
		/>
	);
}

function DrawerViewport({
	className,
	...props
}: DrawerPrimitive.Viewport.Props) {
	return (
		<DrawerPrimitive.Viewport
			className={cn("pointer-events-none fixed inset-0 z-50", className)}
			data-slot="drawer-viewport"
			{...props}
		/>
	);
}

type DrawerPopupVariant = "default" | "action-sheet";

function DrawerHandle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("mx-auto mb-4 h-2 w-15 rounded-full bg-muted", className)}
			data-slot="drawer-handle"
			{...props}
		/>
	);
}

function DrawerPopup({
	className,
	children,
	variant = "default",
	showCloseButton = variant === "default",
	showHandle = true,
	disableBackdrop = false,
	closeProps,
	...props
}: DrawerPrimitive.Popup.Props & {
	variant?: DrawerPopupVariant;
	showCloseButton?: boolean;
	showHandle?: boolean;
	disableBackdrop?: boolean;
	closeProps?: DrawerPrimitive.Close.Props;
}) {
	return (
		<DrawerPortal>
			{!disableBackdrop && <DrawerBackdrop />}
			<DrawerViewport>
				<DrawerPrimitive.Popup
					className={cn(
						"group/drawer-popup absolute isolate min-h-0 pt-3.5 text-popover-foreground outline outline-1 outline-border transition-[transform,opacity,height,box-shadow] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*300ms)] data-[swiping]:duration-0",
						variant === "default" &&
							"pointer-events-auto flex flex-col overflow-hidden bg-popover shadow-[0_-16px_48px_rgb(0_0_0/0.14),0_6px_18px_rgb(0_0_0/0.08)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-transparent after:transition-colors after:duration-300 data-[swipe-direction=down]:data-[nested-drawer-open]:h-[calc(var(--stack-height)+var(--bleed))] data-[swipe-direction=down]:data-[nested-drawer-open]:overflow-hidden data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=left]:top-0 data-[swipe-direction=right]:top-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=down]:mx-auto data-[swipe-direction=up]:mx-auto data-[swipe-direction=left]:h-full data-[swipe-direction=right]:h-full data-[swipe-direction=down]:max-h-[min(85vh,calc(100dvh-1rem))] data-[swipe-direction=up]:max-h-[min(85vh,calc(100dvh-1rem))] data-[swipe-direction=down]:w-full data-[swipe-direction=left]:w-[min(32rem,calc(100vw-1rem))] data-[swipe-direction=right]:w-[min(32rem,calc(100vw-1rem))] data-[swipe-direction=up]:w-full data-[swipe-direction=left]:max-w-full data-[swipe-direction=right]:max-w-full data-[swipe-direction=down]:rounded-t-[1.25rem] data-[swipe-direction=left]:rounded-r-[1.25rem] data-[swipe-direction=up]:rounded-b-[1.25rem] data-[swipe-direction=right]:rounded-l-[1.25rem] data-[swipe-direction=down]:border-t data-[swipe-direction=left]:border-r data-[swipe-direction=up]:border-b data-[swipe-direction=right]:border-l data-[nested-drawer-open]:after:bg-black/5 data-[swipe-direction=down]:data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[swipe-direction=down]:data-[starting-style]:[transform:translateY(calc(100%+2px))] data-[swipe-direction=left]:data-[ending-style]:[transform:translateX(calc(-100%-2px))] data-[swipe-direction=left]:data-[starting-style]:[transform:translateX(calc(-100%-2px))] data-[swipe-direction=right]:data-[ending-style]:[transform:translateX(calc(100%+2px))] data-[swipe-direction=right]:data-[starting-style]:[transform:translateX(calc(100%+2px))] data-[swipe-direction=up]:data-[ending-style]:[transform:translateY(calc(-100%-2px))] data-[swipe-direction=up]:data-[starting-style]:[transform:translateY(calc(-100%-2px))] data-[swipe-direction=down]:[--bleed:2.5rem] data-[swipe-direction=down]:[--peek:0.875rem] data-[swipe-direction=down]:[--stack-height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))-var(--bleed)))] data-[swipe-direction=down]:[--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] data-[swipe-direction=down]:[--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] data-[swipe-direction=down]:[--stack-scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] data-[swipe-direction=down]:[--stack-scale:clamp(0.9,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] data-[swipe-direction=down]:[--stack-shrink:calc(1-var(--stack-scale))] data-[swipe-direction=down]:[--stack-step:0.04] data-[swipe-direction=down]:[transform-origin:50%_calc(100%-var(--bleed))] data-[swipe-direction=down]:[transform:translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height))))_scale(var(--stack-scale))] data-[swipe-direction=left]:[transform:translateX(var(--drawer-swipe-movement-x))] data-[swipe-direction=right]:[transform:translateX(var(--drawer-swipe-movement-x))] data-[swipe-direction=up]:[transform:translateY(var(--drawer-swipe-movement-y))]",
						variant === "action-sheet" &&
							"pointer-events-none bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 flex-col gap-3 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] outline-none data-[swipe-direction=down]:data-[ending-style]:[transform:translateX(-50%)_translateY(calc(100%+1rem+2px))] data-[swipe-direction=down]:data-[starting-style]:[transform:translateX(-50%)_translateY(calc(100%+1rem+2px))] data-[swipe-direction=down]:[transform:translateX(-50%)_translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)))]",
						className,
					)}
					data-slot="drawer-popup"
					data-variant={variant}
					{...props}
				>
					{showHandle && (
						<DrawerHandle
							className={cn(
								variant === "action-sheet"
									? "pointer-events-auto"
									: "hidden group-data-[swipe-direction=down]/drawer-popup:block group-data-[swipe-direction=up]/drawer-popup:block",
							)}
						/>
					)}
					{children}
					{showCloseButton && variant === "default" && (
						<DrawerPrimitive.Close
							aria-label="Close"
							className="absolute top-3 right-3 z-10 hidden group-data-[swipe-direction=left]/drawer-popup:flex group-data-[swipe-direction=right]/drawer-popup:flex"
							render={<Button size="icon-sm" variant="ghost" />}
							{...closeProps}
						>
							<XIcon />
						</DrawerPrimitive.Close>
					)}
				</DrawerPrimitive.Popup>
			</DrawerViewport>
		</DrawerPortal>
	);
}

function DrawerContent({ className, ...props }: DrawerPrimitive.Content.Props) {
	return (
		<DrawerPrimitive.Content
			className={cn("flex min-h-0 flex-1 flex-col", className)}
			data-slot="drawer-content"
			{...props}
		/>
	);
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 p-6 in-[[data-slot=drawer-panel]]:pb-3",
				className,
			)}
			data-slot="drawer-header"
			{...props}
		/>
	);
}

function DrawerFooter({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"div"> & { variant?: "default" | "bare" }) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end",
				variant === "default" && "border-t bg-muted/72 py-4",
				variant === "bare" &&
					"in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pt-3 pt-4 pb-6",
				className,
			)}
			data-slot="drawer-footer"
			{...props}
		/>
	);
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
	return (
		<DrawerPrimitive.Title
			className={cn(
				"font-heading font-semibold text-xl leading-none",
				className,
			)}
			data-slot="drawer-title"
			{...props}
		/>
	);
}

function DrawerDescription({
	className,
	...props
}: DrawerPrimitive.Description.Props) {
	return (
		<DrawerPrimitive.Description
			className={cn("text-muted-foreground text-sm", className)}
			data-slot="drawer-description"
			{...props}
		/>
	);
}

function DrawerPanel({
	className,
	scrollFade = true,
	...props
}: React.ComponentProps<"div"> & { scrollFade?: boolean }) {
	return (
		<ScrollArea scrollFade={scrollFade}>
			<div
				className={cn(
					"p-6 in-[[data-slot=drawer-header]+[data-slot=drawer-content]>&]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1",
					className,
				)}
				data-slot="drawer-panel"
				{...props}
			/>
		</ScrollArea>
	);
}

const drawerActionItemVariants = cva(
	"box-border w-full border-0 bg-transparent px-5 py-4 text-center font-medium text-base outline-none transition-colors focus-visible:bg-accent/60 disabled:pointer-events-none disabled:opacity-50 [:hover,[data-pressed]]:bg-accent/60",
	{
		defaultVariants: {
			variant: "default",
		},
		variants: {
			variant: {
				default: "text-foreground",
				destructive: "text-destructive",
			},
		},
	},
);

function DrawerActionGroup({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"pointer-events-auto overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-lg/5 outline outline-1 outline-border",
				className,
			)}
			data-slot="drawer-action-group"
			{...props}
		/>
	);
}

function DrawerAction({
	className,
	variant,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof drawerActionItemVariants>) {
	return (
		<button
			className={cn(drawerActionItemVariants({ className, variant }))}
			data-slot="drawer-action"
			type="button"
			{...props}
		/>
	);
}

function DrawerActionClose({
	className,
	variant,
	...props
}: DrawerPrimitive.Close.Props &
	VariantProps<typeof drawerActionItemVariants>) {
	return (
		<DrawerPrimitive.Close
			className={cn(drawerActionItemVariants({ className, variant }))}
			data-slot="drawer-action-close"
			{...props}
		/>
	);
}

export {
	DrawerCreateHandle,
	DrawerProvider,
	Drawer,
	DrawerTrigger,
	DrawerSwipeArea,
	DrawerPortal,
	DrawerClose,
	DrawerBackdrop,
	DrawerBackdrop as DrawerOverlay,
	DrawerViewport,
	DrawerPopup,
	DrawerContent,
	DrawerHandle,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
	DrawerPanel,
	DrawerIndentBackground,
	DrawerIndent,
	DrawerActionGroup,
	DrawerAction,
	DrawerActionClose,
};
