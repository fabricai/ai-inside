import minimist from 'minimist';
import fs from 'fs';
import path from 'path';
import { asyncRequest } from './helpers/asyncRequest';
import { IFabricaiInvoice } from '..';
import { API_VERSION_ENDPOINT } from './constants';

let { apiKey, integrationKey, folderRoot } = minimist(process.argv.slice(2));

export interface IInvoiceToPost {
    data: IFabricaiInvoice;
    retentionPolicy: number;
}
/**
 * Post all historic training data to FabricAI's dataset
 */
const postTrainingData = async () => {
    if (!folderRoot || !fs.existsSync(folderRoot) || !fs.statSync(folderRoot).isDirectory()) {
        console.log(
            `Please, pass in the folder as --folderRoot=${folderRoot} with proper JSON invoices (validated against IFabricaiInvoice interface)`
        );
        return;
    }
    if (!apiKey || !integrationKey) {
        console.log(`Please, pass in both --apiKey=${apiKey} and --integrationKey=${integrationKey}`)
        return;
    }
    const headers = {
        'x-api-key': apiKey,
    };
    let havePostedAnyData = false;
    for (const fileName of fs.readdirSync(folderRoot).filter((file) => /\.json$/.test(file))) {
        const pathToFile = path.join(folderRoot, fileName);
        console.log(`Posting :: ${fileName}`);
        // Here we have just taken the IFabricaiInvoice > run it through JSON.stringify() > add appropriate props (IInvoiceToPost) >> save to file
        const stringifiedInvoiceToFabricai = fs.readFileSync(pathToFile, {
            encoding: 'utf-8',
        }) as string;
        const invoiceResponse = await asyncRequest({
            url: `${API_VERSION_ENDPOINT}/ai/training-data/${integrationKey}/invoices`,
            method: 'POST',
            headers,
            body: stringifiedInvoiceToFabricai,
        });
        if (
            invoiceResponse.statusCode !== 200 ||
            !invoiceResponse.json ||
            invoiceResponse.json.status !== 'OK'
        ) {
            console.log(
                `ERROR :: POST :: ${API_VERSION_ENDPOINT}/ai/training-data/${integrationKey}/invoices`
            );
            console.log(invoiceResponse);
            return;
        }
        havePostedAnyData = true;
    }
    if (!havePostedAnyData) {
        console.log(
            `Error :: Most likely ${folderRoot} does not have any invoices to POST (filtered by new RegExp(/\.json$/))`
        );
        return;
    }
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
};
postTrainingData();
