import { ethers } from 'ethers';

const EthService = {
  state: {
    metamaskInstalled: false,
  },
  init,
  web3Provider: null,
  accounts: null,
};

async function enableMetamask() {
  let res;

  try {
    res = await window.ethereum.enable();
  } catch (err) {
    res = err;
  }

  return res;
}

async function init() {
  const ethereum = window.ethereum;
  if (typeof web3 !== 'undefined') {
    console.log('Metamask installed');
    EthService.state.metamaskInstalled = true;

    const enableRes = await enableMetamask();

    if (enableRes.code === 4001) {
        return false;
      } else {
        EthService.accounts = enableRes;
        console.log(EthService.accounts);
        // createTokenContracts();
        // console.log(web3);
        // web3.TUSDTokenContract.methods.balanceOf(web3State.accounts[0]).call().then((result) => {
        //   console.log(result);
        // });
      }

    EthService.web3Provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    const signer = EthService.web3Provider.getSigner();
    console.log(signer);

  }
}

export { EthService };
