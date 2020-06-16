function getEthNetwork() {
  let network = process.env.ETH_NETWORK || (process.env.NODE_ENV === 'production' ? 'mainnet' : 'ropsten');
  return network;
}

export {
  getEthNetwork
};
