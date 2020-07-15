import { ethers, utils as ethUtils } from 'ethers';

import { getEthNetwork } from '@/lib/eth';
import { TRUSTTOKEN_CONTRACT_ADDRESSES } from '@/constants/contracts';

const TrueUSDControllerAbi = require('./abi/TrueUSDController.abi.json');
const TrustTokenControllerAbi = require('./abi/TrustTokenController.abi.json');
const StakedTokenControllerAbi = require('./abi/StakedTokenController.abi.json');

const EthService = {
  state: {
    metamaskInstalled: false,
    TUSDBalance: null,
  },
  web3Provider: null,
  accounts: null,
  wallet: null,
  TUSDTokenContract: null,
  TrustTokenContract: null,
  StakedTokenContract: null,
  isMetamaskLocked,
  init,
  enableTrueReward,
  disableTrueReward,
  depositStakedToken,
  getTrustTokenBalance,
  enableMetamask,
};

async function getTrustTokenBalance(address) {
  const network = getEthNetwork();
  //console.log(`checking TRU balance of address ${address} on ${network}`);
  const trustTokenContractAddress = TRUSTTOKEN_CONTRACT_ADDRESSES[network];

  const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
  const signer = provider.getSigner();

  const TrustTokenContract = new ethers.Contract(trustTokenContractAddress, TrustTokenControllerAbi, signer);
  const trustTokenBalance = await TrustTokenContract.balanceOf(address);
  let balance = trustTokenBalance.toString();
  console.log(`TRU balance of address ${address} on ${network} is ${balance}`);
  return balance;
}

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

// This is using ropsten proxy contract addresses at the moment. Will have to change based on selected network
function createTokenContracts() {
  EthService.TUSDTokenContract = new ethers.Contract('0xB36938c51c4f67e5E1112eb11916ed70A772bD75', TrueUSDControllerAbi, EthService.web3Provider.getSigner());
  EthService.TrustTokenContract = new ethers.Contract('0xC2A3cA255B12769242201db4B91774Cae4caEf69', TrustTokenControllerAbi, EthService.web3Provider.getSigner());
  EthService.StakedTokenContract = new ethers.Contract('0xC2A3cA255B12769242201db4B91774Cae4caEf69', StakedTokenControllerAbi, EthService.web3Provider.getSigner());
}

async function enableTrueReward() {
  if (!EthService.TUSDTokenContract) { console.log('TUSDTokenContract not initialized.'); }
  try {
    const enableTrueRewardRes = await EthService.TUSDTokenContract.enableTrueReward();
    console.log(enableTrueRewardRes);
  } catch (error) {
    console.log(error);
  }
}

async function disableTrueReward() {
  if (!EthService.TUSDTokenContract) { console.log('TUSDTokenContract not initialized.'); }
  try {
    const disableTrueRewardRes = await EthService.TUSDTokenContract.disableTrueReward();
    console.log(disableTrueRewardRes);
  } catch (error) {
    console.log(error);
  }
}

async function depositStakedToken(trustTokenAmount) {
  if (!EthService.StakedTokenContract) { console.log('StakedTokenContract not initialized.'); }
  try {
    const depositStakedTokenRes = await EthService.StakedTokenContract.deposit(2000000000);
    console.log(depositStakedTokenRes);
  } catch (error) {
    console.log(error);
  }
}

async function initMetamask() {
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

        const tusdBalance = await EthService.TUSDTokenContract.balanceOf(EthService.accounts[0]);
        console.log(tusdBalance.toString());
        console.log(ethUtils.formatEther(tusdBalance.toString()));
        EthService.state.TUSDBalance = ethUtils.formatEther(tusdBalance.toString());

        const trustTokenBalance = await EthService.TrustTokenContract.balanceOf(EthService.accounts[0]);
        console.log(trustTokenBalance.toString());
        console.log(trustTokenBalance.toString() / 100000000);
        EthService.state.TrustTokenBalance = trustTokenBalance.toString();
      }
  }
}

async function init(type) {
  await initMetamask();
}

export { EthService };
