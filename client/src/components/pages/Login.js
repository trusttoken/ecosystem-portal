import React from 'react';
import ConnectWallet from "@/components/ConnectWallet"

function Login (props) {
  return <ConnectWallet redirectTo='/dashboard' /> ;
}

export default Login
