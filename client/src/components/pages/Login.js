import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { EthService } from '@/contracts/EthService';
import MetaMaskLogo from '@/assets/metamask_medium.png';
import BlueRightArrow from '@/assets/blue-right-arrow.png';

import { formInput, formFeedback } from '@/utils/formHelpers';

import { addAccount } from '@/actions/account';
import { Link } from 'react-router-dom';

function ConnectToMetaMask(props) {
  return (
            <div
              style={{
                cursor: 'pointer',
                background: '#FFFFFF',
                boxSizing: 'border-box',
                borderRadius: '2px',
                padding: '50px 120px 50px 120px',
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
        <div className="action-card">

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
