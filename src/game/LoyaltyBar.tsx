import React from "react";

interface LoyaltyBarProps {
	loyalty: number;
	playerColor: string;
	opponentColor: string;
}

const LoyaltyBar: React.FC<LoyaltyBarProps> = ({
	loyalty,
	playerColor,
	opponentColor,
}) => {
	const loyaltyToPlayer = loyalty;
	const loyaltyToOpponent = 100 - loyalty;

	return (
		<div title={`Popular support ${loyalty}%`}>
			<div className="flex h-[6px] w-full overflow-hidden">
				<div className={playerColor} style={{ width: `${loyaltyToPlayer}%` }} />
				<div
					className={opponentColor}
					style={{ width: `${loyaltyToOpponent}%` }}
				/>
			</div>
		</div>
	);
};

export default LoyaltyBar;
