export interface IFabricaiDimensionItem {
  itemId: string;
  codeName: string;
}
export interface IFabricaiDimension {
  id: string;
  name: string;
  items: IFabricaiDimensionItem[];
}
export interface IFabricaiDimensions {
  dimensions: IFabricaiDimension[];
}
