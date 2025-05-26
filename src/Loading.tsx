import { ArrowPathIcon } from "@heroicons/react/24/solid";

export const Loading: React.FC<{ text?: string }> = ({
	text = "Loading...",
}) => {
	return (
		<div className="flex min-h-screen items-center justify-center text-2xl text-white">
			<div className="flex flex-col items-center">
				<ArrowPathIcon className="mb-4 h-8 w-8 animate-spin text-indigo-300" />
				<span className="animate-pulse font-mono text-indigo-300">{text}</span>
			</div>
		</div>
	);
};
