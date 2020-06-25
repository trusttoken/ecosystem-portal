import React from 'react';
import Header from '@/components/Header';
import PrivacyPolicyDoc from '@/components/PrivacyPolicyDoc';

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
        <Header />

        <PrivacyPolicyDoc />
    </div>
  )
}

export default PrivacyPolicy
