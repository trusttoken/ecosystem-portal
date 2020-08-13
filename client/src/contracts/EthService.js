import { ethers, utils as ethUtils } from 'ethers';

import { TRUSTTOKEN_CONTRACT_ADDRESSES } from '@/constants/contracts';

const TrueUSDControllerAbi = require('./abi/TrueUSDController.abi.json');
const TrustTokenControllerAbi = require('./abi/TrustTokenController.abi.json');
const StakedTokenControllerAbi = require('./abi/StakedTokenController.abi.json');
const TimeLockRegistryProxyAbi = require('./abi/TimeLockRegistryProxy.abi.json');


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
  TimeLockRegistryProxy: null,
  isMetamaskLocked,
  init,
  enableTrueReward,
  disableTrueReward,
  depositStakedToken,
  getTrustTokenBalance,
  getTrustTokenLockStart,
  getTrustTokenEpochsPassed,
  getTrustTokenFinalEpoch,
  getTrustTokenLatestEpoch,
  getTrustTokenNextEpoch,
  getActiveAccount,
  enableMetamask,
  getEthNetwork,
  isConnectedToMetaMask,
  getTrustTokenContract,
  claim,
  registeredDistributions,
};

function getEthNetwork() {
  let network = process.env.ETH_NETWORK || (process.env.NODE_ENV === 'production' ? 'mainnet' : 'ropsten');
  return network;
}

function isConnectedToMetaMask() {
  return typeof web3 !== "undefined" && web3.eth.accounts && web3.eth.accounts.length;
}

function getTrustTokenContract() {
  const network = getEthNetwork();
  const trustTokenContractAddress = TRUSTTOKEN_CONTRACT_ADDRESSES[network];
  const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
  const signer = provider.getSigner();
  const TrustTokenContract = new ethers.Contract(trustTokenContractAddress, TrustTokenControllerAbi, signer);
  return TrustTokenContract;
}

async function claim() {
  if (! EthService.TimeLockRegistryProxy) {
    await initMetamask();
  }

  try {
    const claimResult = await EthService.TimeLockRegistryProxy.claim();
    const r = claimResult.toString();
    console.log('claim: => ' + r);
    return r;
  } catch (error) {
    const r = JSON.stringify(error);
    console.log(r);
    return r;
  }
}

async function registeredDistributions(address) {
  if (! EthService.TimeLockRegistryProxy) {
    await initMetamask();
  }
  try {
    const amount = await EthService.TimeLockRegistryProxy.registeredDistributions(address);
    console.log('registeredDistributions(' + address + '): => ' + amount);
    return amount;
  } catch (error) {
    console.log(error);
  }
}

async function getTrustTokenBalance(address) {
  const TrustTokenContract = getTrustTokenContract();
  const trustTokenBalance = await TrustTokenContract.balanceOf(address);
  const balance = trustTokenBalance.toString();
  //console.log(`TRU balance of address ${address} on is ${balance}`);
  return balance;
}

async function getTrustTokenLockStart() {
  return new Date(await getTrustTokenContract().lockStart() * 1000);
}

async function getTrustTokenEpochsPassed() {
  return await getTrustTokenContract().epochsPassed();
}

async function getTrustTokenFinalEpoch() {
  return new Date(await getTrustTokenContract().finalEpoch() * 1000);
}

async function getTrustTokenLatestEpoch() {
  return new Date(await getTrustTokenContract().latestEpoch() * 1000);
}

async function getTrustTokenNextEpoch() {
  return new Date(await getTrustTokenContract().nextEpoch() * 1000);
}


async function getActiveAccount() {
  let accounts = window.web3.eth.accounts;
  if (accounts.length === 0) {
    await window.ethereum.enable();
    accounts = window.web3.eth.accounts;
  }
  return accounts[0];
}

function isMetamaskLocked() {
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
  console.log("createTokenContracts:");

  const test = getEthNetwork() == 'ropsten';

  // Addresses of contracts (proxies) on mainnet and ropsten
  // TODO: update mainnet addresses
  const TUSDTokenContractAddress = test ? '0xa2EA00Df6d8594DBc76b79beFe22db9043b8896F' : '0xB36938c51c4f67e5E1112eb11916ed70A772bD75';
  const TrustTokenContractAddress = test ? '0x711161BaF6fA362Fa41F80aD2295F1f601b44f3F' : '0xC2A3cA255B12769242201db4B91774Cae4caEf69';
  const StakedTokenContractAddress = test ? '0xE510468dAD975bC77F0B81fADdE2f9DdF4231cf4' : '0xC2A3cA255B12769242201db4B91774Cae4caEf69';
  const TimeLockRegistryProxyAddress = test ? '0xa9Fe04F164DF0C75F9A9F67994Ba91Abb9932633' : '0xEeDB291fCF250C4259211469787a380eC5aAA95d';

  const signer = EthService.web3Provider.getSigner();

  EthService.TUSDTokenContract = new ethers.Contract(TUSDTokenContractAddress, TrueUSDControllerAbi, signer);
  EthService.TrustTokenContract = new ethers.Contract(TrustTokenContractAddress, TrustTokenControllerAbi, signer);
  EthService.StakedTokenContract = new ethers.Contract(StakedTokenContractAddress, StakedTokenControllerAbi, signer);
  EthService.TimeLockRegistryProxy = new ethers.Contract(TimeLockRegistryProxyAddress, TimeLockRegistryProxyAbi, signer);

  console.log("createTokenContracts: EthService.TimeLockRegistryProxy: " + EthService.TimeLockRegistryProxy);
}

async function enableTrueReward() {
  if (!EthService.TUSDTokenContract) {
    console.log('TUSDTokenContract not initialized.');
  }
  try {
    const enableTrueRewardRes = await EthService.TUSDTokenContract.enableTrueReward();
    console.log(enableTrueRewardRes);
  } catch (error) {
    console.log(error);
  }
}

async function disableTrueReward() {
  if (!EthService.TUSDTokenContract) {
    console.log('TUSDTokenContract not initialized.');
  }
  try {
    const disableTrueRewardRes = await EthService.TUSDTokenContract.disableTrueReward();
    console.log(disableTrueRewardRes);
  } catch (error) {
    console.log(error);
  }
}

async function depositStakedToken(trustTokenAmount) {
  if (!EthService.StakedTokenContract) {
    console.log('StakedTokenContract not initialized.');
  }
  try {
    const depositStakedTokenRes = await EthService.StakedTokenContract.deposit(2000000000);
    console.log(depositStakedTokenRes);
  } catch (error) {
    console.log(error);
  }
}

async function initMetamask() {
  console.log('******************* initMetamask');
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
        EthService.web3Provider = new ethers.providers.Web3Provider(window.web3.currentProvider);

        createTokenContracts();

        const tusdBalance = await EthService.TUSDTokenContract.balanceOf(EthService.accounts[0]);

        EthService.state.TUSDBalance = ethUtils.formatEther(tusdBalance.toString());

        const trustTokenBalance = await EthService.TrustTokenContract.balanceOf(EthService.accounts[0]);

        EthService.state.TrustTokenBalance = trustTokenBalance.toString();

        console.log(EthService.state.TrustTokenBalance);
        console.log("================== TRU balance:", EthService.state.TrustTokenBalance / 100000000);
      }
  }
}

async function init(type) {
  await initMetamask();
}

export { EthService };
