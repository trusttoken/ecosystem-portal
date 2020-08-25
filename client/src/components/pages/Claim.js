import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import { ethers } from 'ethers';

//import getRevertReason from 'eth-revert-reason';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import { DataProvider } from '@/providers/data';
import ConnectWallet from "@/components/ConnectWallet"
import { EthService } from '@/contracts/EthService';

import connectingAnimation from '@/assets/connecting_animation_blue_bg_small.gif';



function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const Title = styled.div`
  width: 692px;
  height: 92px;
  left: 374px;
  top: 300px;

  /* H2 / Medium 38px */

  font-family: Space Grotesk;
  font-style: normal;
  font-weight: 500;
  font-size: 38px;
  line-height: 46px;
  /* or 121% */

  display: block;
  align-items: center;
  text-align: center;

  /* N600 - Big Stone */

  color: #001425;
`;


const ClaimButton = styled.div`
  position: absolute;
  top: 400px;
  height: 50px;
  width: 265px;

  /* Neon */

  background: #1253FA;
  border-radius: 6px;
`;


const ClaimText = styled.div`
  position: absolute;
  height: 24px;
  left: 24px;
  right: 24px;
  top: 13px;
  cursor: pointer;


  /* Body 2 / Medium 16px */

  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  align-items: center;
  text-align: center;

  /* N0 - White */

  color: #FFFFFF;
`;


const Centered = styled.div`
  display: flex;
  justify-content: center;
`;


const TitlePadding = styled.div`
  padding: 300px 0px 50px 0px
`;


function hexToAscii(s) {
  const hex = s.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}


function Claim(props) {

  const [redirect, setRedirect] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [processing, setProcessing] = React.useState(false);

  const showStatus = (severity, message) => {
    setSeverity(severity)
    setStatusMessage(message);
    setOpen(true);
  }

  const claimTrustToken = async () => {
    //if ( ! EthService.isConnectedToMetaMask()) {
    //  this.props.history.push(window.location.pathname);
    //  return;
    //}
    if (processing) {
      console.log("claimTrustToken: claiming now");
      return;
    }

    const acc = await EthService.getActiveAccount();
    const registeredDistribution = await EthService.registeredDistributions(acc);
    console.log("claimTrustToken: registeredDistributions => '" + registeredDistribution + "' " + typeof registeredDistribution);

    const SUPPORT = "If you need help please send an email to support@trusttoken.com";
    const EthLow = "Your ETH balance is low, please add some Ethereum to your account for claiming Trust Tokens.";

    if (registeredDistribution == 0) {
      const balance = await EthService.TrustTokenContract.balanceOf(acc);
      if (balance != 0) {
        showStatus(
          'success',
          'You have already claimed TrustTokens, if you are facing any problems please send us an email to support@trusttoken.com'
        );
        setTimeout(() => setRedirect("/dashboard"), 4000);
        return;
      } else {
        showStatus(
          'warning',
          "Your public key is not registered for claiming Trust Tokens, if you have purchased Trust Tokens please reach out to support@trusttoken.com to register your public key."
        );
        return;
      }
    }


    let transactionHash;
    try {
      setProcessing(true);
      const claimReceipt = await EthService.claim();
      console.log("Claim receipt: " + JSON.stringify(claimReceipt));
      transactionHash = claimReceipt.hash;
      showStatus('info', "Transaction " + transactionHash + " sent and pending")
      const claimResult = await claimReceipt.wait();
      console.log("Claim result: " + JSON.stringify(claimResult));

      showStatus('info', "Claim successful!");
      setProcessing(false);
      setTimeout(() => setRedirect("/dashboard"), 10000);
    } catch (error) {
      setProcessing(false);
      console.log('claim error, txn: ' + transactionHash + ': => ' + JSON.stringify(error));
      showStatus('error', error.message);

      const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
      const tx = await provider.getTransaction(transactionHash)
      if (!tx) {
        console.log('tx not found')
      } else {
        const code = await provider.call(tx, tx.blockNumber);
        const reason = hexToAscii(code.substr(138));
        console.log('revert reason:', reason);
        showStatus('error', "Claim failed: " + reason);
        if (reason.includes('distribution already set')) {
          //setTimeout(() => setRedirect("/dashboard"), 3000);
          setRedirect("/dashboard");
        }
      }
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (redirect)
    return <Redirect push to={redirect} />;

  return (
    <Centered>

      <Title> 

        <TitlePadding>
          &nbsp;
        </TitlePadding>

      </Title>


        <ClaimButton onClick={claimTrustToken}>
          <ClaimText>
          {processing
          &&
          <div>
            Processing <img src={connectingAnimation} alt="..." width="24" height="24" />
          </div>
          ||
          <div>
            Claim TrustTokens
          </div>
          }
          </ClaimText>
        </ClaimButton>

      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {statusMessage}
        </Alert>
      </Snackbar>

    </Centered>
  );
}

export default Claim
