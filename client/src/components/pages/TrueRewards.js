import * as React from 'react';
import styled from 'styled-components';
// import { web3 } from '../contracts/web3';
import { EthService } from '@/contracts/EthService';
import TokenStackIcon from '@/assets/token-stack.svg';
import ClockStackIcon from '@/assets/clock-stack.svg';
import CardIcon from '@/assets/card.png';

const Container = styled.div`
  height: 118px;
  left: 156px;
  top: 100px;
  background: #FFFFFF;
  border: 1px solid #E7EAF3;
  box-sizing: border-box;
  border-radius: 8px;

  margin: 0 auto;

  vertical-align: center;
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

const TableHeader = styled.div`
  display: block;
  height: 40px;
  background: #FFFFFF;
  border-radius: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #7A859E;
  clear: right;
`;

const ProjectBox = styled.div`
  height: 80px;
  background: #FFFFFF;
  border: 1px solid #E7EAF3;
  box-sizing: border-box;
  box-shadow: 0px 24px 60px rgba(2, 10, 33, 0.04);
  border-radius: 8px;
  td {
      //text-align: center;
      vertical-align: middle;
  }
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
  const [switchEnabled, setSwitchEnabled] = React.useState(true);

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

function BalanceBox({icon, description, balance}) {
  return (
  <div style={{display: 'inline-block', padding: '35px 0 0 50px'}}>

    <div style={{display: 'flex'}}>

      <div style={{width: '60px'}}>
        {icon}
      </div>

      <div style={{flexGrow: 1, display: 'block'}}>
        <Label> {description} </Label>
        <Amount> 0.0 <Ticker> TUSD </Ticker> </Amount>
      </div>

    </div>

  </div>
  );
}


function Project({project, annualRewards, balance, rewardsEarned, rewards}) {
  return (
    <ProjectBox>
      <table style={{width: '100%', height: '100%'}}>
        <colgroup>
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
        </colgroup>

        <tbody>
          <tr>
            <td>
              {project}
            </td>
            <td>
              {annualRewards}
            </td>
            <td>
              {balance}
            </td>
            <td>
              {rewardsEarned}
            </td>
            <td>
              {rewards}
            </td>
          </tr>
        </tbody>
      </table>
    </ProjectBox>
  );
}


function TrueRewards(props) {
  const { history } = props;

  const [metamaskAccounts, setMetamaskAccounts] = React.useState(null);
  const [TUSDBalance, setTUSDBalance] = React.useState(null);

  const initMetamask = async () => {
    await EthService.init();
    console.log(EthService.state);
    setMetamaskAccounts(EthService.accounts);
    setTUSDBalance(EthService.state.TUSDBalance);
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
        <BalanceBox icon=<TokenStackIcon/> description="TrueUSD balance" balance={TUSDBalance} />
        <BalanceBox icon=<ClockStackIcon/> description="Total rewards earned" balance={0.0} />

        <div style={{
                     float: 'right',
                     padding: '40px'
                   }}
        >
          <div style={{
                     style: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     padding: '10px',
                     height: '32px',
                     fontSize: '14px',
                     lineHeight: '20px',
                     color: '#FFFFFF',
                     background: '#1253FA',
                     borderRadius: '2px',
                     }}
          >
            <a href="https://www.trusttoken.com/trueusd"
               style={{ color: '#FFFFFF' }}
            >
                <img src={CardIcon} />
                &nbsp;
                Purchase TUSD
            </a>
          </div>
        </div>

        
        { /* metamaskAccounts &&
          <div>
            <Box>
              <BoxInner>
                <div><TokenStackIcon /></div>
                <div>
                  <Label>TUSD balance</Label>
                  <Amount>{TUSDBalance}<Ticker>TUSD</Ticker></Amount>
                </div>
                <div><ClockStackIcon /></div>
                <div>
                  <Label>Earnings</Label>
                  <Amount>10.01010101<Ticker>TUSD</Ticker></Amount>
                </div>
                <div>
                  <Label>Enable Aave Rewards</Label>
                  <Switch
                    onEnable={() => EthService.enableTrueReward()}
                    onDisable={() => EthService.disableTrueReward()}
                  />
                </div>
              </BoxInner>
              <Label>Annual Percentage Rewards</Label>
              <Amount>4.0%</Amount>
            </Box>
          </div>
        */
        }
      </Container>

      <div style={{ display: 'block',
                 }}
      >
        <div style={{display: 'flex',
                    float: 'right',
                    padding: '40px 0 10px 0',
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#1253FA'
                   }}
        >
          <a href="">
            What happens when I enable rewards?
          </a>
        </div>
      </div>

    <TableHeader>
      <table style={{width: '100%'}}>
        <colgroup>
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
          <col span="1" style={{width: '20%'}} />
        </colgroup>
        <tbody>
          <tr>
            <td>
              Project
            </td>
            <td>
              Annual rewards
            </td>
            <td>
              Balance
            </td>
            <td>
              Rewards earned
            </td>
            <td>
              Rewards
            </td>
          </tr>
        </tbody>
      </table>
    </TableHeader>


    <Project
      project=<div>AAVE</div>
      annualRewards="0.75%"
      balance="0.0"
      rewardsEarned="0.0"
      rewards="Enable"
    />

    </div>
  );
}

export { TrueRewards };
