import * as React from 'react';
import styled from 'styled-components';
// import { web3 } from '../contracts/web3';
import { EthService } from '@/contracts/EthService';
import TokenStackIcon from '@/assets/token-stack.svg';
import ClockStackIcon from '@/assets/clock-stack.svg';

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
    if (!switchEnabled) {
      props.onEnable();
    } else {
      props.onDisable();
    }
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

function TrustTokenAssurance(props) {
  const { history } = props;

  const [metamaskAccounts, setMetamaskAccounts] = React.useState(null);
  const [TrustTokenBalance, setTrustTokenBalance] = React.useState(null);

  const initMetamask = async () => {
    await EthService.init();
    console.log(EthService.state);
    setMetamaskAccounts(EthService.accounts);
    setTrustTokenBalance(EthService.state.TrustTokenBalance);
  };

  React.useEffect(() => {
    console.log('effect');
    if (!EthService.isMetamaskLocked()) {
      initMetamask();
    }
  }, [])

  const connectWallet = async () => {
    // const web3State = await web3.init();
    // setLocalWeb3State(web3State);
    initMetamask();
    // setLocalWeb3State({ accounts: []});
  };

  return (
    <div>
      <Container>
        {!metamaskAccounts &&
          <div onClick={connectWallet}>
            Connect Wallet
          </div>
        }
        {metamaskAccounts &&
          <div>
            <Box>
              <BoxInner>
                <div><TokenStackIcon /></div>
                <div>
                  <Label>TrustToken balance</Label>
                  <Amount>{`${TrustTokenBalance / 100000000}`}<Ticker>TRU</Ticker></Amount>
                </div>
                <div><ClockStackIcon /></div>
                <div>
                  <Label>Total Earnings</Label>
                  <Amount>10.01010101<Ticker>TRU</Ticker></Amount>
                </div>
              </BoxInner>
            </Box>
            <Box>
              <div>Aave<span>Learn More</span></div>
              <div>0.75%</div>
              <div>10</div>
              <div>+1.43434</div>
              <Switch
                onEnable={() => EthService.depositStakedToken(20)}
                onDisable={() => console.log(disable)}
              />
            </Box>
          </div>
        }
      </Container>
    </div>
  );
}

export { TrustTokenAssurance };
