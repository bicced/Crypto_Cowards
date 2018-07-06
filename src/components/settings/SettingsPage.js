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
import {
	Card,
	Avatar,
	Icon,
	Divider,
	Button,
	List,
} from 'antd'


class SettingsPage extends Component {

	constructor() {
		super()
		this.state = {
			//
		}
	}

	renderUserHeader() {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100%', }}>
				<Icon type="setting" style={{ fontSize: '5REM'}} />
				<div>
					<h2>{`Settings`}</h2>
				</div>
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
					<p>{`Phone: ${this.props.user_profile.phone}`}</p>
        </div>
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
	corporation_profile: PropTypes.object.isRequired,
	loading_complete: PropTypes.bool.isRequired,
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
