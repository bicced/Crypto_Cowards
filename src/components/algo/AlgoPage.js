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
import { saveUserAlgos, saveUserSelected } from '../../actions/algo/algo_actions'
import {
  List, Avatar, Button, Spin, Input, Card, Divider, Icon, message
} from 'antd'
import {
	WhiteSpace
} from 'antd-mobile'
import { saveBot, getBot, activateBot } from '../../api/bot/selected_bot'
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
        <WhiteSpace/>
        <TextArea placeholder='Algorithm code' onChange={(e) => this.setState({ algo: e.target.value})} rows={4} />
        <WhiteSpace/>
        <Button type='primary' onClick={() => this.submitAlgo() }>Submit Algo</Button>
      </div>
    )
  }

  selectBot(algo_id) {
    console.log(algo_id, this.props.user_profile.user_id)
    console.log('=====><><><><><><=====')
    saveBot({user_id: this.props.user_profile.user_id, algo_id: algo_id })
      .then((data) => {
        return getBot(data)
      })
      .then((data) => {
        this.props.saveUserSelected(data)
      })
  }

  renderButton(algo_id) {
    if (this.props.user_selected) {
      if (this.props.user_selected.algo_id == algo_id) {
        return (<div style={{color: 'orange'}}><Icon type='star-o' /> Selected Bot</div>)
      }
      else {
        return (<Button type='default' onClick={() => this.selectBot(algo_id)} >Select Bot</Button>)
      }
    }
    else {
      return (<Button type='default' onClick={() => this.selectBot(algo_id)} >Select Bot</Button>)
    }
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
               title={<a>{item.algo_name}</a>}
               description= {item.algo}
             />
             <div>{this.renderButton(item.algo_id)}</div>
           </List.Item>
         )}
       />
      </div>
    )
  }

  renderFollowList() {
    return (
      <div>
        <List
         className="demo-loadmore-list"
         itemLayout="horizontal"
         dataSource={this.props.user_follows}
         renderItem={item => (
           <List.Item actions={[<a>edit</a>, <a>more</a>]}>
             <List.Item.Meta
               avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
               title={<a>{item.algo_name}</a>}
               description= {item.algo}
             />
             <div>{this.renderButton(item.algo_id)}</div>
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

  activate() {
    // activateBot(this.props.user_selected)
    //   .then((data) => {
    //     console.log(data)
    //   })
  }

  renderSelectedBot() {
    if (this.props.user_selected) {
      return (
        <List
         className="demo-loadmore-list"
         itemLayout="horizontal"
         dataSource={[this.props.user_selected]}
         renderItem={item => (
           <List.Item actions={[<a>edit</a>, <a>more</a>]}>
             <List.Item.Meta
               avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
               title={<a>{item.algo_name}</a>}
               description= {item.algo}
             />
             <div><Button type='primary' onClick={() => this.activate()}>Activate Bot</Button></div>
           </List.Item>
         )}
       />
      )
    }
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
				<Divider>My Algorithms</Divider>
        <p><b>Created</b></p>
				{
					this.renderAlgoList()
				}
        <p style={{marginTop: '3%'}}><b>Following</b></p>
        {
          this.renderFollowList()
        }
        <Divider>Selected Bot</Divider>
        {
          this.renderSelectedBot()
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
  saveUserSelected: PropTypes.func.isRequired,
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
    user_selected: redux.algos.user_selected,
    user_follows: redux.algos.user_follows,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveUserAlgos,
    saveUserSelected,
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
