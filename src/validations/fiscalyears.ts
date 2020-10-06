import { createCheckers } from 'ts-interface-checker';
import { IValidationOutput } from '../helpers/interfaces';
import { IFabricaiFiscalYear } from '../interfaces/fiscalyears';
import validator from '../interfaces/fiscalyears-ti';
/**
 *
 * @param value
 * @param verbose
 */
export const fiscalyears = (value: IFabricaiFiscalYear, verbose?: boolean): IValidationOutput => {
    const { IFabricaiFiscalYear: validateFabricai } = createCheckers(validator);
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
