// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { saveUserSelected, saveUserFollows, saveUserAlgos, saveAllAlgos, } from '../../actions/algo/algo_actions'
import { changeSelectedTab } from '../../actions/app/app_actions'
import {
  List, Avatar, Button, Spin, Card, Divider, Icon, message, Popover
} from 'antd'
import {
	WhiteSpace
} from 'antd-mobile'
import { saveBot, getBot, activateBot, deactivateBot, deleteUserBot } from '../../api/bot/selected_bot'
import { getUserFollows, deleteFollows, deleteAlgo, getUserAlgos, getAllAlgos} from '../../api/algo/user_algos'
import { getUserNotifications } from '../../api/notifications/user_notifications'
import { saveNotifications } from '../../actions/notifications/notification_actions'
import Texty from 'rc-texty'
import 'rc-texty/assets/index.css'


class BotPage extends Component {

  constructor() {
    super()
    this.state = {
      activatedButton: false,
    }
  }

  selectBot(algo_id) {
    console.log(algo_id, this.props.user_profile.user_id)
    console.log('=====><><><><><><=====')
    if (this.props.user_selected.length > 0) {
      message.warning('Please remove currently selected strategy first')
    }
    else {
      saveBot({user_id: this.props.user_profile.user_id, algo_id: algo_id })
        .then((data) => {
          return getBot(this.props.user_profile.user_id)
        })
        .then((data) => {
          this.props.saveUserSelected(data)
          message.success('Selected new strategy')
        })
    }
  }


  renderButton(algo_id) {
    if (this.props.user_selected && this.props.user_selected[0]) {
      console.log(algo_id)
      console.log(this.props.user_selected[0].algo_id)
      if (this.props.user_selected[0].algo_id == algo_id) {
        return (<div style={{color: '#FF4500'}}><Icon type='star-o' /> Selected Strategy </div>)
      }
      else {
        return (<Button type='default' onClick={() => this.selectBot(algo_id)} >Select Strategy</Button>)
      }
    }
    else {
      return (<Button type='default' onClick={() => this.selectBot(algo_id)} >Select Strategy</Button>)
    }
  }

  deleteAlg(algoId, algoName) {
    deleteAlgo({algo_id: algoId, algo_name: algoName})
      .then(() => {
        const a = getUserNotifications(this.props.user_profile.user_id)
    			.then((data) => {
    				console.log(data)
    				this.props.saveNotifications(data)
    			})
        const b = getUserAlgos(this.props.user_profile.user_id)
          .then((userAlgos) => {
            this.props.saveUserAlgos(userAlgos)
          })
        const c = getBot(this.props.user_profile.user_id)
          .then((selected) => {
            console.log(selected)
            this.props.saveUserSelected(selected)
          })
        const d = getAllAlgos()
          .then((algoData) => {
            this.props.saveAllAlgos(algoData)
          })
        return Promise.all([a, b, c, d])
      })
      .then(() => {
        message.success('Successfully removed strategy')
      })
      .catch((err) => {
        message.error('There was an error')
      })
  }

  renderCreatedRemove(algoId, algoName) {
    if (this.props.user_selected.length > 0 && this.props.user_selected[0].algo_id == algoId) {
      return (
         <a style={{color: 'grey'}} onClick={() => message.warning('Please remove from selected first')}>
           remove
         </a>
      )
    }
    else {
      return (
        <Popover
           trigger="click"
           placement="left"
           content={<a>Are you sure? <br/>This will stop all bots that are currently running this strategy. <br/><Button onClick={() => this.deleteAlg(algoId, algoName)} style={{color:'red'}}>DELETE</Button></a>}
         >
           remove
         </Popover>
      )
    }
  }

  renderAlgoList() {
    if (this.props.user_algos.length > 0) {
      return (
        <div>
          <List
           className="demo-loadmore-list"
           itemLayout="horizontal"
           dataSource={this.props.user_algos}
           renderItem={item => (
             <List.Item
               actions={[
                 <a>{ this.renderCreatedRemove(item.algo_id, item.algo_name)}</a>
               ]}>
               <Popover content={<p>{this.popoverAlgo(item.algo, item.algo_type)}</p>} title={item.algo_name + ' (' + item.algo_type.type + ': ' + item.algo_type.reb_type + ')'}>
               <List.Item.Meta
                 avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
                 title={item.algo_name}
               />
               </Popover>
               <div>{this.renderButton(item.algo_id)}</div>
             </List.Item>
           )}
         />
        </div>
      )
    }
  }

  removeFollow(follow_id) {
    deleteFollows({ follow_ids: [follow_id], user_id: this.props.user_profile.user_id})
			.then((data) => {
				console.log(data)
				if (data) {
					getUserFollows(this.props.user_profile.user_id)
						.then((data) => {
							this.props.saveUserFollows(data)
              message.success('Successfully removed follow')
						})
				}
			})
  }

  popoverAlgo(algo, algoType) {
    if (algoType.type == 'Rebalance') {
      if (algoType.reb_type == 'rank') {
        let prettied = ''
        algo.forEach((ranks) => {prettied = prettied + 'RANK ' + ranks.symbol + ': ' + ranks.value + '%,   '})
        return (
          <p>{prettied}</p>
        )
      }
      else if (algoType.reb_type == 'coin') {
        let prettied = ''
        algo.forEach((coins) => {prettied = prettied + coins.symbol + ': ' + coins.value + '%,   '})
        return (
          <p>{prettied}</p>
        )
      }
    }
  }

  renderFollowRemove(algoId, followId) {
    //if (this.props.user_selected[0].algo_id == algoId)
  }

  renderFollowRemove(followId, algoId) {
    if (this.props.user_selected.length > 0 && this.props.user_selected[0].algo_id == algoId) {
      return (
        <a style={{color: 'grey'}} onClick={() => message.warning('Please remove from selected first')}>
          remove
        </a>
      )
    }
    else {
      return (
        <a onClick={() => this.removeFollow(followId)}>remove</a>
      )
    }
  }

  renderFollowList() {
    if (this.props.user_follows.length > 0) {
      return (
        <div>
          <List
           className="demo-loadmore-list"
           itemLayout="horizontal"
           dataSource={this.props.user_follows}
           renderItem={item => (
             <List.Item actions={[<a>{this.renderFollowRemove(item.follow_id, item.algo_id)}</a>]}>
              <Popover content={<p>{this.popoverAlgo(item.algo, item.algo_type)}</p>} title={item.algo_name + ' (' + item.algo_type.type + ': ' + item.algo_type.reb_type + ')'}>
               <List.Item.Meta
                 avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
                 title={
                   item.algo_name
                 }
               />
               </Popover>
               <div>{this.renderButton(item.algo_id)}</div>
             </List.Item>
           )}
         />
        </div>
      )
    }
  }

  renderHeader() {
		return (
      <div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', }}>
				<Icon type="rocket" style={{ fontSize: '3REM'}} />
				<h2 style={{ fontSize: '230%', marginLeft: '2%' }}>{` My Bot`}</h2>
			</div>
		)
	}

  activate() {
    this.setState({activatedButton: true})
    activateBot({ user_id: this.props.user_profile.user_id})
      .then((data) => {
        if (data == 'success') {
          message.success('Successfully activated')
          getBot(this.props.user_profile.user_id)
          .then((data) => {
            this.setState({activatedButton: false})
            this.props.saveUserSelected(data)
          })
        }
        else if ( data == 'Insufficent funds'){
          this.setState({activatedButton: false})
          message.error('Insufficent funds')
        }
        else if ( data == 'Api Keys DNE') {
          this.setState({activatedButton: false})
          message.error('Api Keys DNE')
        }
      })
  }

  deactivate() {
    this.setState({activatedButton: true})
    deactivateBot({ bot_id: this.props.user_selected[0].bot_id})
      .then(() => {
        getBot(this.props.user_profile.user_id)
        .then((data) => {
          message.success('Successfully deactivated')
          this.setState({activatedButton: false})
          this.props.saveUserSelected(data)
        })
      })
  }

  isActive() {
    if (this.props.user_selected[0].active == false) {
      return <Button type='primary' loading={this.state.activatedButton} style={{color: this.state.color2}} onClick={() => this.activate()}>Activate Strategy</Button>
    }
    else if (this.props.user_selected[0].algo_type.reb_type == 'rank' && this.props.user_selected[0].active == true){
      return <Button type='default' loading={this.state.activatedButton} onClick={() => this.deactivate()}>Deactivate Strategy</Button>
    }
    else if (this.props.user_selected[0].algo_type.reb_type == 'coin' && this.props.user_selected[0].active == true){
      return <Button type='primary' loading={this.state.activatedButton} disabled='true'>Portfolio Updated</Button>
    }
  }

  removeSelected() {
    if (this.props.user_selected[0].active && this.props.user_selected[0].algo_type.reb_type == 'rank') {
      message.warning('Your strategy is active, please deactivate before removing')
    }
    else {
      deleteUserBot(this.props.user_profile.user_id)
        .then((data) => {
          console.log(data)
          message.success('Successfully removed selected strategy')
          return getBot(this.props.user_profile.user_id)
        })
        .then((data) => {
          this.props.saveUserSelected(data)
        })
    }
  }

  renderSelectedBot() {
    if (this.props.user_selected.length > 0) {
      return (
        <List
         className="demo-loadmore-list"
         itemLayout="horizontal"
         dataSource={this.props.user_selected}
         renderItem={item => (
           <List.Item actions={[<a onClick={() => this.removeSelected()}>remove</a>]}>
             <Popover content={<p>{this.popoverAlgo(item.algo, item.algo_type)}</p>} title={item.algo_name + ' (' + item.algo_type.type + ': ' + item.algo_type.reb_type + ')'}>
             <List.Item.Meta
               avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
               title={item.algo_name}
             />
             </Popover>
             <div>{this.isActive()}</div>
           </List.Item>
         )}
       />
      )
    }
    else {
      return (
        <div>
          <center>
            <p>No strategy currently selected. Discover strategies or create your own. <Button onClick={() => this.props.changeSelectedTab('strategy')}>Strategy Page</Button></p>
          </center>
        </div>
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
        <Divider style={{color: '#FF4500'}}><Icon type='star-o'/> Selected Strategy</Divider>
        {
          this.renderSelectedBot()
        }
				<Divider>My Strategies</Divider>
        <p>
          <Popover
             placement="top"
             title={<a>Strategies created by you</a>}
             content={<a>Deleting your strategies will stop all active bots following it.</a>}
           >
            <b>Created</b>
          </Popover>
        </p>
				{
					this.renderAlgoList()
				}
        <p style={{marginTop: '3%'}}>
          <Popover
             placement="top"
             title={<a>Strategies you are following</a>}
             content={<a>If the owner deletes a strategy you are following, it will be removed from both your selected and followings.</a>}
           >
            <b>Following</b>
          </Popover>
        </p>
        {
          this.renderFollowList()
        }
				</QueueAnim>
			</Card>
    )
  }

	render() {
		return (
			<div id='BotPage' style={comStyles().container}>
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
BotPage.propTypes = {
	history: PropTypes.object.isRequired,
  user_profile: PropTypes.object.isRequired,
	loading_complete: PropTypes.bool.isRequired,
  saveUserSelected: PropTypes.func.isRequired,
  saveUserFollows: PropTypes.func.isRequired,
  saveNotifications: PropTypes.func.isRequired,
  saveUserAlgos: PropTypes.func.isRequired,
  changeSelectedTab: PropTypes.func.isRequired,
  saveAllAlgos: PropTypes.func.isRequired,
}

// for all optional props, define a default value
BotPage.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BotPage)

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
    saveUserSelected,
    saveUserFollows,
    saveNotifications,
    saveUserAlgos,
    changeSelectedTab,
    saveAllAlgos,
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
