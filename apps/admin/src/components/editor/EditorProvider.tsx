import beautify from "js-beautify";
import juice from "juice";
import { createContext, useContext, useState } from "react";

type EditorContextValue = {
	format: () => void;
	value: string;
	setValue: (value: string) => void;
	inlineCss: () => string;
};

export const EditorContext = createContext<EditorContextValue | undefined>(
	undefined,
);

export function EditorProvider({ children }: { children: React.ReactNode }) {
	const [value, setValue] = useState("");

	const format = () => {
		const formatted = beautify.html(value);
		setValue(formatted);
	};

	const setValueFn = (value: string) => {
		setValue(value);
	};

	const inlineCss = () => {
		return juice(value);
	};

	const context = {
		value,
		format,
		setValue: setValueFn,
		inlineCss,
	};

	return (
		<EditorContext.Provider value={context}>{children}</EditorContext.Provider>
	);
}

export function useEditorContext() {
	const ctx = useContext(EditorContext);
	if (!ctx) {
		throw new Error("useEditorContext must be used within <EditorProvider>");
	}
	return ctx;
}
