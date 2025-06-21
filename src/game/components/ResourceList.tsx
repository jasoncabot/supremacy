import { SelectableItemWithLocation } from "../../hooks/useSelectionContext";
import MiniCardView from "../MiniCardView";

interface BaseResource {
	id: string;
	name: string;
	type: string;
	subtype: string;
}

interface ResourceListProps<T extends BaseResource> {
	resources: T[];
	getImagePairs: (resource: T) => Array<{
		foreground: string;
		background: string;
		overlay?: string;
	}>;
	getSelectableItem: (resource: T) => SelectableItemWithLocation | undefined;
	emptyMessage: string;
	className?: string;
}

export const ResourceList = <T extends BaseResource>({
	resources,
	getImagePairs,
	getSelectableItem,
	emptyMessage,
	className = "",
}: ResourceListProps<T>) => {
	return (
		<div className={`flex flex-1 flex-col ${className}`}>
			<div className="scrollbar-none flex-1 overflow-auto">
				{resources.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2">
						{resources.map((resource: T) => (
							<MiniCardView
								key={resource.id}
								imagePairs={getImagePairs(resource)}
								displayText={resource.name}
								selectableItem={getSelectableItem(resource)}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-1 items-center justify-center">
						<p className="text-center text-slate-400 italic">{emptyMessage}</p>
					</div>
				)}
			</div>
		</div>
	);
};
