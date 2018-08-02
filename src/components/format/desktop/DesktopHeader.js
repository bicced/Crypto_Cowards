// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Button
} from 'antd-mobile'
import DesktopDropdown from './DesktopDropdown'
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon'
import { getUserNotifications, markUserNotifications } from '../../../api/notifications/user_notifications'
import { saveNotifications } from '../../../actions/notifications/notification_actions'


class DesktopHeader extends Component {

	getNotifications() {
		console.log('get test function')
		getUserNotifications(this.props.user_profile.user_id)
			.then((data) => {
				console.log(data)
				this.props.saveNotifications(data)
			})
	}

	notificationCount() {
		return (this.props.notifications.filter((noti) => noti.read == false).length)
	}

	clearNotifications() {
		console.log('clear it')
		markUserNotifications(this.props.user_profile.user_id)
			.then(() => {
				return getUserNotifications(this.props.user_profile.user_id)
			})
			.then((data) => {
				console.log(data)
				this.props.saveNotifications(data)
			})
	}

	render() {
		return (
			<div id='DesktopHeader' style={comStyles().container}>
				<div style={comStyles().font_logo} onClick={() => this.props.history.push('/app/ads')}>CryptoCowards</div>
				<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: '2%'}}>
					<NoticeIcon
						count={this.notificationCount()}
						onClear={() => this.clearNotifications()}
						locale={{emptyText: 'Empty', clear: 'Clear '}}
					>
						<NoticeIcon.Tab
							list={this.props.notifications}
							title="Notifications"
							emptyText="Empty"
							emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
						/>
					</NoticeIcon>
					<div style={{marginLeft: '40%'}}>
						<DesktopDropdown />
					</div>
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
DesktopHeader.propTypes = {
	history: PropTypes.object.isRequired,
	user_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
DesktopHeader.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(DesktopHeader)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		user_profile: redux.auth.user_profile,
		notifications: redux.notifications.user_notifications,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveNotifications,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '7vh',
      maxHeight: '7vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      // background: 'rgba(81, 151, 214, 1)',
      padding: '15px',
			//backgroundColor: '#ffeecc',
			borderStyle: 'solid',
			borderColor: '#fe8c00',
			background: '#ffffff',  /* fallback for old browsers */
			background: '-webkit-linear-gradient(to right, #ffffff, #fe8c00)',  /* Chrome 10-25, Safari 5.1-6 */
			background: 'linear-gradient(to right, #ffffff, #fe8c00)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    font_logo: {
      fontSize: '2.0rem',
      color: '#fe8c00',
      fontWeight: 'bold',
      fontFamily: `'Reem Kufi', sans-serif`,
			cursor: 'pointer',
    },
	}
}
