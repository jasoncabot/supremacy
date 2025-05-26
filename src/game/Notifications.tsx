import React from "react";
import { GameView } from "../../worker/api";

interface NotificationsProps {
	notifications: GameView["notifications"];
	onMarkRead: (id: string) => void;
	className?: string;
}

const Notifications: React.FC<NotificationsProps> = ({
	notifications,
	onMarkRead,
	className = "",
}) => (
	<div className={`rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 p-5 shadow-xl ${className}`}>
		<div className="mb-3 flex items-center gap-2">
			<h3 className="text-lg font-bold tracking-wide text-purple-300 [text-shadow:_0_0_8px_theme(colors.purple.700)]">
				Notifications
			</h3>
		</div>
		{notifications.length === 0 ? (
			<div className="text-slate-400">No notifications</div>
		) : (
			notifications.map((n) => (
				<div
					key={n.id}
					className={`mb-3 rounded-lg p-3 shadow transition-all ${n.read ? "bg-slate-800/60 text-slate-400" : "border border-purple-500/30 bg-purple-900/60 text-white"}`}
				>
					<span>{n.message}</span>
					{!n.read && (
						<button
							className="ml-3 h-8 rounded bg-purple-700/60 px-3 py-1 text-xs font-semibold text-purple-200 transition-all duration-200 hover:bg-purple-600/80 focus:ring-2 focus:ring-purple-400 focus:outline-none"
							onClick={() => onMarkRead(n.id)}
						>
							Mark as read
						</button>
					)}
				</div>
			))
		)}
	</div>
);

export default Notifications;
