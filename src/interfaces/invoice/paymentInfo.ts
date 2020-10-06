import { TISOCurrency } from '../../types/currency';
import { IFabricaiBankAccount } from './bankAccount';
export interface IFabricaiPaymentInfo {
    currency: TISOCurrency;
    currencyRate: number;
    bankAccount: IFabricaiBankAccount;
}
