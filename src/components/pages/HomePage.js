// Compt for copying as a HomePage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Button,
	Icon,
} from 'antd'
import { GOOGLE_CLIENT_AUTH_CREDS } from '../../../credentials/development/ENV_CREDS'
import { registerGoogleLoginWithCognito } from '../../api/aws/aws-cognito'
import { getUserProfile } from '../../api/auth/auth_api'
import { authenticateUser, saveUserProfileToRedux } from '../../actions/auth/auth_actions'
import SubtitlesMachine from '../modules/SubtitlesMachine'

class HomePage extends Component {

	constructor() {
    super()
    this.state = {
    }
  }

  componentWillMount() {
  }

  openUrl(url) {
    // const win = window.open(url, '_blank')
    // win.focus()
    window.open(url)
  }

	loginWithGoogle() {
    const self = this
    let profile = {}
    window.gapi.load('client:auth2', function() {
      console.log('LOADED')
      gapi.client.init(GOOGLE_CLIENT_AUTH_CREDS)
      .then(() => {
        console.log('PASSED INIT')
        gapi.auth2.getAuthInstance()
        .signIn({
          client_id: GOOGLE_CLIENT_AUTH_CREDS.clientId
        })
        .then((GoogleUser) => {
          console.log(GoogleUser)
          // GoogleUser.grantOfflineAccess()
          profile = {
            google_id: GoogleUser.getBasicProfile().getId(),
            name: GoogleUser.getBasicProfile().getName(),
            first_name: GoogleUser.getBasicProfile().getGivenName(),
            last_name: GoogleUser.getBasicProfile().getFamilyName(),
            pic: GoogleUser.getBasicProfile().getImageUrl(),
            email: GoogleUser.getBasicProfile().getEmail()
          }
          console.log(profile)
          const auth = GoogleUser.getAuthResponse(true)
          console.log(auth)
          return registerGoogleLoginWithCognito(auth.id_token)
          // return registerGoogleLoginWithCognito(auth.access_token)
        })
        .then(({ IdentityId }) => {
          console.log('LOGGED INTO GMAIL', IdentityId)
          return getUserProfile(IdentityId, profile)
        })
        .then((data) => {
          console.log(data)
          self.props.authenticateUser('something')
          self.props.saveUserProfileToRedux(data.profile)
          if (data.new_entry) {
            self.props.history.push('/onboarding/checkuser') //onboarding/checkuser
          } else {
            // self.props.history.push('/onboarding/checkuser')
            self.props.history.push('/app/home')
            setTimeout(() => {
              window.location.reload()
            }, 500)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      })
    })
  }

	// <SubtitlesMachine
	// 	speed={0.5}
	// 	text= 'Your AI cryptocurrency trading bot'
	// 	textStyles={{
	// 		fontSize: '1rem',
	// 		color: 'white',
	// 		textAlign: 'center',
	// 		fontStyle: 'italic',
	// 	}}
	// />

	render() {
		return (
			<div id='HomePage' style={comStyles().container}>
				<div style={comStyles().font_logo}>CryptoCowards</div>
				<div style={comStyles().tagline}>

				</div>
				<Button onClick={() => this.loginWithGoogle()} type='ghost' style={{ width: '250px', color: '#fe8c00', border: '1px solid #fe8c00' }}>
					Login with Gmail <Icon type='right' />
				</Button>
				<div style={{ width: '100%', height: '10px' }}></div>
				{
					// <Button onClick={() => this.props.history.push('/signup/beta/landlords')} type='ghost' style={{ width: '250px', color: '#fe8c00', border: '1px solid #fe8c00' }}>
					// 	Beta Signup <Icon type='right' />
					// </Button>
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
HomePage.propTypes = {
	history: PropTypes.object.isRequired,
	authenticateUser: PropTypes.func.isRequired,
	saveUserProfileToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
HomePage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HomePage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		authenticateUser,
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
      height: '100vh',
      width: '100vw',
      justifyContent: 'center',
      alignItems: 'center',
			backgroundColor: 'white',
			// background: '#fe8c00',  /* fallback for old browsers */
			// background: '-webkit-linear-gradient(to right, #f83600, #fe8c00)',  /* Chrome 10-25, Safari 5.1-6 */
			// background: 'linear-gradient(to right, #f83600, #fe8c00)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
		},
    font_logo: {
      fontSize: '3.5rem',
      color: '#fe8c00',
      // fontWeight: 'bold',
      fontFamily: `'Reem Kufi', sans-serif`,
      margin: '0px 0px 20px 0px'
    },
    tagline: {
      fontSize: '1rem',
      color: '#fe8c00',
      margin: '0px 0px 30px 0px',
      width: '50%',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    demo: {
      fontSize: '1rem',
      color: 'white',
      bottom: '20px',
      position: 'absolute',
      cursor: 'pointer',
    }
	}
}
