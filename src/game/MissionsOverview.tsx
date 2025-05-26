import "react";
import { PlanetView } from "../../worker/api";

export const MissionsOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	return (
		<div className="pr-2 text-gray-300">
			<p className="py-8 text-center italic">
				Mission overview for {planet.metadata.name} is not yet implemented.
			</p>
		</div>
	);
};
