// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { addAlgo, getUserAlgos } from '../../api/algo/user_algos'
import { saveUserAlgos } from '../../actions/algo/algo_actions'
import {
  List, Avatar, Button, Spin, Input, Card, Divider, Icon, message
} from 'antd'

const { TextArea } = Input

class AlgoPage extends Component {

  constructor() {
    super()
    this.state = {
      algo: '',
      algoName: '',
    }
  }

  submitAlgo() {
    const algoData = { user_id: this.props.user_profile.user_id, algo_name: this.state.algoName, algo: this.state.algo}
    addAlgo(algoData)
      .then((data) => {
        console.log(data)
        if (data == true) {
          getUserAlgos(this.props.user_profile.user_id)
            .then((algos) => {
              console.log(algos)
              this.props.saveUserAlgos(algos)
            })
        }
        else {
          message.error('Algo name already exists')
        }
      })
  }

  renderAlgoInputs() {
    return (
      <div>
        <Input placeholder='Name of Algo' onChange={(e) => this.setState({ algoName: e.target.value})} />
        <TextArea placeholder='Algorithm code' onChange={(e) => this.setState({ algo: e.target.value})} rows={4} />
        <Button type='primary' onClick={() => this.submitAlgo() }>Submit Algo</Button>
      </div>
    )
  }

  renderAlgoList() {
    return (
      <div>
        <List
         className="demo-loadmore-list"
         itemLayout="horizontal"
         dataSource={this.props.user_algos}
         renderItem={item => (
           <List.Item actions={[<a>edit</a>, <a>more</a>]}>
             <List.Item.Meta
               avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
               title={<a href="https://ant.design">{item.algo_name}</a>}
               description= {item.algo}
             />
             <div>content</div>
           </List.Item>
         )}
       />
      </div>
    )
  }

  renderHeader() {
		return (
      <div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', }}>
				<Icon type="switcher" style={{ fontSize: '3REM'}} />
				<h2 style={{ fontSize: '230%', marginLeft: '2%' }}>{` My Algorithms`}</h2>
			</div>
		)
	}

  renderAlgo() {
    return (
      <Card
				className='pretty_scrollbar'
				id='scroll_div'
				style={comStyles().scroll}
				bordered={false}
			>
				<QueueAnim type="bottom" component="div">
        {
          this.renderHeader()
        }
        <Divider>Submit Algorithm</Divider>
				{
					this.renderAlgoInputs()
				}
				<Divider>Your Algorithms</Divider>
				{
					this.renderAlgoList()
				}
				</QueueAnim>
			</Card>
    )
  }

	render() {
		return (
			<div id='AlgoPage' style={comStyles().container}>
        {
          this.props.loading_complete
          ?
          this.renderAlgo()
          :
          <Card loading />
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AlgoPage.propTypes = {
	history: PropTypes.object.isRequired,
  user_profile: PropTypes.object.isRequired,
	loading_complete: PropTypes.bool.isRequired,
  saveUserAlgos: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AlgoPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AlgoPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    user_profile: redux.auth.user_profile,
		loading_complete: redux.app.loading_complete,
    user_algos: redux.algos.user_algos,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveUserAlgos,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		}
	}
}
