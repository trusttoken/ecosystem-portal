import { Magic } from 'magic-sdk';

let network;
if (process.env.NODE_ENV === 'production') {
  network = 'mainnet';
} else {
  network = 'ropsten'
}

console.log('we on network', network);

const magic = new Magic(process.env.MAGIC_PUBLISHABLE_KEY, {
  network,
});

export { magic };
