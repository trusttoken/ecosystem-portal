import React from 'react';
import NotFound404 from '@/assets/404.svg'
import TTLogo from '@/assets/tt_logotype_small_color.png'


const NotFound = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'center', height: '200px' }} >
          <a
            href="https://www.trusttoken.com/"
            target="_blank"
            className="text-muted"
          >
            <img src={TTLogo}/>
          </a>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }} >
        <NotFound404 />
    </div>

    <div style={{
        height: '66px',

        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '52px',
        lineHeight: '66px',
        /* identical to box height, or 127% */

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#212529'
    }}>

    Sorry, this page isn't available.

    </div>

    <div style={{
        height: '32px',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '22px',
        lineHeight: '32px',
        /* identical to box height, or 145% */

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

        color: '#638298'
    }}>

    The page you were looking for couldn't be found

    </div>

    <div style={{
        height: '32px',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

        color: '#1253FA'
    }}>


    <a href="/"> Go to the homepage  </a>

    &nbsp;

    <div style={{
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

        color: '#8FA7B7'
    }}>
    &bull;
    </div>

    &nbsp;

    <a href="https://forum.trusttoken.com/c/tru-ecosystem-portal-support-updates/12"> Visit our help center</a>

    </div>


  </div>
);

export default NotFound;
