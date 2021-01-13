import minimist from 'minimist';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { asyncRequest } from './helpers/asyncRequest';
import { IFabricaiInvoice } from '..';
import { API_VERSION_ENDPOINT } from './constants';
import { getJWTToken } from './helpers/getJWTToken';
import { invoice } from './samples/invoice';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'jsonfile';

let { employeeToken, integrationKey, folderRoot, useSampleInvoice } = minimist(
    process.argv.slice(2)
);

export interface IInvoiceToPost {
    data: IFabricaiInvoice;
    retentionPolicy: number;
}
/**
 * Post all historic training data to FabricAI's dataset
 */
const postTrainingData = async () => {
    if (!folderRoot || !fs.existsSync(folderRoot) || !fs.statSync(folderRoot).isDirectory()) {
        if (!useSampleInvoice) {
            console.log(
                `Please, pass in the folder as --folderRoot=${folderRoot} with proper JSON invoices (validated against IFabricaiInvoice interface)`
            );
            console.log(
                `For simplicity's sake, you may also pass in --useSampleInvoice to loop over the sample and POST it 10 times`
            );
            return;
        }
    }
    if (!employeeToken || !integrationKey) {
        console.log(
            `Please, pass in both --employeeToken=${employeeToken} and --integrationKey=${integrationKey}`
        );
        return;
    }

    let deleteFolderAfterUse = false;
    if (!folderRoot && useSampleInvoice) {
        deleteFolderAfterUse = true;
        const tempFolder = path.join(os.tmpdir(), `fabricai/sample-invoices`);
        console.log(tempFolder);
        if (execSync(`mkdir -p ${tempFolder}`)) {
            for (let i = 0; i < 10; i++) {
                const id = String(Math.round(Math.random() * 100000));
                const temp = Object.assign({}, invoice, { id });
                /**
                 * Remember to add the invoice inside data prop
                 */
                writeFileSync(path.join(tempFolder, `${id}.json`), temp);
            }
        }
        folderRoot = tempFolder;
    }

    let havePostedAnyData = false;
    for (const fileName of fs.readdirSync(folderRoot).filter((file) => /\.json$/.test(file))) {
        const pathToFile = path.join(folderRoot, fileName);
        console.log(`Posting :: ${fileName}`);
        // Here we have just taken the IFabricaiInvoice > run it through JSON.stringify() > add appropriate props (IInvoiceToPost) >> save to file
        const jsonInvoice = readFileSync(pathToFile, {
            encoding: 'utf-8',
        }) as string;

        const invoiceResponse = await asyncRequest({
            url: `${API_VERSION_ENDPOINT}/ai/training-data/invoices`,
            method: 'POST',
            headers: await getJWTToken(employeeToken, integrationKey),
            json: { data: jsonInvoice },
        });
        if (
            invoiceResponse.statusCode !== 200 ||
            !invoiceResponse.json ||
            invoiceResponse.json.status !== 'OK'
        ) {
            console.log(`ERROR :: POST :: ${API_VERSION_ENDPOINT}/ai/training-data/invoices`);
            console.log(invoiceResponse);
            if (deleteFolderAfterUse) {
                execSync(`rm -rf ${folderRoot}`);
            }
            return;
        }
        havePostedAnyData = true;
    }
    if (deleteFolderAfterUse) {
        execSync(`rm -rf ${folderRoot}`);
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
