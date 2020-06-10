import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import TermsOfUseDoc from '@/components/TermsOfUseDoc'

const TermsOfUse = ({ isLoading, user }) => {

  if (isLoading) {
    return (
      <div className="action-card">
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="terms-wrapper-full-screen">
        <TermsOfUseDoc />
    </div>
  )
}

export default TermsOfUse
