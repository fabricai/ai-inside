import { IFabricaiAddress } from './address';
import { IFabricaiAttachment } from './attachment';
import { IFabricaiInvoiceRow } from './invoiceRow';
import { IFabricaiPaymentInfo } from './paymentInfo';

export interface IFabricaiInvoice {
    /**
     * Unique id of the invoice
     * This must be unique within
     * this integration - not accross
     * all integrations
     */
    id: string;
    /**
     * Original invoiceNumber
     * usually the "running" id
     * from the accounting software
     */
    invoiceNumber: string;
    /**
     * Date whenever the invoice was
     * created
     *
     * Format YYYY-MM-DD
     */
    invoiceDate: string;
    /**
     * Date whenever the invoice is
     * due
     *
     * Format YYYY-MM-DD
     */
    invoiceDueDate: string;
    /**
     * Info about the seller of the
     * product(s).
     */
    sellerAddress: IFabricaiAddress;
    /**
     * Info about the purchaser of the
     * product(s).
     */
    billingAddress: IFabricaiAddress;
    /**
     * If physical product that requires
     * delivery - the address where the
     * products are delivered
     *
     * This is relevant e.g. if predicting
     * cost center
     */
    deliveryAddress: IFabricaiAddress;
    /**
     * Free formatted text that is added
     * to the invoice both by
     * the seller and e.g. approver or
     * verifier of the invoice
     */
    notes: string;
    /**
     * Your (purchaser's) reference from the invoice
     */
    yourReference: string;
    /**
     * Seller's reference from the invoice
     */
    ourReference: string;
    /**
     * Basic info on how to pay the invoice
     *
     * Here the most relevant are currencyRate
     * currency and iban
     */
    paymentInfo: IFabricaiPaymentInfo;
    /**
     * Total in integration's own currency
     *
     * E.g.
     * If this integration is situated
     * in Finland, then this is in EUR
     */
    invoiceTotal: number;
    /**
     * Total in invoice's original currency
     *
     * E.g.
     * If this invoice is in USD then this
     * is the total in USD
     *
     * The following formula must be true
     * invoiceTotal = invoiceTotalInOriginalCurrency / currencyRate
     */
    invoiceTotalInOriginalCurrency: number;
    /**
     * Invoice rows
     *
     * E.g.
     * Whatever was bought
     */
    invoiceRows: IFabricaiInvoiceRow[];
    /**
     * Attachemnts (including the original e-Invoice)
     * that are related to this invoice
     */
    attachments: IFabricaiAttachment[];
    /**
     * This is javascript timestamp of the invoice
     * You can use this e.g. to compare different versions
     * And to make sure that we have no merge conflicts
     */
    version: number;
    /**
     * This is javascript timestamp of when the invoice
     * was created (either by you or some other sytem)
     * For new invoices... usually version === createdAt
     */
    createdAt: number;
}
