import { Magic } from 'magic-sdk';
import { getEthNetwork } from '@/lib/eth';

const network = getEthNetwork();

console.log('we on network', network);
console.log('magic p key', process.env.MAGIC_PUBLISHABLE_KEY);

const magic = new Magic(process.env.MAGIC_PUBLISHABLE_KEY, {
  network,
});

export { magic };
