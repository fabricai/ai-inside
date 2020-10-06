import { IFabricaiCOA } from '../interfaces/coa';
import { createCheckers } from 'ts-interface-checker';
import validator from '../interfaces/coa-ti';
import { IValidationOutput } from '../helpers/interfaces';
/**
 *
 * @param value
 * @param verbose
 */
export const coa = (value: IFabricaiCOA, verbose?: boolean): IValidationOutput => {
    const { IFabricaiCOA: validateFabricai } = createCheckers(validator);
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
