export enum EFabricaiEndpointResponseStatus {
    OK = 'OK',
    FAIL = 'FAIL',
}

export interface IFabricaiEndpointResponseWrapper {
    status: EFabricaiEndpointResponseStatus;
    retryable: boolean;
    retryDelayMs: number;
    message?: string;
    data?: any;
}

export interface IFabricaiEndpointResponseJWT extends IFabricaiEndpointResponseWrapper {
    data?: {
        code?: string;
        organization?: any;
    };
}
