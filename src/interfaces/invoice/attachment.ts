import { TAllowedMimeType } from '../../types/mimeType';

export interface IFabricaiAttachment {
    id: string;
    base64: string;
    mimeType: TAllowedMimeType;
}
