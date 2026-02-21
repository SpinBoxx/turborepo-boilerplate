// Default values shown
export type FieldErrorLike = string | { message: string };

export function ErrorMessages({ errors }: { errors: Array<FieldErrorLike> }) {
	return (
		<>
			{errors.map((error, index) => (
				<div
					key={`${index}-${typeof error === "string" ? error : error.message}`}
					className="mt-1 text-left font-bold text-red-500 text-sm"
				>
					{typeof error === "string" ? error : error.message}
				</div>
			))}
		</>
	);
}
