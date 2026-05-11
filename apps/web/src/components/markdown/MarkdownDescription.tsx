import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";

type MarkdownDescriptionProps = Omit<ComponentProps<"div">, "children"> & {
	children: string;
};

const allowedElements = ["p", "br", "strong", "em", "ul", "ol", "li", "a"];

export default function MarkdownDescription({
	children,
	className,
	...props
}: MarkdownDescriptionProps) {
	return (
		<div
			className={cn(
				"space-y-2 text-pretty [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc",
				className,
			)}
			{...props}
		>
			<ReactMarkdown
				allowedElements={allowedElements}
				remarkPlugins={[remarkBreaks]}
				components={{
					a: ({ node: _node, ...anchorProps }) => (
						<a
							{...anchorProps}
							rel="noopener noreferrer"
							target={
								anchorProps.href?.startsWith("http") ? "_blank" : undefined
							}
						/>
					),
				}}
			>
				{children}
			</ReactMarkdown>
		</div>
	);
}
