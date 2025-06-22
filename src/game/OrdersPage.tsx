import React from "react";
import ActionQueueView from "./ActionQueueView";

const OrdersPage: React.FC = () => {
	return (
		<div className="flex w-full flex-col items-center p-2 sm:p-4">
			<div className="w-full max-w-4xl">
				<h1 className="mb-4 text-xl font-bold text-white sm:text-2xl">Orders</h1>
				<div className="rounded-lg border border-purple-700/30 bg-gray-900/80 backdrop-blur-md">
					<ActionQueueView />
				</div>
			</div>
		</div>
	);
};

export default OrdersPage;
