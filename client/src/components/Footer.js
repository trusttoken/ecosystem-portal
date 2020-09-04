import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Left = styled.span`
  position: fixed;
  left: 100px;
  bottom: 0;
  color: #1253FA;
  text-align: left;
  float: left;

  .bluelink {
    color: #1253FA;
  }
  .bluelink:hover {
    color: #1253FA;
  }
`;

const Footer = () => {
  return (
    <>
      <div className="text-right" style={{
                                            position: 'fixed',
                                            left: 0,
                                            bottom: 0,
                                            width: '100%',
                                            textAlign: 'right',
                                        }}
      >

        <Left>
          <small>
            <Link
              to={{ pathname: "https://forum.trusttoken.com" }}
              target="_blank"
              className="bluelink"
            >
              Forum
            </Link>
            <div className="mx-3 d-inline-block">&nbsp;</div>

            <Link
              to={{ pathname: "https://forum.trusttoken.com/t/claim-tru-using-trusttoken-purchaser-portal-live/1009/2" }}
              target="_blank"
              className="bluelink"
            >
              How it works
            </Link>

            <div className="mx-3 d-inline-block">&nbsp;</div>

          </small>
        </Left>


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
</>
  )
}; 

export default Footer;
