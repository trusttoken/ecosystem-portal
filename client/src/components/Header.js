import React from 'react'
import { Link } from 'react-router-dom';
import TTLogo from '@/assets/tt_logotype_small_color.png';

const Header = () => {
  return (
      <div>
        <small>
            <div className="text-right" style={{ color: '#638298' }}>

              <span style={{ float: 'left' }}>
                  <a
                    href="https://www.trusttoken.com/"
                    target="_blank"
                    className="text-muted"
                  >
                   <img src={TTLogo} />
                  </a>
              </span>

              <a
                href="https://www.trusttoken.com/currencies"
                target="_blank"
                className="text-muted"
              >
                Products
              </a>

              <div className="mx-3 d-inline-block">&nbsp;</div>

              <a
                href="https://www.trusttoken.com/company"
                target="_blank"
                className="text-muted"
              >
                Company
              </a>

              <div className="mx-3 d-inline-block">&nbsp;</div>

              <a
                className="text-muted"
                target="_blank"
                href="https://www.trusttoken.com/careers/"
              >
               Careers
              </a>

              <div className="mx-3 d-inline-block">&nbsp;</div>

              <a
                className="text-muted"
                target="_blank"
                href="https://app.trusttoken.com/signup-or-signin"
              >
                <button className="get-tusd-button">
                  Get TrueUSD
                </button>
              </a>
            </div>

          <hr/>

          <div className="text-right" style={{ color: '#638298' }}>

              <Link
                to="/privacy-policy"
                target="_blank"
                className="text-muted"
              >
                Privacy Policy
              </Link>

              <div className="mx-3 d-inline-block">&nbsp;</div>

              <Link
                to="/terms-of-use"
                target="_blank"
                className="text-muted"
              >
                Terms of Use
              </Link>

          </div>

        </small>
      </div>
  )
}; 

export default Header;
