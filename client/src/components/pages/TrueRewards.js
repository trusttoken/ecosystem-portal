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

const HeaderBox = styled.div`
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


const FutureOpportunityBox = styled.div`
  height: 70px;

  /* N100 - Athens */

  background: #F6F8FC;
  /* N200 - Porcelain */

  border: 1px dashed #E6EBF2;
  box-sizing: border-box;
  border-radius: 6px;

  color: #9BAABF;
`;


const GreenBox = styled.div`
  width: 67px;
  height: 32px;

  /* Mountain Meadow_light */

  background: #E0F9F0;
  border-radius: 6px;

  /* 0.75% */

  /* Body 1 / Regular 18px */

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;
  /* identical to box height, or 144% */

  display: flex;
  align-items: center;

  /* Mountain Meadow */

  color: #0FD28C;
`;

const WhiteBox = styled.div`
  /* Rectangle 136 */

  width: 53px;
  height: 32px;

  /* N0 - White */

  background: #FFFFFF;
  border-radius: 6px;

  /* Body 2 / Regular 16px */

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  display: flex;
  align-items: center;
`;

const GrayDot = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E0E9EE;
`;


const RewardInfoBox = styled.div`
  height: 52px;
  width: 100%;

  /* N0 - White */

  background: #FFFFFF;
  /* N200 - Porcelain */

  border: 1px solid #E6EBF2;
  box-sizing: border-box;
  border-radius: 6px;

  /* Body 2 / Regular 16px */

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  /* N600 - Big Stone */

  color: #001425;
  padding: 20px;
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


function Cell({content}) {
  return (
    <td>
      <div style={{padding: '0px 10px 0px 10px'}}>
        {content}
      </div>
    </td>
  );
}


function Row({project, annualRewards, balance, rewardsEarned, rewards}) {
  return (
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
            <Cell content={project} />
            <Cell content={annualRewards} />
            <Cell content={balance} />
            <Cell content={rewardsEarned} />
            <td>
              <div style={{textAlign: 'right'}} >
                {rewards}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  );
}


function Project({project, annualRewards, balance, rewardsEarned, rewards}) {
  return (
    <ProjectBox>
      <Row project={project} annualRewards={annualRewards} balance={balance} rewardsEarned={rewardsEarned} rewards={rewards} />
    </ProjectBox>
  );
}

function FutureOpportunity({project, annualRewards, balance, rewardsEarned, rewards}) {
  return (
    <FutureOpportunityBox>
      <Row project={project} annualRewards={annualRewards} balance={balance} rewardsEarned={rewardsEarned} rewards={rewards} />
    </FutureOpportunityBox>
  );
}

function Link({href, text}) {
  return (
    <div style={{ fontSize: '14px', lineHeight: '20px', color: '#1253FA' }} >
      <a href={href}>
        {text}
      </a>
    </div>
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

    <HeaderBox>
      <Row project="Project" annualRewards="Annual rewards" balance="Balance" rewardsEarned="Rewards earned" rewards="Rewards" />
    </HeaderBox>

    <div style={{marginTop: '8px'}} />

    <Project
      project=<div style={{padding: '10px'}}>
                <span style={{float: 'left'}}>
                  <GrayDot/>
                </span>

                <div style={{padding: '0px 0px 0px 10px'}}>
                    AAVE
                    <span style={{float: 'right'}}>
                      <Link href="" text="Learn more" />
                    </span>
                </div>

              </div>
      annualRewards=<GreenBox>0.75%</GreenBox>
      balance="0.0"
      rewardsEarned="0.0"
      rewards=<div>
                Enable
                &nbsp;
                <div style={{float: 'right'}}> 
                    <Switch
                      onEnable={() => EthService.enableTrueReward()}
                      onDisable={() => EthService.disableTrueReward()}
                    />
                </div> 
              </div>
    />

    <div style={{marginTop: '8px'}} />

    <FutureOpportunity
      project=<div style={{padding: '10px'}}>
                <span style={{float: 'left'}}>
                  <GrayDot/>
                </span>

                <div style={{padding: '0px 0px 0px 10px'}}>
                  Future Reward Opportunity
                </div>

              </div>
      annualRewards=<WhiteBox>4.0%</WhiteBox>
      balance="0.0"
      rewardsEarned="0.0"
      rewards=<div>
                Enable
                &nbsp;
                <div style={{float: 'right'}}> 
                    <Switch
                      onEnable={() => EthService.enableTrueReward()}
                      onDisable={() => EthService.disableTrueReward()}
                    />
                </div> 
              </div>
    />

    <div style={{marginTop: '8px'}} />

    <FutureOpportunity
      project=<div style={{padding: '10px'}}>
                <span style={{float: 'left'}}>
                  <GrayDot/>
                </span>

                <div style={{padding: '0px 0px 0px 10px'}}>
                  Future Reward Opportunity
                </div>

              </div>
      annualRewards=<WhiteBox>4.0%</WhiteBox>
      balance="0.0"
      rewardsEarned="0.0"
      rewards=<div>
                Enable
                &nbsp;
                <div style={{float: 'right'}}> 
                    <Switch
                      onEnable={() => EthService.enableTrueReward()}
                      onDisable={() => EthService.disableTrueReward()}
                    />
                </div> 
              </div>
    />

    <div style={{marginTop: '40px'}} />

    <RewardInfoBox>
      More reward opportunities coming soon
                    <span style={{float: 'right'}}>
                      <Link href="" text="Learn more" />
                    </span>
    </RewardInfoBox>

    </div>
  );
}

export { TrueRewards };
