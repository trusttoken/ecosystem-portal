import { Magic } from 'magic-sdk';

console.log('using key', process.env.MAGIC_PUBLISHABLE_KEY);

const magic = new Magic(process.env.MAGIC_PUBLISHABLE_KEY, {
  network: "ropsten",
});

export { magic };
