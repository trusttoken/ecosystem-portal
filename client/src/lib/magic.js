import { Magic } from 'magic-sdk';

const magic = new Magic(process.env.MAGIC_PUBLISHABLE_KEY, {
  network: "ropsten",
});

export { magic };
