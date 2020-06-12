function getEthNetwork() {
  let network;
  if (process.env.NODE_ENV === 'production') {
    network = 'mainnet';
  } else {
    network = 'ropsten'
  }

  return network;
}

export {
  getEthNetwork
};
