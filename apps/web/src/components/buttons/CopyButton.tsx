import { cn } from "@zanadeal/ui";
import { CheckIcon, CopyIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { Button, type ButtonProps } from "@/components/ui/button";

interface Props
	extends Omit<ComponentProps<"button">, "onClick">,
		ButtonProps {}

export default function CopyButton({ className, variant, size }: Props) {
	const [copied, setCopied] = useState(false);
	const t = useIntlayer("common");

	const handleCopy = () => {
		navigator.clipboard.writeText("Text copied!");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button
			aria-label={copied ? t.copied.value : t.copyToClipboard.value}
			onClick={handleCopy}
			size={size || "icon"}
			variant={variant || "outline"}
			className={cn("", className)}
		>
			{copied ? (
				<CheckIcon aria-hidden="true" />
			) : (
				<CopyIcon aria-hidden="true" />
			)}
		</Button>
	);
}
