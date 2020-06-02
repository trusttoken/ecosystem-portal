import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Magic } from 'magic-sdk';

import { formInput, formFeedback } from '@/utils/formHelpers'
import { apiUrl } from '@/constants'
import agent from '@/utils/agent'

const magic = new Magic('pk_test_338A272670C8642F');

class Login extends Component {
  state = {
    email: '',
    emailError: null,
    loading: false,
    redirectTo: null,
    testMessage: ''
  }

  componentWillMount() {
    console.log('mounting');
    try {
      agent
        .post(`${apiUrl}/api/ping`)
        .then((res) => {
           this.setState({ testMessage: res.text })
        })
    } catch (err) {
      console.log(err)
    }
  }

  handleSendEmailToken = async () => {
    const emailPattern = /.+@.+\..+/
    if (!emailPattern.test(this.state.email)) {
      this.setState({ emailError: 'That does not look like a valid email.' })
      return
    }
    this.setState({ loading: true })
    // try {
    //   await agent
    //     .post(`${apiUrl}/api/send_email_token`)
    //     .send({ email: this.state.email })
    // } catch (error) {
    //   this.setState({
    //     loading: false,
    //     emailError: 'Failed to send email token. Try again shortly.'
    //   })
    //   return
    // }
    try {
      const didToken = await magic.auth.loginWithMagicLink({ email: this.state.email });
      this.setState({ loading: false, redirectTo: `/login_handler/${didToken}` });
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false,
        emailError: 'Failed to send email token. Try again shortly.'
      });
      return;
    }

    // this.setState({ loading: false, redirectTo: '/check_email' })
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
    }

    const query = new URLSearchParams(this.props.location.search)
    const error = query.get('error')

    let messageElement
    if (!error) {
      messageElement = (
        <p>We will send you a magic link to your email to confirm access ASAP. Test Message: {this.state.testMessage}</p>
      )
    } else if (error === 'expired') {
      messageElement = (
        <div className="alert alert-danger mb-4">
          Your login token is invalid or has expired. Please login again.
        </div>
      )
    } else if (error === 'server') {
      messageElement = (
        <div className="alert alert-danger mb-4">
          An error occurred communicating with the server. Please try again
          later.
        </div>
      )
    }

    return (
      <>
        <div className="action-card">
          <h1>Sign In</h1>
          {messageElement}
          <form>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input {...input('email')} type="email" />
              {Feedback('email')}
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg mt-5"
              onClick={this.handleSendEmailToken}
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
