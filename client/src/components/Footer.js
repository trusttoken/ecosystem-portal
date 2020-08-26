import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
      <div className="text-right" style={{
                                            position: 'fixed',
                                            left: 0,
                                            bottom: 0,
                                            width: '100%',
                                            textAalign: 'right',
                                        }}
      >
        <small>

          <Link
            to="/terms-of-use"
            target="_blank"
            className="text-muted"
          >
            Terms of Use
          </Link>

          <div className="mx-3 d-inline-block">&nbsp;</div>

          <Link
            to="/privacy-policy"
            target="_blank"
            className="text-muted"
          >
            Privacy Policy
          </Link>

          <div className="mx-3 d-inline-block">&nbsp;</div>

          <a
            className="text-muted"
            target="_blank"
            href="mailto:support@trusttoken.com?subject=Ecosystem portal"
          >
           support@trusttoken.com
          </a>

        </small>
      </div>
  )
}; 

export default Footer;
