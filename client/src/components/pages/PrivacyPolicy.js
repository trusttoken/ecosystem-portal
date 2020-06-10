import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import PrivacyPolicyDoc from '@/components/PrivacyPolicyDoc'

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
        <PrivacyPolicyDoc />
    </div>
  )
}

export default PrivacyPolicy
