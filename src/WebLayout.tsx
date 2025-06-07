import "react";
import { ReactNode } from "react";

export const WebLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<div className="relative flex h-dvh flex-col overflow-hidden bg-black text-white select-none">
			<div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover opacity-50"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-purple-950/40"></div>
			<div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>

			<div className="z-10 flex h-full w-full flex-col items-center justify-center p-4 md:w-[calc(100vw)] md:pl-12 md:transition-all md:duration-300 md:ease-in-out">
				{children}
			</div>
		</div>
	);
};
