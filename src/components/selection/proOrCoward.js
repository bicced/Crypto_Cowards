// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'antd-mobile'


class Template extends Component {

	render() {
		return (
			<div id='Template' style={comStyles().container}>
				Template
			</div>
		)
	}
}

// defines the types of variables in this.props
Template.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
Template.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Template)

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
			fontFamily: 'Helvetica Neue',
      minHeight: '100vh',
      maxHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#fe8c00',  /* fallback for old browsers */
      background: '-webkit-linear-gradient(to right, #f83600, #fe8c00)',  /* Chrome 10-25, Safari 5.1-6 */
      background: 'linear-gradient(to right, #f83600, #fe8c00)', 
		},
	}
}
