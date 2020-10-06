import { IFabricaiAddress } from './address';
import { IFabricaiAttachment } from './attachment';
import { IFabricaiInvoiceRow } from './invoiceRow';
import { IFabricaiPaymentInfo } from './paymentInfo';

export interface IFabricaiInvoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDueDate: string;
    sellerAddress: IFabricaiAddress;
    billingAddress: IFabricaiAddress;
    deliveryAddress: IFabricaiAddress;
    notes: string;
    yourReference: string;
    ourReference: string;
    paymentInfo: IFabricaiPaymentInfo;
    invoiceTotal: number;
    invoiceTotalInOriginalCurrency: number;
    invoiceRows: IFabricaiInvoiceRow[];
    attachments: IFabricaiAttachment[];
    // This is javascript timestamp of the invoice
    // You can use this e.g. to compare different versions
    // And to make sure that we have no merge conflicts
    version: number;
    // This is javascript timestamp of when the invoice
    // was created (either by you or some other sytem)
    // For new invoices... usually version === createdAt
    createdAt: number;
}
