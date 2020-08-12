import React from 'react';
import ConnectWallet from "@/components/ConnectWallet"
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { DataProvider } from '@/providers/data';
import AccountActions from '@/components/AccountActions';
import { EthService } from '@/contracts/EthService';


const Title = styled.div`
  width: 692px;
  height: 92px;
  left: 374px;
  top: 300px;

  /* H2 / Medium 38px */

  font-family: Space Grotesk;
  font-style: normal;
  font-weight: 500;
  font-size: 38px;
  line-height: 46px;
  /* or 121% */

  display: block;
  align-items: center;
  text-align: center;

  /* N600 - Big Stone */

  color: #001425;
`;


const ClaimButton = styled.div`
  position: absolute;
  height: 50px;
  left: 0px;
  right: 0px;
  top: 0px;

  /* Neon */

  background: #1253FA;
  border-radius: 6px;
`;


const ClaimText = styled.div`
  position: absolute;
  height: 24px;
  left: 24px;
  right: 24px;
  top: 13px;

  /* Body 2 / Medium 16px */

  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  align-items: center;
  text-align: center;

  /* N0 - White */

  color: #FFFFFF;
`;


const Centered = styled.div`
  display: flex;
  justify-content: center;
`;


const TitlePadding = styled.div`
  padding: 300px 0px 50px 0px
`;



function Claim(props) {
  return (
  <>
    <Centered>
      <Title> 

        <TitlePadding>
          The Ecosystem portal is a service for earning rewards through markets
        </TitlePadding>

        <Button variant="primary" size="lg">
          Claim TrustTokens
        </Button>

      </Title> 
    </Centered>

  </>

  );
}

export default Claim
