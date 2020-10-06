import { TISOCountry } from '../../types/country';

export interface IFabricaiAddress {
    // Official name of the party
    name: string;
    // Unique identifier of the party (e.g. VAT number, Business ID or OBFUSCATED Finnish national ID)
    // Do not pass in any sensitive information like complete Finnish national ID
    //    > In this case you may obfuscate it by replacing the real id with 000000-0000
    //    > HOWEVER - if you must obfuscate something - always replace numbers with numbers and letters with letterc etc.
    identifier: string;
    // Name of the contact person, for natural person - this can be same as this.name
    contactPersonName: string;
    // Email of the contact person
    contactEmail: string;
    // Domain of the party
    domain: string;
    // Street name with possible number and letter(s)
    street: string;
    // Zip code
    zip: string;
    // City
    city: string;
    // Country
    country: TISOCountry;
}
