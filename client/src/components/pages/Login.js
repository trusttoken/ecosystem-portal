import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { EthService } from '@/contracts/EthService';
import MetaMaskLogo from '@/assets/metamask_small.png';

import { formInput, formFeedback } from '@/utils/formHelpers'
import { apiUrl } from '@/constants'

import { addAccount } from '@/actions/account'


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
          <h1>Sign In</h1>
            <p>Login with MetaMask.</p>
            <img src={MetaMaskLogo} />
          <form>
            <button
              type="submit"
              className="btn btn-primary btn-lg mt-5"
              onClick={loginWithMetaMask}
              disabled={this.state.loading}
            >
              {this.state.loading ? (
                <>
                  <span className="spinner-grow spinner-grow-sm"></span>
                  Loading...
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </form>
        </div>
      </>
    )
  }
}

export default Login
