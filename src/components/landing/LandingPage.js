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
import binanceimg from '../../../resources/binance.png'
import gmailimg from '../../../resources/gmail.png'
import btclogoimg from '../../../resources/btclogo.png'


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
      <div style={comStyles().container}>
				<div style={comStyles().backgroundOne}>

					<div style={comStyles().partOne}>
						<div style={comStyles().titleOne}>
							<h1 style={comStyles().title} onClick={() => console.log(CryptoCowards)}>CryptoCowards</h1>
							<div style={{fontSize:'20px', marginTop: '1%', cursor: 'pointer'}} onClick={() => this.props.history.push('/login')}>Sign In</div>
						</div>

						<div style={ screen.width >= 1000 ? comStyles().mainOneLarge : comStyles().mainOneSmall}>
							<div style={comStyles().infoOne}>
								<h1 style={ screen.width >= 660 ? comStyles().topicOneL : comStyles().topicOneS}>
									Automated cryptocurrency trading using proven strategies
								</h1>
								<div>
									<br/>
									<h2 style={ screen.width >= 660 ? comStyles().textOneL : comStyles().textOneS}>
										Make returns like professional cryptocurrency traders by mimicing their portfolio allocations
									</h2>
									<br/>
									<h2 style={ screen.width >= 660 ? comStyles().textOneL : comStyles().textOneS}>
										Quickly and easily rebalance Binance portfolios into selected cryptocurrencies
									</h2><br/>
									<h2 style={ screen.width >= 660 ? comStyles().textOneL : comStyles().textOneS}>
										Build and run your own cryptocurrency index funds by setting automated rebalancing schedules
									</h2>
								</div>
								<div style={{marginTop: '5%', marginBottom: '5%'}}>
									<Button style={{marginRight: '5%'}} onClick={() => this.props.history.push('/login')} inline type="default">Sign in</Button> &nbsp;
									<Button inline type="default" onClick={() => {this.scrollDown() }}>Learn more</Button>
								</div>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5%'}}>
								<img style={comStyles().imgLarge} src={cryptoimg} align="middle" width={screen.width >= 1000 ? screen.width / 2.6 : screen.width / 1.3 } height={screen.width >= 1000 ? screen.width / 3 : screen.width / 1.5 }/>
							</div>
						</div>

					</div>
				</div>

				<div style={comStyles().backgroundTwo}>
					<div style={comStyles().partTwo}>
						<div style={screen.width >= 660 ? comStyles().topicTwoL : comStyles().topicTwoS} >
							<b>What do I need to begin?</b>
						</div>
						<div style={ screen.width >= 800 ? comStyles().mainTwoLarge : comStyles().mainTwosmall} >
							<div style={ screen.width >= 800 ? comStyles().textTwoLarge : comStyles().textTwoSmall}>
								<h3 style={comStyles().stepTitle}>1) A Gmail account</h3>
								<img src={gmailimg} width={screen.width >= 800 ? screen.width / 5 : screen.width / 2 }/>
								<h4 style={comStyles().stepDescriptions}> Use your Gmail account to sign in. No other registration is required.</h4>
							</div>
							<div style={screen.width >= 800 ? comStyles().textTwoLarge : comStyles().textTwoSmall}>
								<h3 style={comStyles().stepTitle}>2) A Binance account</h3>
								<img src={binanceimg} width={screen.width >= 800 ? screen.width / 5 : screen.width / 2 }/>
								<h4 style={comStyles().stepDescriptions}>Your Binance trade-only API keys are needed for our bots to carry out strategies on your behalf.</h4>
							</div>
							<div style={screen.width >= 800 ? comStyles().textTwoLarge : comStyles().textTwoSmall}>
								<h3 style={comStyles().stepTitle}>3) $300 in cryptocurrency </h3>
								<img src={btclogoimg} width={screen.width >= 800 ? screen.width / 5 : screen.width / 2 }/>
								<h4 style={comStyles().stepDescriptions}>To cover Binance transaction fees required for every trade, we reccomend users to have over $300 worth of cryptocurrencies. </h4>
							</div>
						</div>
					</div>
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
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
		imgLarge: {
			borderRadius: '10%',
		},
		backgroundOne: {
			background: '#fe8c00',  /* fallback for old browsers */
      background: '-webkit-linear-gradient(to right, #f83600, #fe8c00)',  /* Chrome 10-25, Safari 5.1-6 */
      background: 'linear-gradient(to right, #f83600, #fe8c00)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
		backgroundTwo: {
		},
		partOne: {
			display: 'flex',
			flexDirection: 'column',
			marginLeft: '10%',
			marginRight: '10%',
			marginTop: '3%',
			marginBottom: '3%',
			color: 'white',
			fontFamily: 'Sans-serif',
		},
		titleOne: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between'
		},
		title: {
			fontSize: '35px',
			fontWeight: 'bold',
			color: 'white',
      fontFamily: `'Reem Kufi', sans-serif`,
		},
		mainOneLarge: {
			marginTop: '6%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		mainOneSmall: {
			marginTop: '6%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
		},
		infoOne: {
		},
    topicOneL: {
			fontSize: '35px',
			color: 'white',
			fontWeight: 'bold',
      fontFamily: 'Sans-serif',
		},
		topicOneS: {
			fontSize: '25px',
			color: 'white',
			fontWeight: 'bold',
      fontFamily: 'Sans-serif',
		},
		textOneL: {
			fontSize:'20px',
			marginLeft: '10px',
			color: 'white',
			marginRight: '10px'
		},
		textOneS: {
			fontSize:'14px',
			color: 'white',
			marginLeft: '10px',
			marginRight: '10px'
		},
		partTwo: {
			display: 'flex',
			flexDirection: 'column',
			marginLeft: '5%',
			marginRight: '5%',
			marginTop: '3%',
			marginBottom: '3%',
			color: '#fe8c00',
			fontFamily: 'Sans-serif',
		},
		topicTwoL: {
			fontSize: '35px',
			fontWeight: 'bold',
      fontFamily: 'Sans-serif',
			textAlign: 'center',
		},
		topicTwoS: {
			fontSize: '25px',
			fontWeight: 'bold',
			marginBottom: '5%',
			marginTop: '5%',
      fontFamily: 'Sans-serif',
			textAlign: 'center',
		},
		mainTwoLarge: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		mainTwoSmall: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
		},
		textTwoLarge: {
			flex: '1',
			marginLeft: '1%',
			marginRight: '1%',
			textAlign: 'center',
			marginTop: '5%',
		},
		textTwoSmall: {
			flex: '1',
			marginBottom: '10%',
			textAlign: 'center',
			marginTop: '5%',
		},
		stepTitle: {
			color: '#fe8c00',
			fontSize: '20px',
			fontWeight: 'bold',
			marginBottom: '5%',
		},
		stepDescriptions: {
			color: '#fe8c00',
			marginTop: '5%',
		}
	}
}
