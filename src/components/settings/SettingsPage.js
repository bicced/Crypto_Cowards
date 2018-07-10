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
import { getUserProfile } from '../../api/auth/auth_api'
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
			role: null,

			selection: '',
		}
	}

	componentWillMount(){
		// this.setState({ user_profile: this.props.user_profile}, () => console.log(this.state.user_profile))
		if (this.props.user_profile.coward_id) {
			this.setState({
				selection: 'a',
			})
		} else if (this.props.user_profile.pro_id) {
			this.setState({
				selection: 'b',
			})
		}
	}

	componentDidMount() {
		if (this.props.user_profile.coward_id) {
			this.setState({role: true})
		}
		else if (this.props.user_profile.pro_id) {
			this.setState({role: false})
		}
	}

	checkApi() {
		console.log('Checking api')
		if (this.state.apiKey.length == 64 && this.state.apiSecret.length == 64) {
			return false
		} else {
			return true
		}
	}

	//
	submitKeys() {
		saveBinance({API_KEY: this.state.apiKey, API_SECRET: this.state.apiSecret, user_id: this.props.user_profile.user_id})
			.then((data) => {
				message.success('Successfully updated API keys')

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
          <Button type='primary' ghost onClick={() => this.props.history.push(`/app/settings/${this.props.user_profile.user_id}/user/edit`)}>
            EDIT
          </Button>
        </div>
        <br />
        <div>
          <p>{`Email: ${this.props.user_profile.email}`}</p>
					<p>{`Account Type: ${this.props.user_profile.phone}`}</p>
        </div>
      </div>
    )
	}

	renderApiStatus() {    //change to api status
		if (this.props.user_profile.email && this.props.user_profile.phone) {
			return (
				<div>
					<div style={comStyles().rowContainer}>
						<h2 style={{ margin: 0 }}>API Keys</h2>
						<Button type='primary' ghost onClick={() => this.props.history.push(`/app/settings/${this.props.user_profile.user_id}/user/edit`)}>
							EDIT
						</Button>
					</div>
					<br />
					<div>
						<p>{`API Key: ${this.props.user_profile.email}`}</p>
						<p>{`API Secret: ${this.props.user_profile.phone}`}</p>
					</div>
				</div>
			)
		}
		else {
			return (
				<div>
					<div style={comStyles().rowContainer}>
						<h2 style={{ margin: 0, color: 'red'}}>API Keys (Required)</h2>
						<Button type='primary' ghost onClick={() => this.submitKeys()} disabled={this.checkApi()}>Submit</Button>
					</div>
					<br />
					<div>
						<p>{`API Key: (${this.state.apiKey.length}/64)`}</p><Input onChange={(e) => this.setState({ apiKey: e.target.value })}></Input>
						<p>{`API Secret: (${this.state.apiSecret.length}/64)`}</p><Input onChange={(e) => this.setState({ apiSecret: e.target.value })}></Input>
					</div>
				</div>
			)
		}
	}

	addCowardButton(){
		addCoward(this.props.user_profile.user_id)
			.then((role) => {
				console.log(role)
				let new_profile = this.props.user_profile
				new_profile.coward_id = role
				console.log(new_profile)
				this.props.saveUserProfileToRedux(new_profile)
				return Promise.resolve('Got to the next step!')
			})
			.then((msg) => {
				console.log(msg)
			})
			.catch((err) => {
				 console.log(err)
			})
	}

	addProButton(){
		addPro(this.props.user_profile.user_id)
	}

	renderAccountRole() {
		// if (this.state.user_profile.coward_id) {
		// 	return (
		// 		<div>
		// 			<div style={comStyles().rowContainer}>
		// 				<h2 style={{ margin: 0,}}>Account Type</h2>
		// 				<Button type='primary' ghost >
		// 					EDIT
		// 				</Button>
		// 			</div>
		// 			<br />
		// 			<div>
		// 				<Button type='primary' disabled='true' onClick={() => this.addCowardButton()}>Coward</Button>
		// 				<Button onClick={() => this.addProButton()}>Pro</Button>
		// 			</div>
		// 		</div>
		// 	)
		// }
		// else if (this.state.user_profile.pro_id) {
		// 	return (
		// 		<div>
		// 			<div style={comStyles().rowContainer}>
		// 				<h2 style={{ margin: 0, }}>Account Type</h2>
		// 				<Button type='primary' ghost>
		// 					EDIT
		// 				</Button>
		// 			</div>
		// 			<br />
		// 			<div>
		// 				<Button onClick={() => this.addCowardButton()}>Coward</Button>
		// 				<Button type='primary' disabled='true' onClick={() => this.addProButton()}>Pro</Button>
		// 			</div>
		// 		</div>
		// 	)
		// }
		// else {
		// 	return (
		// 		<div>
		// 			<div style={comStyles().rowContainer}>
		// 				<h2 style={{ margin: 0, color: 'red'}}>Account Type (Required)</h2>
		// 			</div>
		// 			<br />
		// 			<div>
		// 				<Button onClick={() => this.addCowardButton()}>Coward</Button>
		// 				<Button onClick={() => this.addProButton()}>Pro</Button>
		// 			</div>
		// 		</div>
		// 	)
		// }
		const makeSelection = (selection) => {
			this.setState({
				selection,
			})
			if (selection === 'a') {
				this.addCowardButton()
			} else if (selection === 'b') {
				this.addProButton()
			}
		}
		return (
			<Radio.Group value={this.state.selection} onChange={e => makeSelection(e.target.value)}>
				<Radio.Button value='a'>Cowards</Radio.Button>
				<Radio.Button value='b'>Pro</Radio.Button>
			</Radio.Group>
		)
	}

	renderUserApiPreview() {

		return (
      <div style={{ margin: '10px 10px 0px 10px' }}>
				{this.renderApiStatus()}
      </div>
    )
	}


	// renderUsersPreview() {
	// 	return (
	// 		<div style={{ margin: '10px 10px 0px 10px' }}>
  //       <div style={comStyles().rowContainer}>
  //         <h2 style={{ margin: 0 }}>{`${this.props.users.length} User`}</h2>
  //       </div>
  //       <br />
  //       <div>
  //         <List
	// 					itemLayout='horizontal'
	// 					dataSource={this.props.users}
	// 					renderItem={item => {
	// 						return (
	// 							<List.Item>
	// 								<List.Item.Meta
	// 									avatar={<Avatar style={{ backgroundColor: '#2faded', verticalAlign: 'middle' }}>{item.first_name[0]}</Avatar>}
	// 									title={`${item.first_name} ${item.last_name}`}
	// 									description={
	// 										<div>
	// 											<p>{`Email: ${item.email}`}</p>
	// 											<p>{`Phone: ${item.phone}`}</p>
	// 										</div>
	// 									}
	// 								/>
	// 							</List.Item>
	// 						)
	// 					}}
	// 				/>
  //       </div>
  //     </div>
	// 	)
	// }

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
					<Divider>Account Role</Divider>
					{
						this.renderAccountRole()
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
