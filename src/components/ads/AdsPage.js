// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { addAlgo, getUserAlgos, addFollows, getUserFollows, deleteFollows } from '../../api/algo/user_algos'
import { saveUserAlgos, saveUserFollows } from '../../actions/algo/algo_actions'
import {
  List, Avatar, Button, Spin, Input, Card, Divider, Icon, message, Checkbox, Popover
} from 'antd'
import {
	Tabs, WhiteSpace
} from 'antd-mobile'

const tabs = [
  { title: 'Follow'},
  { title: 'Following'},
]

class AdsPage extends Component {

  constructor() {
    super()
    this.state = {
			followList: [],
			unfollowList: [],
			currentTab: 'Follow',
    }
  }

	followSelected() {
		console.log('add followers')
		addFollows({ user_id: this.props.user_profile.user_id, algo_ids: this.state.followList})
			.then((data) => {
				console.log(data)
				if (data) {
					getUserFollows(this.props.user_profile.user_id)
						.then((data) => {
							this.props.saveUserFollows(data)
						})
				}
			})
		this.setState({
			followList: []
		})
	}

	unfollowSelected() {
		console.log('remove followers')
		deleteFollows({ follow_ids: this.state.unfollowList})
			.then((data) => {
				console.log(data)
				if (data) {
					getUserFollows(this.props.user_profile.user_id)
						.then((data) => {
							this.props.saveUserFollows(data)
						})
				}
			})
		this.setState({
			unfollowList: []
		})
	}

	filterAlgoList() {
    console.log(this.props.user_algos)
    console.log(this.props.user_follows)
		let allAlgos = this.props.all_algos.map(algo => algo.algo_id)
		let userFollows = this.props.user_follows.map(algo => algo.algo_id)

		return (
			allAlgos.map((id, index) => {
				if (userFollows.indexOf(id) < 0) {
        	return this.props.all_algos[index]
        }
  		})
			.concat(userFollows.map((id, index) => {
        if (allAlgos.indexOf(id) < 0) {
        	return this.props.user_follows[index]
        }
  		}))
			.filter(item => item != undefined)
		)

	}

  renderAlgoTabs() {

    return (
			<div style={{backgroundColor: 'white'}}>
				<Tabs tabs={tabs}
					initialPage={0}
					onTabClick={(e) => this.setState({ currentTab: e.title })}
					renderTab={tab => <span>{tab.title}</span>}
          tabBarUnderlineStyle={{borderColor: '#fe8c00', borderBottomColor: '#fe8c00'}}
          tabBarActiveTextColor='#fe8c00'
				>
					<div>
						{
							this.renderAlgoList(this.filterAlgoList())
						}
						<Button type='primary' onClick={() => this.followSelected()} >Follow Selected</Button>
					</div>
					<div>
						{
							this.renderAlgoList(this.props.user_follows)
						}
						<Button type='primary' onClick={() => this.unfollowSelected()} >Unfollow Selected</Button>
					</div>
				</Tabs>
			</div>
    )
  }

	checkTheBox(algoStatus) {
		if (this.state.currentTab == 'Follow') {
			if(algoStatus.checked == true){
				let followUpdate = this.state.followList
				followUpdate.push(algoStatus.value.algo_id)
				this.setState({
					followList: followUpdate
				})
			}
			else {
				let followUpdate = this.state.followList
				followUpdate.splice(followUpdate.indexOf(algoStatus.value.algo_id), 1)
				this.setState({
					followList: followUpdate
				})
			}
		}
		else {
			if(algoStatus.checked == true){
				let unfollowUpdate = this.state.unfollowList
				unfollowUpdate.push(algoStatus.value.follow_id)
				this.setState({
					unfollowList: unfollowUpdate
				})
			}
			else {
				let unfollowUpdate = this.state.followList
				unfollowUpdate.splice(unfollowUpdate.indexOf(algoStatus.value.follow_id), 1)
				this.setState({
					unfollowList: unfollowUpdate
				})
			}
		}
	}

  renderCheckbox(item){
    if (this.props.user_profile.user_id) {
      if (item.user_id == this.props.user_profile.user_id) {
        return (<Icon type="user" style={{color: 'orange'}}/>)
      }
      else {
        return (<Checkbox value={item} onChange={(e)=> this.checkTheBox(e.target)}></Checkbox>)
      }
    }
    else {
      return (<Checkbox value={item} onChange={(e)=> this.checkTheBox(e.target)}></Checkbox>)
    }
  }

	renderAlgoList(typeList) {
		return (
			<div style={comStyles().algoList}>
      {  // <List>
        //   <QueueAnim>
        //     {
        //       this.state.dataSouce((item) => {
        //         return (
        //           <List.Item>
        //
        //           </List.Item>
        //         )
        //       })
        //     }
        //   </QueueAnim>
        // </List>
        //
      }
        <List
	        className="demo-loadmore-list"
	        itemLayout="horizontal"
					header={
						<table style={comStyles().table}>
							<tr>
								<th width="8%"></th>
								<th>Name</th>
								<th>Owner</th>
								<th>% Day</th>
								<th>% Week</th>
								<th>% Month</th>
							</tr>
						</table>
					}
	        dataSource={typeList}
	        renderItem={item => (
	          <List.Item>
							<List.Item.Meta
								description={
									<table style={comStyles().table}>
										<tr>
											<th width="8%">
                        <Avatar src="https://image.ibb.co/fVto1o/784915.jpg" /> &nbsp;
                        {
                          this.renderCheckbox(item)
                        }
                      </th>
											<th>
                        {
                          <Popover content={<p>{JSON.stringify(item.algo)}</p>} title={item.algo_name}>
                             {item.algo_name}
                          </Popover>
                        }
                      </th>
											<th>{item.user_id}</th>
											<th>asdasd</th>
											<th>asdasd</th>
											<th>asdasd</th>
										</tr>
									</table>
								}
							/>
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
				<h2 style={{ fontSize: '230%', marginLeft: '2%'}}>All Algorithms</h2>
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
				{
					this.renderAlgoTabs()
				}
				</QueueAnim>
			</Card>
    )
  }

	render() {
		return (
			<div id='AdsPage' style={comStyles().container}>
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
AdsPage.propTypes = {
	history: PropTypes.object.isRequired,
  user_profile: PropTypes.object.isRequired,
	loading_complete: PropTypes.bool.isRequired,
  saveUserAlgos: PropTypes.func.isRequired,
	saveUserFollows: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AdsPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AdsPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    user_profile: redux.auth.user_profile,
		loading_complete: redux.app.loading_complete,
    user_algos: redux.algos.user_algos,
		all_algos: redux.algos.all_algos,
		user_follows: redux.algos.user_follows,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveUserAlgos,
		saveUserFollows,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
		table: {
			tableLayout: 'fixed',
			width: '100%',
			wordWrap: 'break-word',
			textAlign: 'center',
		},
		algoList: {
			marginTop: '3%',
		},
	}
}
