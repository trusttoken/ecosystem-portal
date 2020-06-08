import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import PrivacyPolicyHtml from './TrueRewardsPRIVACY_POLICY.html';
const privacyPolicyDoc = {__html: PrivacyPolicyHtml};

const PrivacyPolicy = ({ isLoading, user }) => {

  if (isLoading) {
    return (
      <div>
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="terms-wrapper-full-screen">
        <div dangerouslySetInnerHTML={privacyPolicyDoc} />
    </div>
  )
}

export default PrivacyPolicy
