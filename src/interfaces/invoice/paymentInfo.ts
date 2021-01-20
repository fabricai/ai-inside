import { TISOCurrency } from '../../types/currency';
import { IFabricaiBankAccount } from './bankAccount';
export interface IFabricaiPaymentInfo {
    /**
     * Currency of the invoice according
     * to ISO 4217
     *
     * E.g.
     * EUR, NOK, USD
     */
    currency: TISOCurrency;
    /**
     * Currency rate between invoice's
     * currency and the integration's
     * currency
     *
     * E.g.
     * If the invoice is in USD and
     * the integration has EUR
     * this would be around 1.21 (EUR -> USD)
     *
     * If the invoice is in EUR and
     * the integration has EUR
     * this would be 1
     */
    currencyRate: number;
    /**
     * Bank account where invoice is supposed
     * to be paid
     */
    bankAccount: IFabricaiBankAccount;
}
