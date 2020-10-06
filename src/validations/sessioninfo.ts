import { createCheckers } from 'ts-interface-checker';
import { IValidationOutput } from '../helpers/interfaces';
import { IFabricaiSessionInfo } from '../interfaces/sessioninfo';
import validator from '../interfaces/sessioninfo-ti';
/**
 *
 * @param value
 * @param verbose
 */
export const sessioninfo = (value: IFabricaiSessionInfo, verbose?: boolean): IValidationOutput => {
    const { IFabricaiSessionInfo: validateFabricai } = createCheckers(validator);
    try {
        validateFabricai.check(value);
    } catch (e) {
        if (verbose) {
            console.log(e);
        }
        return { isValid: false, message: e && e.message ? e.message : JSON.stringify(e) };
    }
    return { isValid: true };
};
