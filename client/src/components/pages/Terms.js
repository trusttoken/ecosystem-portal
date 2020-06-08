import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { editUser } from '@/actions/user'
import { getIsEditing as getUserIsEditing } from '@/reducers/user'
import { getNextOnboardingPage } from '@/utils'

import TermsOfUseHtml from './TrueRewardsTERMSOFUSE.html';
const termsOfUseDoc = {__html: TermsOfUseHtml};

const Terms = ({ editUser, userIsEditing }) => {
  const [accepted, setAccepted] = useState(false)
  const [redirectTo, setRedirectTo] = useState(null)

  const handleSubmit = async () => {
    const result = await editUser({ termsAgreedAt: moment() })
    if (result.type === 'EDIT_USER_SUCCESS') {
      setRedirectTo(getNextOnboardingPage(result.payload))
    }
  }

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  return (
    <>
      <div className="action-card">
        <h1>Great! Please review our Terms of Use</h1>
        <p>Please agree to our terms below and click Continue to proceed.</p>
        <div className="form-group">
          <div className="terms-wrapper">
            <div dangerouslySetInnerHTML={termsOfUseDoc} />
          </div>
        </div>

        
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="acceptCheck"
            onClick={e => setAccepted(e.target.checked)}
          />
          <label className="form-check-label mt-0" htmlFor="acceptCheck">
            I have read and agree to the above Terms of Use and the{' '}

            <Link to="/privacy-policy" target="_blank">
              Privacy Policy
            </Link>

            {' '}of TrustToken.
          </label>
        </div>
        <button
          className="btn btn-primary btn-lg mt-4"
          disabled={!accepted || userIsEditing}
          onClick={handleSubmit}
        >
          Continue
        </button>
      </div>
    </>
  )
}

const mapStateToProps = ({ user }) => {
  return {
    userIsEditing: getUserIsEditing(user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      editUser: editUser
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Terms)
