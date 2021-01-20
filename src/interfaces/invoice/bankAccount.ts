export interface IFabricaiBankAccount {
    /**
     * Valid IBAN number of the bank account
     * Can be either with or without spaces
     *
     * Note :: this must validate against
     * http://simplify.github.io/ibantools/globals.html#isvalidiban
     */
    iban: string;
    /**
     * BIC of the bank
     *
     * This is not validated as this is quite
     * difficult to do - however, if present,
     * please, include it in the object
     */
    bic: string;
}
