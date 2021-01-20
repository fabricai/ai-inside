export interface IFabricaiDimensionItem {
    /**
     * Unique idientifier of the dimension item.
     * Note that the id and name can be equal.
     *
     * E.g. "2" or "AI Inside"
     */
    itemId: string;
    /**
     * Name of the dimension item
     *
     * E.g. "AI Inside"
     */
    codeName: string;
}
export interface IFabricaiDimension {
    /**
     * Unique identifier of the dimension
     * "family". Note that the id and
     * Name of the dimension can be
     * equal.
     *
     * E.g "1" or "Project"
     */
    id: string;
    /**
     * Name of the dimension dimension
     * "family"
     *
     * E.g. "Project"
     */
    name: string;
    /**
     * List of the dimension items
     * that belong to this dimension
     */
    items: IFabricaiDimensionItem[];
}
export interface IFabricaiDimensions {
    dimensions: IFabricaiDimension[];
}
