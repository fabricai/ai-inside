import { createCheckers } from 'ts-interface-checker';
import { IValidationOutput } from '../helpers/interfaces';
import { IFabricaiDimensions } from '../interfaces/dimensions';
import validator from '../interfaces/dimensions-ti';
/**
 *
 * @param value
 * @param verbose
 */
export const dimensions = (value: IFabricaiDimensions, verbose?: boolean): IValidationOutput => {
    const { IFabricaiDimensions: validateFabricai } = createCheckers(validator);
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
