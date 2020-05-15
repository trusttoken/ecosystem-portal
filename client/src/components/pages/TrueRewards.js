import * as React from 'react';
import styled from 'styled-components';
// import { web3 } from '../contracts/web3';

const Container = styled.div`
  max-width: 1128px;
  padding: 0 156px;
  margin: 0 auto;
`;

const Box = styled.div`
  border: 1px solid #E7EAF3;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const BoxInner = styled.div`
  border-bottom: 1px solid #E7EAF3;
  box-sizing: border-box;
  border-radius: 8px;
`;

const Label = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #7A859E;
`;

const Amount = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 40px;
  color: #061439;

`;

const Ticker = styled.div`
  display: inline;
  font-size: 16px;
  color: #7A859E;
  padding-left: 4px;
`;

const SwitchContainer = styled.div`
  width: 36px;
  height: 20px;
  background: #9FAAC4;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const SwitchInner = styled.div`
  position: relative;
`;

const SwitchKnob = styled.div`
  position: relative;
  left: 3px;
  top: 3px;
  width: 14px;
  height: 14px;
  background: #FFFFFF;
  border-radius: 10px;
  transition: left 0.4s;

  ${({ switchEnabled }) => switchEnabled && 'left: 19px;'}
`;

function Switch(props) {
  const [switchEnabled, setSwitchEnabled] = React.useState(false);

  const handleClick = () => {
    setSwitchEnabled(!switchEnabled);
  };

  return (
    <SwitchContainer onClick={handleClick}>
      <SwitchInner>
        <SwitchKnob switchEnabled={switchEnabled} />
      </SwitchInner>
    </SwitchContainer>
  );
}

function TrueRewards(props) {
  const { history } = props;

  const [loadingWeb3State, setLoadingWeb3State] = React.useState(null);
  const [localWeb3State, setLocalWeb3State] = React.useState({});

  const connectWallet = async () => {
    // const web3State = await web3.init();
    // setLocalWeb3State(web3State);
    setLocalWeb3State({ accounts: []});
  };

  return (
    <div>
      <Container>
        {!localWeb3State.accounts &&
          <div onClick={connectWallet}>
            Connect Wallet
          </div>
        }
        {localWeb3State.accounts &&
          <div>
            <Box>
              <div>img placeholder</div>
              <div>
                <Label>TrustToken Balance</Label>
                <Amount>1,000,000<Ticker>TRUST</Ticker></Amount>
              </div>
            </Box>
            <Box>
              <BoxInner>
                <div>img placeholder</div>
                <div>
                  <Label>TUSD balance</Label>
                  <Amount>1,000,000<Ticker>TUSD</Ticker></Amount>
                </div>
                <div>img placeholder</div>
                <div>
                  <Label>Earnings</Label>
                  <Amount>10.01010101<Ticker>TUSD</Ticker></Amount>
                </div>
                <div>
                  <Label>Enable Aave Rewards</Label>
                  <Switch/>
                </div>
              </BoxInner>
              <Label>Annual Percentage Rewards</Label>
              <Amount>4.0%</Amount>
            </Box>
          </div>
        }
      </Container>
    </div>
  );
}

export { TrueRewards };
