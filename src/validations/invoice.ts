import moment from 'moment';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import { createCheckers } from 'ts-interface-checker';
import { IValidationOutput } from '../helpers/interfaces';
import { IFabricaiInvoice } from '../interfaces/invoice';
import validator from '../interfaces/invoice/index-ti';

import { MAXIMUM_ALLOWED_DIFFERENCE_BETWEEN_TWO_EQUAL_VALUES } from '../variables';
import { TISOCountry } from '../types/country';
import { allowedVatPercentage } from '../constants/vatPercentage';
/**
 * Checks whether the invoice is valid AND its math is valid and sound
 * Also check that mimeType of each attachment matches magic number
 *
 * The rest of the validations will be
 * @param value valid FabricAI invoice
 * @param invoiceRecepientCountry country of the integration (at the moment should be just FI)
 * @param verbose whether to print out the reason for failuer
 */
export const invoice = async (
    value: IFabricaiInvoice,
    invoiceRecepientCountry: TISOCountry = 'FI',
    verbose?: boolean
): Promise<IValidationOutput> => {
    const { IFabricaiInvoice: validateFabricai } = createCheckers(validator);
    try {
        validateFabricai.check(value);
    } catch (e) {
        if (verbose) {
            console.log(e);
        }
        return { isValid: false, message: e && e.message ? e.message : JSON.stringify(e) };
    }

    const {
        id,
        invoiceDate,
        invoiceDueDate,
        invoiceRows,
        invoiceTotal,
        invoiceTotalInOriginalCurrency,
        paymentInfo: { currencyRate },
    } = value;

    if (typeof id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(id)) {
        const message = `For invoice ${value.id} validations failed :: the invoice's id must be of type string and meet RegExp(/^[a-zA-Z0-9-]+$/)`;
        if (verbose) {
            console.log(message);
        }
        return { isValid: false, message };
    }

    /**
     * Make sure that all dates are valid and in the format YYYY-MM-DD
     */
    if (!moment(invoiceDate, 'YYYY-MM-DD', true).isValid()) {
        const message = `For invoice ${value.id} validations failed :: invoiceDate (${invoiceDate}) is not format YYYY-MM-DD`;
        if (verbose) {
            console.log(message);
        }
        return { isValid: false, message };
    }
    if (!moment(invoiceDueDate, 'YYYY-MM-DD', true).isValid()) {
        const message = `For invoice ${value.id} validations failed :: invoiceDueDate (${invoiceDueDate}) is not format YYYY-MM-DD`;
        if (verbose) {
            console.log(message);
        }
        return { isValid: false, message };
    }

    for (const { base64, mimeType, id: attachmentId } of value.attachments) {
        const fileTypeFromBase64 = await fileTypeFromBuffer(Buffer.from(base64, 'base64'));
        if (!fileTypeFromBase64 || fileTypeFromBase64.mime !== mimeType) {
            const message = `For invoice ${value.id} attachments[].id === ${attachmentId} declared mimeType is not the same as when checked from magic number. This attachment may be corrupted or something else may be astray...`;
            return {
                isValid: false,
                message,
            };
        }
    }

    /**
     * Make sure that on the invoice level the currency conversion works
     */
    if (
        Math.abs(invoiceTotal - invoiceTotalInOriginalCurrency / currencyRate) >
        MAXIMUM_ALLOWED_DIFFERENCE_BETWEEN_TWO_EQUAL_VALUES
    ) {
        const message = `For invoice ${value.id} validations failed :: Math.abs(invoiceTotal - invoiceTotalInOriginalCurrency / currencyRate) > ${MAXIMUM_ALLOWED_DIFFERENCE_BETWEEN_TWO_EQUAL_VALUES}`;
        if (verbose) {
            console.log(message);
        }
        return { isValid: false, message };
    }

    /**
     * Make sure that this also holds on every single invoiceRow
     */
    if (
        invoiceRows.some(
            ({ value, valueInOriginalCurrency }) =>
                Math.abs(value - valueInOriginalCurrency / currencyRate) >
                MAXIMUM_ALLOWED_DIFFERENCE_BETWEEN_TWO_EQUAL_VALUES
        )
    ) {
        const message = `For invoice ${value.id} validations failed :: invoiceRows.some(({ value, valueInOriginalCurrency }) => Math.abs(value - valueInOriginalCurrency / currencyRate) > MAXIMUM_ALLOWED_DIFFERENCE_BETWEEN_TWO_EQUAL_VALUES)`;
        if (verbose) {
            console.log(message);
        }
        return { isValid: false, message };
    }

    /**
     * Make sure that total from invoiceRows equals invoiceRow total
     */
    const invoiceTotalFromInvoiceRows = invoiceRows.reduce((a, b) => a + b.value, 0);
    if (
        Math.abs(invoiceTotal - invoiceTotalFromInvoiceRows) >
        MAXIMUM_ALLOWED_DIFFERENCE_BETWEEN_TWO_EQUAL_VALUES
    ) {
        const message = `For invoice ${value.id} validations failed :: Math.abs(invoiceTotal - invoiceTotalFromInvoiceRows) > MAXIMUM_ALLOWED_DIFFERENCE_BETWEEN_TWO_EQUAL_VALUES`;
        if (verbose) {
            console.log(message);
        }
        return { isValid: false, message };
    }

    /**
     * Make sure that vatRate is found
     *
     * Note :: use vatDeductionPercent to adjust the vatRate if necessary
     */
    const year = invoiceDate.split('-')[0];
    const allowedVatRatesForCountry =
        allowedVatPercentage[invoiceRecepientCountry] &&
        allowedVatPercentage[invoiceRecepientCountry][year]
            ? allowedVatPercentage[invoiceRecepientCountry][year]
            : [];
    for (const invoiceRow of invoiceRows) {
        if (!allowedVatRatesForCountry.includes(invoiceRow.vatPercent)) {
            const message = `For invoice ${value.id} validations failed :: the invoiceRow ${
                invoiceRow.id
            } does not have a valid vatPercent [ ${allowedVatRatesForCountry.join(
                ', '
            )} ] for year ${year} :: now it is ${invoiceRow.vatPercent}`;
            if (verbose) {
                console.log(message);
            }
            return { isValid: false, message };
        }
    }
    return { isValid: true };
};
