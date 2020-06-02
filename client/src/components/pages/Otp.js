import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { formInput, formFeedback } from '@/utils/formHelpers'
import { apiUrl } from '@/constants'
import agent from '@/utils/agent'

class Otp extends Component {
  state = {
    loading: false,
    otpCode: '',
    otpCodeError: null,
    redirectToDashboard: false
  }

  handleVerifyOtpCode = async () => {
    this.setState({ loading: true })
    try {
      await agent
        .post(`${apiUrl}/api/verify_totp`)
        .send({ code: this.state.otpCode })
    } catch (error) {
      this.setState({ loading: false, otpCodeError: 'Invalid OTP code.' })
      return
    }

    this.setState({ loading: false, redirectToDashboard: true })
  }

  render() {
    if (this.state.redirectToDashboard) {
      return <Redirect push to="/dashboard" />
    }

    const input = formInput(
      this.state,
      state => this.setState(state),
      'text-center w-auto'
    )
    const Feedback = formFeedback(this.state)

    return (
      <>
        <div className="action-card">
          <h1>2-Step Verification</h1>
          <p>Enter the code generated by Google Authenticator.</p>
          <form>
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input {...input('otpCode')} type="number" />
              {Feedback('otpCode')}
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg mt-5"
              onClick={this.handleVerifyOtpCode}
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
        <p className="action-card-help my-5 text-center">
          Unable to verify with your app?{' '}
          <a href="mailto:support@trusttoken.com">Contact us.</a>
        </p>
      </>
    )
  }
}

export default Otp
