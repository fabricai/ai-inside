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

    const invoiceId = invoiceToPost.data.id;
    const invoiceResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/data/predict`,
        method: 'POST',
        headers: await getJWTToken(employeeToken, integrationKey),
        json: invoiceToPost,
    });
    console.log(invoiceResponse);
    return;
    if (invoiceResponse.statusCode !== 200) {
        console.log(invoiceResponse);
        return;
    }
    while (true) {
        await asyncDelay(5000);
        const resultResponse = await asyncRequest({
            url: `${API_VERSION_ENDPOINT}/data?invoiceId=${invoiceId}`,
            method: 'GET',
            headers: await getJWTToken(employeeToken, integrationKey),
        });
        if (resultResponse.statusCode === 200 && resultResponse.json) {
            console.log(
                [
                    ``,
                    `***** SUCCESS ****`,
                    ``,
                    `Setting up training data for this integration was successful`,
                    `\t-integrationKey  ${integrationKey}`,
                    ``,
                    `Next - you need to ask us to train the model(s)!`,
                    ``,
                    ``,
                ].join('\r\n')
            );
            return resultResponse.json;
        }
    }
};
postTrainingData().then((s) => {
    console.log(s);
});
