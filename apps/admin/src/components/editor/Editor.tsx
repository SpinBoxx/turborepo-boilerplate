import EditorHtml from "./EditorHtml";

interface Props {
	language: "html";
	setValue: (content: string) => void;
	className?: string;
	value?: string;
}

const Editor = ({ language, setValue, className, value }: Props) => {
	if (language === "html")
		return (
			<EditorHtml value={value} setValue={setValue} className={className} />
		);
};

export default Editor;
