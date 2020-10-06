import minimist from 'minimist';
import { API_VERSION_ENDPOINT } from './constants';
import { asyncRequest } from './helpers/asyncRequest';

import { sessionInfo } from './samples/sessionInfo';
import { fiscalYears } from './samples/fiscalYears';
import { dimensions } from './samples/dimensions';
import { coa } from './samples/coa';
import { invoice } from './samples/invoice';

let { apiKey, integrationKey } = minimist(process.argv.slice(2));

/**
 * Setup integration by POST ing basic information
 */
const setupIntegraiton = async (): Promise<void> => {
    if (!apiKey) {
        console.log(`Please, pass in --apiKey=${apiKey} to this function as a param`);
        return;
    }
    console.log(
        [
            ``,
            `**** INFO ***`,
            `\t-apiKey=${apiKey}`,
            `\t-integrationKey=${integrationKey}`,
            `\t-endpoint=${API_VERSION_ENDPOINT}`,
            ``,
        ].join('\r\n')
    );
    const headers = {
        'x-api-key': apiKey,
    };
    /**
     * If we have not integrationKey :: fetch it from the api first
     *
     * just select the first one
     */
    if (!integrationKey) {
        const integrationsResponse = await asyncRequest({
            url: `${API_VERSION_ENDPOINT}/integrations`,
            method: 'GET',
            headers,
        });
        if (integrationsResponse.statusCode !== 200) {
            console.log(integrationsResponse);
            return;
        }
        if (!Array.isArray(integrationsResponse.json) || integrationsResponse.json.length === 0) {
            console.log(`Please, contact FabricAI to get organization setup`);
            console.log(integrationsResponse);
            return;
        }
        console.log(
            `Ok :: have following integrations [ ${integrationsResponse.json.join(
                ', '
            )} ], just choose first for demo`
        );
        integrationKey = integrationsResponse.json[0] as string;
    }

    console.log(`Setup integration ${integrationKey}`);
    console.log(`Send SessionInfo`);
    const sessionResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/${integrationKey}/sessioninfo`,
        method: 'POST',
        headers,
        json: { data: sessionInfo },
    });
    if (sessionResponse.statusCode !== 200) {
        console.log(sessionResponse);
        return;
    }
    console.log(`Send FiscalYears`);
    const fiscalYearsResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/${integrationKey}/fiscalyears`,
        method: 'POST',
        headers,
        json: { data: fiscalYears },
    });
    if (fiscalYearsResponse.statusCode !== 200) {
        console.log(fiscalYearsResponse);
        return;
    }
    console.log(`Send Dimensions`);
    const dimensionsResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/${integrationKey}/dimensions`,
        method: 'POST',
        headers,
        json: { data: dimensions },
    });
    if (dimensionsResponse.statusCode !== 200) {
        console.log(dimensionsResponse);
        return;
    }

    console.log(`Send COA`);
    const coaResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/${integrationKey}/coa`,
        method: 'POST',
        headers,
        json: { data: coa },
    });
    if (coaResponse.statusCode !== 200) {
        console.log(coaResponse);
        return;
    }

    console.log('Send one invoice for training data');
    const invoiceResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/ai/training-data/${integrationKey}/invoices`,
        method: 'POST',
        headers,
        json: { data: invoice, retentionPolicy: 1601856000000 },
    });
    if (invoiceResponse.statusCode !== 200) {
        console.log(invoiceResponse);
        return;
    }

    console.log(
        [
            ``,
            `***** SUCCESS ****`,
            ``,
            `Setting up this integration was successful`,
            `\t-integrationKey  ${integrationKey}`,
            `\t-name            ${sessionInfo.name}`,
            ``,
            `To see the updated data (formatted a bit different) you may e.g.`,
            `curl -X GET '${API_VERSION_ENDPOINT}/accounting/${integrationKey}/coa' -H 'x-api-key: ${apiKey}'`,
            ``,
            ``,
            `Next - you need to parse the historic data with labels and POST`,
            `them to ${API_VERSION_ENDPOINT}/ai/training-data/invoices`,
            ``,
            ``,
        ].join('\r\n')
    );
};
setupIntegraiton();
