import { html } from "@codemirror/lang-html";
import CodeMirror from "@uiw/react-codemirror";
import { cn } from "@zanadeal/ui";
import { useEffect } from "react";
import { useEditorContext } from "./EditorProvider";

interface Props {
	setValue?: (content: string) => void;
	className?: string;
	value?: string;
}

const EditorHtml = ({ setValue, className, value }: Props) => {
	const { setValue: setValueContext, value: contextValue } = useEditorContext();

	const onChange = (content: string) => {
		setValueContext(content);
		if (setValue) {
			setValue(content);
		}
	};

	useEffect(() => {
		if (value) {
			setValueContext(value);
		}
	}, [value]);

	return (
		<CodeMirror
			value={value ?? contextValue}
			className={cn("h-[400px]", className)}
			theme={"dark"}
			height="100%"
			extensions={[html()]}
			onChange={onChange}
		/>
	);
};

export default EditorHtml;
