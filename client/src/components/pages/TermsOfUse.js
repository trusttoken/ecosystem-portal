import React from 'react';
import Header from '@/components/Header';
import TermsOfUseDoc from '@/components/TermsOfUseDoc';

const TermsOfUse = ({ isLoading }) => {

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
        <Header />

        <TermsOfUseDoc />
    </div>
  )
}

export default TermsOfUse
