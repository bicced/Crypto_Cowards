// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { saveUserSelected, saveUserFollows} from '../../actions/algo/algo_actions'
import { checkRebalancing } from '../../api/test/test'
import {
  List, Avatar, Button, Spin, Card, Divider, Icon, message, Popover
} from 'antd'
import {
	WhiteSpace
} from 'antd-mobile'
import { saveBot, getBot, activateBot, deactivateBot, deleteUserBot } from '../../api/bot/selected_bot'
import { getUserFollows, deleteFollows, deleteAlgo} from '../../api/algo/user_algos'
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
    saveBot({user_id: this.props.user_profile.user_id, algo_id: algo_id })
      .then((data) => {
        return getBot(this.props.user_profile.user_id)
      })
      .then((data) => {
        this.props.saveUserSelected(data)
      })
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

  deleteAlg(algo_id) {
    console.log(algo_id)
    deleteAlgo(algo_id)
      .then((data) => {
        console.log(data)
      })
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
                 <a>
                   <Popover
                    trigger="click"
                    placement="left"
                    content={<a onClick={this.hide}>Are you sure? <br/>This will stop all bots that are currently running this strategy. <br/><Button onClick={() => this.deleteAlg(item.algo_id)} style={{color:'red'}}>DELETE</Button></a>}
                  >
                    remove
                  </Popover>

                 </a>
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

  renderFollowList() {
    if (this.props.user_follows.length > 0) {
      return (
        <div>
          <List
           className="demo-loadmore-list"
           itemLayout="horizontal"
           dataSource={this.props.user_follows}
           renderItem={item => (
             <List.Item actions={[<a onClick={() => this.removeFollow(item.follow_id)}>remove</a>]}>
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
    else if (this.props.user_selected[0].active == true){
      return <Button type='primary' loading={this.state.activatedButton} onClick={() => this.deactivate()}>Deactivate Strategy</Button>
    }
  }

  removeSelected() {
    if (this.props.user_selected[0].active) {
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
            <p>No strategy currently selected. Discover strategies or create your own. <Button>Strategy Page</Button></p>
          </center>
        </div>
      )
    }

  }

  runtest() {
    checkRebalancing()
  }

  renderAlgo() {
    return (
      <Card
				className='pretty_scrollbar'
				id='scroll_div'
				style={comStyles().scroll}
				bordered={false}
			>
        <Button onClick={() => this.runtest()}>test</Button>
				<QueueAnim type="bottom" component="div">
        {
          this.renderHeader()
        }
        <Divider style={{color: '#FF4500'}}><Icon type='star-o'/> Selected Strategy</Divider>
        {
          this.renderSelectedBot()
        }
				<Divider>My Strategies</Divider>
        <p><b>Created</b></p>
				{
					this.renderAlgoList()
				}
        <p style={{marginTop: '3%'}}><b>Following</b></p>
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
    saveUserFollows
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
