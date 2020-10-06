export interface IFabricaiAccount {
  name: string;
  ledgerAccountCode: string;
}
export interface IFabricaiCOA {
  ledgerAccountCodes: IFabricaiAccount[];
}
