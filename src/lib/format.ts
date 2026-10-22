import { CURRENCY } from '../config/app';

export const formatMoney = (value: number) => `${CURRENCY} ${value.toLocaleString('en-LK')}`;
