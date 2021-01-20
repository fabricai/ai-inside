export interface IFabricaiDimensionItemValue {
    /**
     * Dimension id is e.g. "Project"
     */
    dimensionId: string;
    /**
     * Item id belongs in Dimension and is specifier - e.g. "Product xx development"
     */
    itemId: string;
    /**
     * Value in euro(s) in the session's currency ...
     * Currently all dimensions are normalized to 100 % of invoiceRow's value
     *
     * E.g.
     * invoiceRow.value = 100
     * dimensionId: 1, itemId: 2, value: 15  >> value will be converted to 31.91
     * dimensionId: 1, itemId: 3, value: 32  >> value will be converted to 68.09
     * dimensionId: 4, itemId: 6, value: 100 >> value will be converted to 100.00
     */
    value: number;
}
