import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { EthService } from '@/contracts/EthService';


import MetaMaskLogo from '@/assets/metamask_medium.png';
import TrustTokenLogo from '@/assets/trust-token-round-logo.png';
import BlueRightArrow from '@/assets/blue-right-arrow.png';

import { formInput, formFeedback } from '@/utils/formHelpers';

function ConnectToMetaMask(props) {
  return (
            <div
              style={{
                cursor: 'pointer',
                background: '#FFFFFF',
                boxSizing: 'border-box',
                borderRadius: '2px',
                padding: '60px 10px 60px 10px',
              }}
              onClick={e => props.connect()}
            >
                  <div style={{borderRadius: '2px', height: "50px"}}>
                    <span style={{
                                    fontStyle: 'normal',
                                    fontWeight: '500',
                                    fontSize: '18px',
                                    lineHeight: '26px',
                                    color: '#061439',
                                    verticalAlign: 'middle',
                                    float: 'left',
                               }}
                    >
                      <img src={MetaMaskLogo} />
                      MetaMask
                    </span>
                    <span style={{
                                    verticalAlign: 'middle',
                                    float: 'right',
                                    marginTop: "10px"
                                }}
                    >
                      <img src={BlueRightArrow} />
                    </span>
                  </div>
            </div>
  )
}

class Login extends Component {
  state = {
    loading: false,
    redirectTo: null,
    testMessage: ''
  }

  render() {
    const input = formInput(
      this.state,
      state => this.setState(state),
      'text-center'
    )

    const Feedback = formFeedback(this.state)

    if (this.state.redirectTo) {
      return <Redirect push to={this.state.redirectTo} />
    };

    const loginWithMetaMask = () => {
        console.log("loginWithMetaMask: this: " + this);
        if (! EthService.state.metamaskInstalled) {
          this.setState({ loading: true });
          EthService.enableMetamask()
          .then(enableRes => {
            if (enableRes.code === 4001) {
              console.log("MetaMask NOT enabled.");
            } else {
              console.log("MetaMask enabled!");
              this.setState({ loading: false, redirectTo: `/dashboard` });
            }
          });
        } else {
          this.setState({ loading: false, redirectTo: `/dashboard` });
        }
      }

    return (
      <>
        <div className="action-card" style={{
                                            position: 'absolute',
                                            width: '440px',
                                            height: '463px',
                                            left: '500px',
                                            top: '140px',
                                            background: '#FFFFFF',
                                            borderRadius: '8px',
                                            border: '1px',
                                            borderColor: 'red',
                                           }}
        >

          <img src={TrustTokenLogo} width='80px' height='80px' />

          <div style={{
                        fontWeight: '500',
                        fontSize: '22px',
                        lineHeight: '32px',
                        textAlign: 'center',
                        color: '#061439',
                     }}
          >
            Connect wallet
          </div>
          <div style={{
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '16px',
                        lineHeight: '24px',
                        textAlign: 'center',
                        color: '#7A859E',
                     }}
          >
            To start using TrueRewards
          </div>

          <ConnectToMetaMask connect={loginWithMetaMask} /> 

          <div style={{
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '14px',
                        lineHeight: '20px',
                        textAlign: 'center',
                        color: '#7A859E',
                     }}
          >
            By connecting, I accept TrustToken’s 
            <br/>
            <Link to="/terms-of-use"> Terms of Service</Link>
          </div>
        </div>

      </>
    )
  }
}

export default Login
