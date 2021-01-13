import request from 'request';
interface IRequestOutput {
    statusCode: number;
    error?: any;
    body?: any;
    json?: any;
}
export const asyncRequest = async (params: any): Promise<IRequestOutput> => {
    return new Promise((resolve) => {
        request(params, (e: any, h: any, b: any) => {
            const error = e || null;
            const statusCode = h && typeof h.statusCode === 'number' ? h.statusCode : 400;
            let json = b;
            try {
                json = JSON.parse(json);
            } catch (e) {}
            return resolve({
                statusCode,
                error,
                body: b,
                json,
            });
        });
    });
};
