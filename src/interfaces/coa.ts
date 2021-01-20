export interface IFabricaiAccount {
    /**
     * Name of the account
     * E.g. "Purchases"
     */
    name: string;
    /**
     * Unique identifier of the account
     * E.g. "4000"
     */
    ledgerAccountCode: string;
}
export interface IFabricaiCOA {
    ledgerAccountCodes: IFabricaiAccount[];
}
