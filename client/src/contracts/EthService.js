import { ethers, utils as ethUtils } from 'ethers';

const TrueUSDControllerAbi = require('./abi/TrueUSDController.abi.json');

const EthService = {
  state: {
    metamaskInstalled: false,
    TUSDBalance: null,
  },
  web3Provider: null,
  accounts: null,
  wallet: null,
  TUSDTokenContract: null,
  isMetamaskLocked,
  init,
};

function isMetamaskLocked() {
  console.log(window.web3.eth.accounts);
  const accounts = window.web3.eth.accounts;
  console.log('accounts length', accounts.length);
  const isLocked = accounts.length === 0;
  console.log('isLocked', isLocked);
  return isLocked;
}

async function enableMetamask() {
  let res;

  try {
    res = await window.ethereum.enable();
  } catch (err) {
    res = err;
  }

  return res;
}

function handleMetamaskAccountsChangedEvent() {
  window.ethereum.on('accountsChanged', function (accounts) {
    console.log('metamask accounts changed coolio!');
  });
}

function createTokenContracts() {
  EthService.TUSDTokenContract = new ethers.Contract('0xB36938c51c4f67e5E1112eb11916ed70A772bD75', TrueUSDControllerAbi, EthService.web3Provider);
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
        handleMetamaskAccountsChangedEvent();

        EthService.accounts = enableRes;
        console.log('EthService.accounts', EthService.accounts);

        EthService.web3Provider = new ethers.providers.Web3Provider(window.web3.currentProvider);

        createTokenContracts();

        const balance = await EthService.TUSDTokenContract.balanceOf(EthService.accounts[0]);
        console.log(balance.toString());
        console.log(ethUtils.formatEther(balance.toString()));
        EthService.state.TUSDBalance = ethUtils.formatEther(balance.toString());


        const signer = EthService.web3Provider.getSigner();
        console.log('signer', signer);
        // createTokenContracts();
        // console.log(web3);
        // web3.TUSDTokenContract.methods.balanceOf(web3State.accounts[0]).call().then((result) => {
        //   console.log(result);
        // });
      }
  }
}

export { EthService };
