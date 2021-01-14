import minimist from 'minimist';
import { API_VERSION_ENDPOINT } from './constants';
import { asyncRequest } from './helpers/asyncRequest';

import { sessionInfo } from './samples/sessionInfo';
import { getJWTToken } from './helpers/getJWTToken';

let { employeeToken, createFirstIntegration, forceCreateNewIntegration } = minimist(
    process.argv.slice(2)
);

/**
 * Setup integration by POST ing basic information
 */
const createIntegration = async (): Promise<void> => {
    if (!employeeToken) {
        console.log(`Please, pass in --employeeToken=${employeeToken} to this function as a param`);
        return;
    }
    console.log(
        [
            ``,
            `**** INFO ***`,
            `\t--employeeToken=${employeeToken}`,
            `\t--endpoint=${API_VERSION_ENDPOINT}`,
            `\t--createFirstIntegration=${createFirstIntegration}`,
            `\t--forceCreateNewIntegration=${forceCreateNewIntegration}`,
            ``,
        ].join('\r\n')
    );

    /**
     * Let's make a connection with your organization (and get JWT)
     */
    const response = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/organizations`,
        method: 'GET',
        headers: await getJWTToken(employeeToken),
    });
    if (response.statusCode !== 200) {
        console.log(response);
        console.log(
            `Error :: cannot auth to the REST API endpoint - please, double check your employeeToken`
        );
        return;
    }
    console.log(`Here is your very own organization`);
    console.log(response.json.data);
    if (response.json.data.organization.integrations) {
        console.log(`You have already following integrations setup`);
        console.log(Object.keys(response.json.data.organization.integrations).join('\r\n'));
        console.log(
            `\n\nYou may go to the next step by specifying one of these like\n\n\t--integrationKey=${
                Object.keys(response.json.data.organization.integrations)[0]
            }\n\n`
        );
        if (!forceCreateNewIntegration) {
            return;
        }
    }
    if (!createFirstIntegration && !forceCreateNewIntegration) {
        console.log(`This seems to be a "fresh" organization and no integrations`);
        console.log(
            `Run this again with flag --createFirstIntegration to setup a demo integration`
        );
        console.log(
            `Don't worry - we can clean all this up later so feel free to try out different things!`
        );
        return;
    }

    const createIntegrationResponse = await asyncRequest({
        url: `${API_VERSION_ENDPOINT}/organizations/integrations`,
        method: 'POST',
        headers: await getJWTToken(employeeToken),
        json: { data: sessionInfo },
    });
    if (createIntegrationResponse.statusCode !== 200) {
        console.log(createIntegrationResponse);
        return;
    }
    console.log(`Successfully created a new integration`);
    console.log(
        `Now you can go to the next step by useing\n\n\t--integrationKey=${createIntegrationResponse.json.data.integration.integrationKey}\n\n`
    );
};
createIntegration();
