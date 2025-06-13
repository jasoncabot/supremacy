import MiniCardView from '../MiniCardView';
import { SelectableItem } from '../../hooks/useSelectionContext';

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
  getSelectableItem: (resource: T) => SelectableItem | undefined;
  emptyMessage: string;
  className?: string;
}

export const ResourceList = <T extends BaseResource>({
  resources,
  getImagePairs,
  getSelectableItem,
  emptyMessage,
  className = ""
}: ResourceListProps<T>) => {
  return (
    <div className={`flex flex-col flex-1 ${className}`}>
      <div className="flex-1 overflow-auto scrollbar-none">
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <p className="text-center text-slate-400 italic">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
