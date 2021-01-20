import { TAllowedMimeType } from '../../types/mimeType';

export interface IFabricaiAttachment {
    /**
     * Unique identifier of the attachment
     * This must be unique ONLY within the integration
     */
    id: string;
    /**
     * Base 64 encoded attachment
     */
    base64: string;
    /**
     * Mime type of the attachment
     *
     * Note :: we will validate the declared mimeType
     * and the mimeType constructed from base64 encoded
     * attachment's magic number
     *
     * https://en.wikipedia.org/wiki/Magic_number_(programming)
     *
     * If these do not match - the invoice will NOT validate.
     */
    mimeType: TAllowedMimeType;
}
