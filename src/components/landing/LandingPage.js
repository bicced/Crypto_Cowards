// Compt for copying as a LandingPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Button, WhiteSpace, WingBlank
} from 'antd-mobile'
import {

} from 'antd'
import cryptoimg from '../../../resources/cryptoimg.png'
import gbb from '../../../resources/gbb.png'


class LandingPage extends Component {

  scrollDown() {
		console.log('scroll')
		window.scrollTo({
		    top: 775,
		    behavior: "smooth"
		})
	}

	render() {
		return (
      <div>
  			<div id='LandingPage' style={comStyles().containerOne}>
  				<div id='topbar' style={comStyles().topbar}>
  					<div style={comStyles().title} onClick={() => console.log(CryptoCowards)}>CryptoCowards</div>
  					<div style={{fontSize:'20px', marginTop: '1%', cursor: 'pointer'}} onClick={() => this.props.history.push('/login')}>Sign In</div>
  				</div>
  				<div style={comStyles().midbar}>
  					<div>
  						<div style={comStyles().topic} onClick={() => console.log(CryptoCowards)}>Trade cryptocurrency automatically using proven strategies</div>
  						<br/><br/>
  						<div style={{fontSize:'25px'}} onClick={() => console.log(signin)}>
  							- Make returns like a professional cryptocurrency trader<br/>
  							&nbsp; by mimicing their allocations <br/><br/>
								
  							- Automatically rebalance your portfolio or execute<br/>
                &nbsp; trading algorithms using our AI trading bots <br/><br/>

  							- Follow predetermined strategies by other traders <br/>
                &nbsp; or create your own rebalancing strategies
  						</div>
							{/*<div style={comStyles().topic} onClick={() => console.log(CryptoCowards)}>Confident In Your Trades?</div>
  						<br/><br/>
  						<div style={{fontSize:'25px'}} onClick={() => console.log(signin)}>
  							- Mimic professional cryptocurrency <br/>
  							&nbsp; portfolios with minimal effort <br/><br/>
  							- Automatically rebalance your portfolio or execute<br/>
                &nbsp; trading algorithms using our AI trading bots <br/><br/>

  							- Follow predetermined strategies by other traders <br/>
                &nbsp; or create your own rebalancing strategies
  						</div>*/}
  						<br/><br/>
  						<div style={{marginLeft: "5%"}}>
  							<Button onClick={() => this.props.history.push('/login')} inline type="default" style={{marginRight:'5%'}}>Sign in</Button> &nbsp;
  							<Button inline type="default" onClick={() => {this.scrollDown() }}>Learn more</Button>
  						</div>
  					</div>
  					<div style={{marginRight: '10%'}}>
  						<img style={{borderRadius:'10%'}} src={cryptoimg} height="450" width="480" />
  					</div>
  				</div>
  			</div>

        <div style={comStyles().containerTwo}>
          <div style={comStyles().topicTwo} ><b>What do I need to begin?</b></div>
          <br/><br/>
          <div style={comStyles().midbarTwo}>
            <p style={{flex: 1, marginLeft: '1%', marginRight: '1%'}}><b>1) A Gmail account </b></p>
            <p style={{flex: 1, marginLeft: '1%', marginRight: '1%'}}><b>2) A Binance account </b></p>
            <p style={{flex: 1, marginLeft: '1%', marginRight: '1%'}}><b>3) $300 in cryptocurrency </b></p>
          </div>
          <img src={gbb} />
          <div style={comStyles().description}>
            <p style={{flex: 1, marginLeft: '5%', marginRight: '5%'}} > Use your Gmail account to sign in. No other registration is required.</p>
            <p style={{flex: 1, marginLeft: '5%', marginRight: '5%'}}> Your Binance trade-only API keys are needed for our bots to carry out strategies on your behalf.</p>
            <p style={{flex: 1, marginLeft: '5%', marginRight: '5%'}}> To cover Binance transaction fees required for every trade, we reccomend users to have over $300 worth of cryptocurrencies. </p>
          </div>
        </div>

				<div style={comStyles().containerThree}>
          <div style={comStyles().topicTwo} ><b>Historical performace: One of our strategies (Cowards 15)</b></div>

        </div>
      </div>
		)
	}
}

// defines the types of variables in this.props
LandingPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
LandingPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LandingPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		containerOne: {
      display: 'flex',
      flexDirection: 'column',
      background: '#fe8c00',  /* fallback for old browsers */
      background: '-webkit-linear-gradient(to right, #f83600, #fe8c00)',  /* Chrome 10-25, Safari 5.1-6 */
      background: 'linear-gradient(to right, #f83600, #fe8c00)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
			height: '100vh',
		},
		title: {
			fontSize: '35px',
			fontWeight: 'bold',
      fontFamily: `'Reem Kufi', sans-serif`,
		},
    topic: {
			fontSize: '35px',
			fontWeight: 'bold',
      fontFamily: 'Sans-serif',
		},
		topbar: {
			display: 'flex',
			justifyContent: 'space-between',
			marginLeft: '10%',
			marginRight: '10%',
			marginTop: '3%',
			color: 'white',
			fontFamily: 'Sans-serif',
		},
		midbar: {
			display: 'flex',
			justifyContent: 'space-between',
			marginLeft: '10%',
			marginRight: '3%',
			marginTop: '6%',
			color: 'white',
			fontFamily: 'Sans-serif',
		},
    containerTwo: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
			height: '100vh',
      color: '#fe8c00',
			fontFamily: 'Sans-serif',
		},
    topicTwo: {
      marginTop: '6%',
			fontSize: '35px',
			fontWeight: 'bold',
      fontFamily: 'Sans-serif',
      textAlign: 'center',
		},
    midbarTwo: {
      textAlign: 'center',
      marginTop: '6%',
      fontSize:'20px',
      display: 'flex',
      justifyContent: 'space-around',
		},
    description: {
      display: 'flex',
      justifyContent: 'space-around',
      textAlign: 'center',
      fontSize:'15px',
      marginLeft: '3%',
      marginRight: '3%',
		},
		containerThree: {
      display: 'flex',
      flexDirection: 'column',
			background: '#f83600',  /* fallback for old browsers */
      background: '-webkit-linear-gradient(to right, #fe8c00, #f83600,)',  /* Chrome 10-25, Safari 5.1-6 */
      background: 'linear-gradient(to right, #fe8c00, #f83600)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
			height: '100vh',
      color: 'white',
			fontFamily: 'Sans-serif',
		},
    topicThree: {
      marginTop: '6%',
			fontSize: '35px',
			fontWeight: 'bold',
      fontFamily: 'Sans-serif',
      textAlign: 'center',
		},
    midbarThree: {
      textAlign: 'center',
      marginTop: '6%',
      fontSize:'20px',
      display: 'flex',
      justifyContent: 'space-around',
		},
	}
}
