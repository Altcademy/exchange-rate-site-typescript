import { checkStatus, json } from './fetchUtils';
import type { Currencies } from '../utils/currencies';

export default async function getCurrencies(): Promise<Currencies | void> {
  return fetch(`https://api.frankfurter.app/currencies`)
  .then(checkStatus)
  .then(json)
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  })
  .catch(error => console.error(error.message));
}
