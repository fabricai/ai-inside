interface IAllowedVatPercentageForCountryAndYear {
    [country: string]: {
        [year: string]: number[];
    };
}
export const allowedVatPercentage: IAllowedVatPercentageForCountryAndYear = {
    FI: {
        2016: [0, 10, 14, 24],
        2018: [0, 10, 14, 24],
        2017: [0, 10, 14, 24],
        2020: [0, 10, 14, 24],
        2021: [0, 10, 14, 24],
    },
};
