export interface IFabricaiFiscalYear {
    /**
     * Date (ms) before which company's
     * accounting has been closed.
     *
     * This can be eg. the date before
     * which all purchases have been
     * reported to the Tax authority
     */
    fiscalPerdiodTreshold: number;
}
