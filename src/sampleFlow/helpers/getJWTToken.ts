import { IFabricaiEndpointResponseJWT } from '../../interfaces/endpoint';
import { API_VERSION_ENDPOINT } from '../constants';
import { asyncRequest } from './asyncRequest';
interface IGetJWTTokenOutput {
    Authorization: string;
}

let validJWTToken: string = '';
/**
 * This function will convert employeeToken (and optional integrationKey) into a JWT token
 * This function will also cache the JWT token into a variable, so there is no need to
 * refetch an JWT between calls during a single flow
 *
 * NOTE :: If you do not provide an integrationKey - a list of available integrations is provided
 */
export const getJWTToken = async (
    employeeToken: string,
    integrationKey?: string
): Promise<IGetJWTTokenOutput | void> => {
    /**
     * Check if we have this already cached
     * You might want to save the actual token
     * and then check if it has expired, too.
     *
     * Here we assume that everything is done in
     * less time than the token is valid
     */
    if (validJWTToken) {
        return { Authorization: `Bearer ${validJWTToken}` };
    }

    /**
     * Fetch the data
     */
    const params = {
        url: `${API_VERSION_ENDPOINT}/token/session`,
        method: 'get',
        headers: {
            employeeToken,
            integrationKey,
        },
    };
    const response = await asyncRequest(params);
    const json = response.json as IFabricaiEndpointResponseJWT;
    if (response.statusCode !== 200 || !json.data) {
        console.log(params);
        console.log(response);
        throw new Error(`Not valid response from authentication endpoint`);
    }

    const { code, organization } = json.data;
    /**
     * If we have code - it means that this is successful JWT token response
     * Now we can cache this
     */
    if (code) {
        validJWTToken = code;
        return await getJWTToken(employeeToken, integrationKey);
    }

    /**
     * Now we have just a list of integrations
     */
    console.log(`Here is your organization`);
    console.log(organization);
    console.log(`Here are your organization's integrations`);
    console.log(
        Object.keys(organization.integrations ? organization.integrations : {}).join('\r\n')
    );
    console.log(
        `\n\nYou may add to your query --integrationKey="${
            Object.keys(organization.integrations ? organization.integrations : {})[0]
        }"\n\n`
    );
    return;
};
