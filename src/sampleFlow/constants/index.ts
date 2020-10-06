import minimist from 'minimist';
const args = minimist(process.argv.slice(2));
export const API_ENDPOINT = args.endpoint ? args.endpoint : 'https://api.fabricai.fi';
export const API_VERSION_ENDPOINT = `${API_ENDPOINT}/v3`;
