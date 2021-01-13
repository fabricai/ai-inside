import minimist from 'minimist';
import { API_VERSION_ENDPOINT } from './constants';
import { asyncRequest } from './helpers/asyncRequest';

import { sessionInfo } from './samples/sessionInfo';
import { fiscalYears } from './samples/fiscalYears';
import { dimensions } from './samples/dimensions';
import { coa } from './samples/coa';
import { invoice } from './samples/invoice';
import { getJWTToken } from './helpers/getJWTToken';

let { employeeToken, integrationKey } = minimist(process.argv.slice(2));

/**
 * Setup integration by POST ing basic information
 */
const setupIntegration = async (): Promise<void> => {
    if (!employeeToken) {
        console.log(`Please, pass in --employeeToken=${employeeToken} to this function as a param`);
        return;
    }
    console.log(
        [
            ``,
            `**** INFO ***`,
            `\t--employeeToken=${employeeToken}`,
            `\t--integrationKey=${integrationKey}`,
            `\t--endpoint=${API_VERSION_ENDPOINT}`,
            ``,
        ].join('\r\n')
    );

    /**
     * If we have not integrationKey :: fetch it from the api first
     *
     * just select the first one
     */
    if (!integrationKey) {
        await asyncRequest({
            url: `${API_VERSION_ENDPOINT}/integrations`,
            method: 'GET',
            headers: await getJWTToken(employeeToken, integrationKey),
        });
        return;
    }

    console.log(`Setup integration ${integrationKey}`);
    console.log(`Send SessionInfo`);
    const sessionResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/sessioninfo`,
        method: 'POST',
        headers: await getJWTToken(employeeToken, integrationKey),
        json: { data: sessionInfo },
    });
    if (sessionResponse.statusCode !== 200) {
        console.log(sessionResponse);
        return;
    }
    console.log(`\tok`);
    console.log(`Send FiscalYears`);
    const fiscalYearsResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/fiscalyears`,
        method: 'POST',
        headers: await getJWTToken(employeeToken, integrationKey),
        json: { data: fiscalYears },
    });
    if (fiscalYearsResponse.statusCode !== 200) {
        console.log(fiscalYearsResponse);
        return;
    }
    console.log(`\tok`);
    console.log(`Send Dimensions`);
    const dimensionsResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/dimensions`,
        method: 'POST',
        headers: await getJWTToken(employeeToken, integrationKey),
        json: { data: dimensions },
    });
    if (dimensionsResponse.statusCode !== 200) {
        console.log(dimensionsResponse);
        return;
    }
    console.log(`\tok`);
    console.log(`Send COA`);
    const coaResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/coa`,
        method: 'POST',
        headers: await getJWTToken(employeeToken, integrationKey),
        json: { data: coa },
    });
    if (coaResponse.statusCode !== 200) {
        console.log(coaResponse);
        return;
    }
    console.log(`\tok`);
    console.log('Send one invoice for training data');
    const invoiceResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/invoices`,
        method: 'POST',
        headers: await getJWTToken(employeeToken, integrationKey),
        json: { data: invoice, retentionPolicy: 1601856000000 },
    });
    if (invoiceResponse.statusCode !== 200) {
        console.log(invoiceResponse);
        return;
    }
    console.log(`\tok`);
    console.log(
        [
            ``,
            `***** SUCCESS ****`,
            ``,
            `Setting up this integration with basic data (and one sample invoice for training) was successful`,
            ``,
            `\t-integrationKey  ${integrationKey}`,
            `\t-name            ${sessionInfo.name}`,
            ``,
            ``,
            `In reality - you should next send all invoices from last two to three years to gain best possible`,
            `data for model(s). Once you have POSTed all training invoices to you dataset - you should ask us`,
            `to start model training. This will take (depending on how much data there is) from around one hour`,
            `up till a day or so.`,
            ``,
            ``,
            `To see the updated data (formatted a bit different) you may e.g.`,
            ``,
            `\tcurl -X GET '${API_VERSION_ENDPOINT}/integrations/coa' -H 'Authorization: ${await (
                (await getJWTToken(employeeToken, integrationKey)) || {}
            ).Authorization}'`,
            ``,
            ``,
            `Next - you need to parse the historic data with labels and POST`,
            `them to ${API_VERSION_ENDPOINT}/ai/training-data/invoices`,
            ``,
            ``,
        ].join('\r\n')
    );
};
setupIntegration();
