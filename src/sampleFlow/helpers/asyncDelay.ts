/**
 * Wait for the specified time
 * @param timeout ms
 */
export const asyncDelay = async (timeout: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
};
