// Higher Order Compt for initializing actions upon AppRoot load

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { retrieveUserFromLocalStorage } from '../api/aws/aws-cognito'
import { dispatchActionsToRedux } from '../actions/system/system_actions'
import {
	saveUserProfileToRedux,
	authenticateUser,
	authenticationLoaded,
	forwardUrlLocation,
} from '../actions/auth/auth_actions'
import {
	saveUserAlgos,
	saveAllAlgos,
	saveUserFollows,
	saveUserSelected,
} from '../actions/algo/algo_actions'
import { saveLoadingCompleteToRedux } from '../actions/app/app_actions'
import {
	redirectPath,
	setLanguageFromLocale,
	checkIfPartOfRoutes,
} from '../api/general/general_api'
import {
	getUserProfile,
	userApiExists,
} from '../api/auth/auth_api'
import {
	getUserAlgos,
	getAllAlgos,
	getUserFollows,
} from '../api/algo/user_algos'
import { getUserNotifications } from '../api/notifications/user_notifications'
import { saveNotifications } from '../actions/notifications/notification_actions'
import { getTopRanks } from '../api/cmc/get_top'
import { getBot } from '../api/bot/selected_bot'
import { saveTopRanks } from '../actions/cmc/cmc_actions'

const binanceSymbols = ['BTC', 'ADA', 'ADX', 'AE', 'AGI', 'AION', 'AMB', 'APPC', 'ARK', 'ARN', 'AST', 'BAT',
                  'BCC', 'BCD', 'BCN', 'BCPT', 'BLZ', 'BNB', 'BNT', 'BQX', 'BRD', 'BTG', 'BTS', 'CDT',
                  'CHAT', 'CLOAK', 'CMT', 'CND', 'CVC', 'DASH', 'DATA', 'ARDR', 'HOT', 'DOCK', 'POLY', 'DENT', 'DGD', 'DLT', 'DNT', 'EDO', 'ELF',
                  'ENG', 'ENJ', 'EOS', 'ETC', 'ETH', 'EVX', 'FUEL', 'FUN', 'GAS', 'GNT', 'GRS', 'GTO', 'GVT', 'GXS', 'HSR', 'ICN', 'ICX', 'INS',
                  'IOST', 'IOTA', 'IOTX', 'KEY', 'KMD', 'KNC', 'LEND', 'LINK', 'LOOM', 'LRC', 'LSK', 'LTC', 'LUN', 'MANA', 'MCO', 'MDA', 'MFT',
                  'MOD', 'MTH', 'MTL', 'NANO', 'NAS', 'NAV', 'NCASH', 'NEBL', 'NEO', 'NPXS', 'NULS', 'NXS', 'OAX', 'OMG', 'ONT', 'OST', 'PIVX',
                  'POA', 'POE', 'POWR', 'PPT', 'QKC', 'QLC', 'QSP', 'QTUM', 'RCN', 'REP', 'REQ', 'RLC', 'RPX', 'SALT', 'SC', 'SKY', 'SNGLS', 'SNM',
                  'SNT', 'STEEM', 'STORJ', 'STORM', 'STRAT', 'SUB', 'SYS', 'THETA', 'TNB', 'TNT', 'TRIG', 'TRX', 'TUSD', 'VEN', 'VIA', 'VIB', 'VIBE',
                  'WABI', 'WAN', 'WAVES', 'WINGS', 'WPR', 'WTC', 'XEM', 'XLM', 'XMR', 'XRP', 'XVG', 'XZC', 'YOYO', 'ZEC', 'ZEN', 'ZIL', 'ZRX']

// this 'higher order component'(HOC) creator takes a component (called ComposedComponent)
// and returns a new component with added functionality
export default (ComposedComponent) => {
	class AppRootMechanics extends Component {

    componentWillMount() {
			// check if user is already authenticated
			this.checkIfUserLoggedIn()

			// do stuff based on the URL
			this.executeOnURL()

			setInterval(
				getTopRanks()
					.then((data) =>{
						console.log(data)
						console.log(data.filter((coin) => binanceSymbols.includes(coin[1])))
						this.props.saveTopRanks(data.filter((coin) => binanceSymbols.includes(coin[1])))
					})
				, 960000)

			getAllAlgos()
				.then((algoData) => {
					this.props.saveAllAlgos(algoData)
				})
    }

		checkIfUserLoggedIn() {
			// grab the url that was given, will be used in this,saveUserProfileToRedux()
			let location = this.props.location.pathname + this.props.location.search + this.props.location.hash
			if (location === '/login') {
				location = '/login'
			}
			retrieveUserFromLocalStorage()
				.then((user) => {
					return getUserProfile(user.IdentityId, {})
				})
				.then((data) => {
					console.log(data)
					if (location === '/') {
						location = '/app/home'
					}
					// if they have, then we'll auto log them in
					this.props.history.push(location)
					this.props.authenticationLoaded()
					getUserNotifications(data.profile.user_id)
						.then((data) => {
							console.log(data)
							this.props.saveNotifications(data)
						})
					getUserAlgos(data.profile.user_id)
						.then((userAlgos) => {
							this.props.saveUserAlgos(userAlgos)
						})
					getUserFollows(data.profile.user_id)
						.then((userFollows) => {
							this.props.saveUserFollows(userFollows)
						})
					getBot(data.profile.user_id)
						.then((selected) => {
							console.log(selected)
							this.props.saveUserSelected(selected)
						})
					userApiExists(data.profile.user_id)
						.then((exists) => {
							data.profile.api_exists = exists
							this.saveUserProfileToRedux(data.profile, location)
						})
				})
				.catch((err) => {
					// if not then we do nothing
					console.log('kz tripping shit')
					console.log(err)
					this.props.forwardUrlLocation(location)
					this.props.history.push(location)
					this.props.authenticateUser(null)
					this.props.authenticationLoaded()
				})
		}

		saveUserProfileToRedux(user, location) {
			let app_location = location
			this.props.saveUserProfileToRedux(user)
			this.props.authenticateUser(user)
			return this.grabAllInitialData(user.user_id)
				.then((results) => {
					console.log(results)
					this.props.saveLoadingCompleteToRedux()
					this.props.history.push(app_location)
				})
				.catch((err) => {
					console.log('nooooo')
					console.log(err)
				})
		}

		grabAllInitialData(id) {
			const initials = [

			]
			console.log(initials)
			return Promise.all(initials)
		}

		executeOnURL() {
			// grab the url that was given
			const pathname = this.props.location.pathname
			const search = this.props.location.search
			const hash = this.props.location.hash
			// take the path in the url and go directly to that page and save to redux any actions necessary
			if (pathname !== '/') {
				// use forwardUrlLocation when you have a path that requires a login first (privately available)
				// use PossibleRoutes.js when you have a path that is publically available
				this.props.forwardUrlLocation(pathname + search + hash)
				// if not, then we do nothing
				redirectPath(pathname + search + hash).then(({ path, actions }) => {
					// path = '/sage-5'
					// actions = [ { type, payload }, { type, payload } ]
					this.props.dispatchActionsToRedux(actions)
					this.props.history.push(path)
				})
			}
		}

		render() {
			// the rendered composed component, with props passed through
			return <ComposedComponent id='AppRootKernal' {...this.props} />
		}
	}

  // defines the types of variables in this.props
  AppRootMechanics.propTypes = {
  	history: PropTypes.object.isRequired,
		forwardUrlLocation: PropTypes.func.isRequired,
		saveUserProfileToRedux: PropTypes.func.isRequired,
		authenticateUser: PropTypes.func.isRequired,
		dispatchActionsToRedux: PropTypes.func.isRequired,
		saveLoadingCompleteToRedux: PropTypes.func.isRequired,
		authenticationLoaded: PropTypes.func.isRequired,
		saveUserAlgos: PropTypes.func.isRequired,
		saveAllAlgos: PropTypes.func.isRequired,
		saveUserFollows: PropTypes.func.isRequired,
		saveUserSelected: PropTypes.func.isRequired,
		saveTopRanks: PropTypes.func.isRequired,
		saveNotifications: PropTypes.func.isRequired,
  }

  // for all optional props, define a default value
  AppRootMechanics.defaultProps = {

  }

	const mapStateToProps = (redux) => {
		return {
		}
	}

	// we nest our custom HOC to connect(), which in itself is a HOC
	// we can actually nest HOC infinitely deep
	return withRouter(
		connect(mapStateToProps, {
			forwardUrlLocation,
			saveUserProfileToRedux,
			authenticateUser,
			dispatchActionsToRedux,
			saveLoadingCompleteToRedux,
			authenticationLoaded,
			saveUserAlgos,
			saveAllAlgos,
			saveUserFollows,
			saveUserSelected,
			saveTopRanks,
			saveNotifications,
    })(AppRootMechanics)
	)
}

// Pseudo-code demonstrating how to use the higher order component (HOC)
/*
	// In some other location (not in this file), we want to use this HOC...
	import AppRootMechanics	// The HOC
	import Resources		// The component to be wrapped
	const ComposedComponent = AppRootMechanics(Resources);

	// In some render method...
	<ComposedComponent />

	// <ComposedComponent> actually renders the AppRootMechanics class, which renders the composed component
	// This 2 layer method is powerful because when we pass in props to <ComposedComponent> like below:
	<ComposedComponent propA={propA} />
	// we can pass those props into the 2nd layer (composed component) using a correct 'this' reference to the 1st layer
*/
