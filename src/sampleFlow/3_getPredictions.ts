import minimist from 'minimist';
import fs from 'fs';
import { asyncRequest } from './helpers/asyncRequest';
import { IFabricaiInvoice } from '..';
import { asyncDelay } from './helpers/asyncDelay';
import { API_VERSION_ENDPOINT } from './constants';
import { getJWTToken } from './helpers/getJWTToken';
import { invoice } from './samples/invoice';

let { employeeToken, integrationKey, fileToPost, useSampleInvoice } = minimist(
    process.argv.slice(2)
);

export interface IInvoiceToPostSample {
    data: IFabricaiInvoice;
}

/**
 * Post all historic training data to FabricAI's dataset
 */
const postTrainingData = async () => {
    if (!fileToPost || !fs.existsSync(fileToPost)) {
        if (!useSampleInvoice) {
            console.log(`Please, pass in file to post --fileToPost=${fileToPost}`);
            return;
        }
    }

    const invoiceToPost: IInvoiceToPostSample = fileToPost
        ? {
              data: JSON.parse(fs.readFileSync(fileToPost, { encoding: 'utf-8' })),
          }
        : { data: invoice };

    const invoiceResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/data/predict`,
        method: 'POST',
        headers: await getJWTToken(employeeToken, integrationKey),
        json: invoiceToPost,
    });

    if (invoiceResponse.statusCode !== 200) {
        console.log(invoiceResponse);
        return;
    }
    await asyncDelay(5000);
    while (true) {
        /**
         * Use param invoiceKey from response to GET this specific prediction once
         * it is completed.
         *
         * Using invoiceId is also possible, but here you will need to QUERY the
         * endpoint and then you will get an ARRAY of invoice predictions in response
         * that all share the same invoiceId
         *
         * E.g. GET /v3/data?invoiceId=${invoiceId}
         */
        const resultResponse = await asyncRequest({
            url: `${API_VERSION_ENDPOINT}/data/${invoiceResponse.json.data.invoiceKey}`,
            method: 'GET',
            headers: await getJWTToken(employeeToken, integrationKey),
        });
        if (resultResponse.statusCode === 200 && resultResponse.json) {
            console.log(
                [
                    ``,
                    `***** SUCCESS ****`,
                    ``,
                    `You have successfully:`,
                    `\t1. Authenticated to the endpoint`,
                    `\t2. Setup a new integration`,
                    `\t3. Provided training data`,
                    `\t4. Created an AI model`,
                    `\t5. Used the model to generate predictions`,
                    ``,
                    `Sweet!`,
                    ``,
                ].join('\r\n')
            );
            return resultResponse.json;
        }
        console.log(`Nothing yet... wait for another ${resultResponse.json.retryDelayMs} ms`);
        await asyncDelay(resultResponse.json.retryDelayMs);
    }
};
postTrainingData().then((s) => {
    console.log(s);
});
