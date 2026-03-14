type SvgChild = {
	attrs: Record<string, number | string>;
	tag: "circle" | "line" | "path" | "polyline" | "rect";
};

const baseAttributes = {
	fill: "none",
	stroke: "currentColor",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	"stroke-width": "2",
	viewBox: "0 0 24 24",
	xmlns: "http://www.w3.org/2000/svg",
} as const;

const serializeAttributes = (attrs: Record<string, number | string>) =>
	Object.entries(attrs)
		.map(([key, value]) => `${key}="${String(value)}"`)
		.join(" ");

export const createLucideSvg = (children: SvgChild[]) => {
	const body = children
		.map((child) => `<${child.tag} ${serializeAttributes(child.attrs)} />`)
		.join("");

	return `<svg ${serializeAttributes(baseAttributes)}>${body}</svg>`;
};
