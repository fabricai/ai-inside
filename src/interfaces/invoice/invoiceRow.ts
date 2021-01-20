import { TVatStatusStringFinland } from '../../types/vatStatus';
import { IFabricaiDimensionItemValue } from './dimensionItemValue';
export interface IFabricaiInvoiceRow {
    /**
     * Unique identification of this invoiceRow
     *
     * E.g.
     * This will and should be used to map the
     * invoiceRow we generate predictions for
     * and the original invoice (e.g. in Finvoice)
     */
    id: string;
    /**
     * Product code
     */
    productCode: string;
    /**
     * Product
     */
    product: string;
    /**
     * Comment for the product
     *
     * E.g. extra info or specifier
     * for the product
     */
    comment: string;
    /**
     * Unit
     *
     * E.g.
     * kWh, h, kg
     */
    unit: string;
    /**
     * Quantity
     */
    quantity: number;
    /**
     * Unit price in original currency
     *
     */
    unitPriceInOriginalCurrency: number;
    /**
     * Value in original currency
     *
     * E.g.
     * If this invoice is in USD
     * this could be 100
     */
    valueInOriginalCurrency: number;
    /**
     * Value in integration's own currency
     *
     * E.g.
     * If this invoice is in USD
     * this could be 82
     */
    value: number;
    /**
     * Vat percent of the invoice
     *
     * NOTE :: This vat percent
     * must be "official" in the
     * integration's country
     *
     * E.g.
     * In the year 2021 the allowed
     * vat percentages are
     * 0, 10, 14 and 24
     */
    vatPercent: number;

    /**
     * Account of the invoice row
     *
     * This must be present in the
     * training material and (naturally)
     * does not exist in the LIVE
     * data
     */
    account: string;
    /**
     * VAT status of the invoice row
     *
     * E.g.
     * Domestic purchase
     * EU Product 24 %
     */
    vatStatus: TVatStatusStringFinland;
    /**
     * Dimension(s) of the invoice row
     */
    dimensionItemValues: IFabricaiDimensionItemValue[];
}
