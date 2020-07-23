import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { EthService } from '@/contracts/EthService';
import styled from 'styled-components';

import MetaMaskLogo from '@/assets/metamask_medium.png';
import TrustTokenLogo from '@/assets/trust-token-round-logo.png';
import BlueRightArrow from '@/assets/blue-right-arrow.png';
import CircleConfirmConnection from '@/assets/circle-confirm-connection.png';

import { formInput, formFeedback } from '@/utils/formHelpers';

const WaitingToConnectBox = styled.div`
/* Waiting to connect ... */

text-align: center;
height: 18px;
padding: 10px;

/* Caption / Regular 12px */

font-family: Inter;
font-style: normal;
font-weight: normal;
font-size: 12px;
line-height: 18px;
/* identical to box height, or 150% */

text-align: center;

/* N400 - Casper */

color: #9BAABF;

`;

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
            } else if (enableRes.code) {
              console.log("MetaMask NOT enabled: " + JSON.stringify(enableRes.code) + ", ::: " + JSON.stringify(enableRes));
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
            

            {this.state.loading ? (
                <>
                  Confirm connection
                </>
              ) : (
                <span>Connect wallet</span>
              )}
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
            {
              this.state.loading
              ? ( <span>
                     Open the extension and give access to the app
                 </span> )
              : ( <span>
                     To start using TrueRewards
                 </span> )
            }

          </div>

            {
              this.state.loading
              ? (
                  <div style={{height: "150px", padding: "40px"}}> 
                    <img src={CircleConfirmConnection} /> 

                    <WaitingToConnectBox>
                      Waiting to connect&nbsp;...
                    </WaitingToConnectBox>
                  </div>
                )
              : ( <ConnectToMetaMask connect={loginWithMetaMask} /> )
            }

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
