import { IFabricaiInvoice } from '../../interfaces/invoice';
import { sessionInfo } from './sessionInfo';

export const invoice: IFabricaiInvoice = {
    id: 'invoiceId',
    invoiceNumber: 'invoiceNumber',
    invoiceDate: '2020-10-05',
    invoiceDueDate: '2020-10-19',
    invoiceTotal: 100,
    invoiceTotalInOriginalCurrency: 100,
    /**
     * NOTE :: Here we use just sessionInfo
     * as this is same interface as the "real"
     * address for seller, billing and delivery
     */
    sellerAddress: sessionInfo,
    billingAddress: sessionInfo,
    deliveryAddress: sessionInfo,
    notes: 'Accountant is happy to use AI Inside by FabricAI',
    yourReference: 'FAI-IS-BEST',
    ourReference: 'We <3 FAI',
    paymentInfo: {
        currency: 'EUR',
        currencyRate: 1,
        bankAccount: {
            iban: '',
            bic: '',
        },
    },
    invoiceRows: [
        {
            id: 'invoiceRowId',
            product: 'AI Inside by FabricAI',
            productCode: 'AI_FAI',
            unit: 'PCS',
            quantity: 100,
            unitPriceInOriginalCurrency: 1,
            value: 100,
            valueInOriginalCurrency: 100,
            vatPercent: 24,
            comment: '',
            account: '',
            vatStatus: 'vat_1',
            dimensionItemValues: [],
        },
    ],
    version: new Date().valueOf(),
    createdAt: new Date().valueOf(),
    attachments: [],
};
