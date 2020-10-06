import { TVatStatusStringFinland } from "../../types/vatStatus";
import { IFabricaiDimensionItemValue } from "./dimensionItemValue";
export interface IFabricaiInvoiceRow {
  id: string;
  productCode: string;
  product: string;
  comment: string;
  unit: string;
  quantity: number;
  unitPriceInOriginalCurrency: number;
  valueInOriginalCurrency: number;
  value: number;
  vatPercent: number;

  // For training data this is filled
  // For prediction these are empty
  account: string;
  vatStatus: TVatStatusStringFinland;
  dimensionItemValues: IFabricaiDimensionItemValue[];
}
