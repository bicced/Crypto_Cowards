// Compt for copying as a SettingsPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { saveBinance } from '../../api/binance/save_binance'
import { getUserProfile, removeUserApi } from '../../api/auth/auth_api'
import { addCoward, addPro } from '../../api/users/add_role'
import { saveUserProfileToRedux } from '../../actions/auth/auth_actions'
import {
	Card,
	Avatar,
	Icon,
	Divider,
	Button,
	List,
	Input,
	message,
	Radio,
} from 'antd'


class SettingsPage extends Component {

	constructor() {
		super()
		this.state = {
			apiKey: '',
			apiSecret: '',
		}
	}

	checkApi() {
		console.log('Checking api')
		if (this.state.apiKey.length == 64 && this.state.apiSecret.length == 64) {
			return false
		}
		else {
			return true
		}
	}

	//
	submitKeys() {
		saveBinance({API_KEY: this.state.apiKey, API_SECRET: this.state.apiSecret, user_id: this.props.user_profile.user_id})
			.then((data) => {
				message.success('Successfully updated API keys')
				this.props.saveUserProfileToRedux({ user_id: this.props.user_profile.user_id, first_name: this.props.user_profile.first_name, last_name: this.props.user_profile.last_name, email: this.props.user_profile.email, api_exists: true})
			})
			.catch((err) => {
				message.error('Invalid API keys')
			})
	}

	renderUserHeader() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', }}>
				<Icon type="setting" style={{ fontSize: '3REM'}} />
				<h2 style={{ fontSize: '230%', marginLeft: '2%' }}>{` Settings`}</h2>
			</div>
		)
	}

	renderUserProfilePreview() {

		return (
      <div style={{ margin: '10px 10px 0px 10px' }}>
        <div style={comStyles().rowContainer}>
          <h2 style={{ margin: 0 }}>{`${this.props.user_profile.first_name} ${this.props.user_profile.last_name}`}</h2>
					<Button type='primary' ghost onClick={() => console.log('soon')}>
						UPGRADE TO PRO
					</Button>
        </div>
        <br />
        <div>
          <p>{`Email: ${this.props.user_profile.email}`}</p>
					<p>{`Account Type: `}{this.props.user_profile.pro ? 'Pro' : 'Free'}</p>
        </div>
      </div>
    )
	}

	removeApi() {
		removeUserApi(this.props.user_profile.user_id)
			.then((data) => {
				message.success('Removed Existing Api Keys')
				this.props.saveUserProfileToRedux({ user_id: this.props.user_profile.user_id, first_name: this.props.user_profile.first_name, last_name: this.props.user_profile.last_name, email: this.props.user_profile.email, api_exists: false})
			})
			.catch((err) => {
				console.log(err)
				message.error('Error Occured')
			})
	}

	renderApiStatus() {    //change to api status
		if (this.props.user_profile.api_exists) {
			return (
				<div>
					<div style={comStyles().rowContainer}>
						<h2 style={{ margin: 0 }}>API Keys</h2>
						<Button type='primary' ghost onClick={() => this.removeApi()}>
							RESET KEYS
						</Button>
					</div>
					<br />
					<div>
						<p>{`API Key: `}<Icon style={{color: '#fe8c00'}} type="check"/></p>
						<p>{`API Secret: `}<Icon style={{color: '#fe8c00'}} type="check"/></p>
					</div>
				</div>
			)
		}
		else {
			return (
				<div>
					<div style={comStyles().rowContainer}>
						<h2 style={{ margin: 0, color: 'red'}}>API Keys (Required)</h2>
						<Button type='primary' ghost onClick={() => this.submitKeys()} disabled={this.checkApi()}>SUBMIT</Button>
					</div>
					<br />
					<div>
						<p>{`API Key: (${this.state.apiKey.length}/64)`}</p><Input onChange={(e) => this.setState({ apiKey: e.target.value })}></Input>
						<p>{`API Secret: (${this.state.apiSecret.length}/64)`}</p><Input onChange={(e) => this.setState({ apiSecret: e.target.value })}></Input>
					</div>
					<br/>
					<p>Your <a href='www.binance.com'>Binance API Keys</a> are required for us to run strategies on your behalf</p>

				</div>
			)
		}
	}


	renderUserApiPreview() {

		return (
      <div style={{ margin: '10px 10px 0px 10px' }}>
				{this.renderApiStatus()}
      </div>
    )
	}

	renderSettings() {
		return (
			<Card
				className='pretty_scrollbar'
				id='scroll_div'
				style={comStyles().scroll}
				bordered={false}
			>
				<QueueAnim type="bottom" component="div">
					{
						this.renderUserHeader()
					}
					<Divider>My Details</Divider>
					{
						this.renderUserProfilePreview()
					}
					<Divider>API Keys</Divider>
					{
						this.renderUserApiPreview()
					}
				</QueueAnim>
			</Card>
		)
	}

	render() {
		return (
			<div id='SettingsPage' style={comStyles().container}>
				{
					this.props.loading_complete
					?
					this.renderSettings()
					:
					<Card loading />
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
SettingsPage.propTypes = {
	history: PropTypes.object.isRequired,
	user_profile: PropTypes.object.isRequired,
	loading_complete: PropTypes.bool.isRequired,
	saveUserProfileToRedux: PropTypes.func.isRequired,
	// users: PropTypes.array.isRequired,
}

// for all optional props, define a default value
SettingsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SettingsPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		user_profile: redux.auth.user_profile,
		loading_complete: redux.app.loading_complete,
		// users: redux.auth.users,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveUserProfileToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			height: '100%',
			width: '100%',
		},
		rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
		scroll: {
			display: 'flex',
			flexDirection: 'column',
			// flexWrap: 'wrap',
			// maxHeight: '100%',
			minWidth: '100%',
			maxWidth: '100%',
			height: '100%',
			overflowY: 'scroll',
			// padding: '15px',
			justifyContent: 'flex-start',
		},
	}
}
