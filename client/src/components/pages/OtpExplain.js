import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import TwoFactorAuthenticatorIcon from '@/assets/2fa.svg'

const OtpExplain = () => {
  const [redirectTo, setRedirectTo] = useState(null)

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  return (
    <div className="action-card">
      <h1>Set Up Two-Factor Authenticator (2FA)</h1>
      <div className="mb-4 mx-auto" style={{ maxWidth: '150px' }}>
        <TwoFactorAuthenticatorIcon width="100%" height="100%" />
      </div>
      <p className="mb-3">
        A Two-Factor Authenticator will generate a unique, time-sensitive security
        code you can use to secure your account.
      </p>
      <p>
        To get started, click continue once you have a Two-Factor Authenticator app installed.
        It can be, for example, 
      {' '}
        <a
          href="https://support.google.com/accounts/answer/1066447"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Authenticator
        </a>{' '}

       or 

      {' '}
        <a
          href="https://authy.com/features/setup/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Authy
        </a>{' '}.

      </p>
      <button
        className="btn btn-primary btn-lg mt-5"
        onClick={() => setRedirectTo('/otp/setup')}
      >
        <span>Continue</span>
      </button>
    </div>
  )
}

export default OtpExplain
