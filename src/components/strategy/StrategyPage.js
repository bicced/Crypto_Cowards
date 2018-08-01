// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { addAlgo, getUserAlgos, addFollows, getUserFollows, deleteFollows, getAllAlgos } from '../../api/algo/user_algos'
import { saveUserAlgos, saveUserFollows, saveAllAlgos } from '../../actions/algo/algo_actions'
import Trend from 'ant-design-pro/lib/Trend'
import numeral from 'numeral'
import math from 'mathjs'
import {
  List, Avatar, Button, Spin, Input, Card, Divider, Icon, message, Checkbox, Popover, Radio, Slider,
} from 'antd'
import {
	Tabs, WhiteSpace
} from 'antd-mobile'

const tabs = [
  { title: 'Public'},
  { title: 'Following'},
  { title: 'Created'},
]
const { TextArea } = Input

const binanceSymbols = ['BTC', 'ADA', 'ADX', 'AE', 'AGI', 'AION', 'AMB', 'APPC', 'ARK', 'ARN', 'AST', 'BAT',
                  'BCC', 'BCD', 'BCN', 'BCPT', 'BLZ', 'BNB', 'BNT', 'BQX', 'BRD', 'BTG', 'BTS', 'CDT',
                  'CHAT', 'CLOAK', 'CMT', 'CND', 'CVC', 'DASH', 'DATA', 'DENT', 'ARDR', 'DGD', 'DLT', 'DNT', 'EDO', 'ELF',
                  'ENG', 'ENJ', 'EOS', 'ETC', 'ETH', 'EVX', 'FUEL', 'FUN', 'GAS', 'GNT', 'GRS', 'GTO', 'GVT', 'GXS', 'HSR', 'ICN', 'ICX', 'INS',
                  'IOST', 'IOTA', 'IOTX', 'KEY', 'KMD', 'KNC', 'LEND', 'LINK', 'LOOM', 'LRC', 'LSK', 'LTC', 'LUN', 'MANA', 'MCO', 'MDA', 'MFT',
                  'MOD', 'MTH', 'MTL', 'NANO', 'NAS', 'NAV', 'NCASH', 'NEBL', 'NEO', 'NPXS', 'NULS', 'NXS', 'OAX', 'OMG', 'ONT', 'OST', 'PIVX',
                  'POA', 'POE', 'POWR', 'PPT', 'QKC', 'QLC', 'QSP', 'QTUM', 'RCN', 'REP', 'REQ', 'RLC', 'RPX', 'SALT', 'SC', 'SKY', 'SNGLS', 'SNM',
                  'SNT', 'STEEM', 'STORJ', 'STORM', 'STRAT', 'SUB', 'SYS', 'THETA', 'TNB', 'TNT', 'TRIG', 'TRX', 'TUSD', 'VEN', 'VIA', 'VIB', 'VIBE',
                  'WABI', 'WAN', 'WAVES', 'WINGS', 'WPR', 'WTC', 'XEM', 'XLM', 'XMR', 'XRP', 'XVG', 'XZC', 'YOYO', 'ZEC', 'ZEN', 'ZIL', 'ZRX']

const binanceRanks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38',
                          '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50']

const ranked = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11],
                [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23],
                  [24, 24], [25, 25], [26, 26], [27, 27], [28, 28], [29, 29], [30, 30], [31, 31], [32, 32], [33, 33], [34, 34], [35, 35],
                    [36, 36], [37, 37], [38, 38], [39, 39], [40, 40], [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46], [47, 47],
                      [48, 48], [49, 49], [50, 50]]

class StrategyPage extends Component {

  constructor() {
    super()
    this.state = {
			followList: [],
			unfollowList: [],
			currentTab: 'Public',
      algoName: '',
      type: '',
      slide: [1, 3],
      rebType: '',
      days: 0,
      arrayCoin: [],
      arrayRank: [],
      public: false,
    }
  }

  componentWillMount() {
    this.setState({
      arrayCoin: binanceSymbols.map((coin) => { return {symbol: coin, value: 0}}),
      arrayRank: binanceRanks.map((coin) => { return {symbol: coin, value: 0}})
    })
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
		deleteFollows({ follow_ids: this.state.unfollowList, user_id: this.props.user_profile.user_id})
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
          <div>
            {
              this.renderAlgoList(this.props.user_algos)
            }
					</div>
				</Tabs>
			</div>
    )
  }

	checkTheBox(algoStatus) {
		if (this.state.currentTab == 'Public') {
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
		else if (this.state.currentTab == 'Following') {
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
								<th>Creator</th>
								<th>Hour</th>
								<th>Day</th>
								<th>Week</th>
							</tr>
						</table>
					}
	        dataSource={typeList}
	        renderItem={item => (
	          <List.Item>
							<List.Item.Meta
								description={
									<table style={comStyles().table}>
                    <Popover content={<p>{this.popoverAlgo(item.algo, item.algo_type)}</p>} title={item.algo_name + ' (' + item.algo_type.type + ': ' + item.algo_type.reb_type + ')'}>
										<tr>
											<th width="8%">
                        <Avatar src="https://image.ibb.co/fVto1o/784915.jpg" /> &nbsp;
                        {
                          this.renderCheckbox(item)
                        }
                      </th>
											<th>{item.algo_name}</th>
											<th>{item.user_id.slice(-6)}</th>
											<th>{this.calculatePercent(item.algo, item.algo_type, 2)}</th>
											<th>{this.calculatePercent(item.algo, item.algo_type, 3)}</th>
											<th>{this.calculatePercent(item.algo, item.algo_type, 4)}</th>
										</tr>
                    </Popover>
									</table>
								}
							/>
	          </List.Item>
	        )}
	      />
			</div>
		)
	}

  calculatePercent(algo, algo_type, index) {
    console.log(algo)
    if (algo_type.type == 'Rebalance') {
      if (algo_type.reb_type == 'rank') {
        let thingy = {}
        const symbols = algo.map(coin => coin.symbol)
        algo.forEach(coin => thingy[coin.symbol] = coin.value)
        console.log(symbols)
        console.log(thingy)
        const used = this.props.top_ranks.filter(coin => symbols.includes(coin[0]))
        console.log(used)
        const percents = math.round(used.map(coin => (coin[index]) * thingy[coin[0]]).reduce((a,b) => a + b) /100, 2)
        console.log(percents)
        if (percents >= 0) {
          return (
            <Trend flag='up' reverseColor={true}>
              {percents}%
            </Trend>
          )
        } else {
          return (
            <Trend flag='down' reverseColor={true}>
              {percents}%
            </Trend>
          )
        }
      }
      else if (algo_type.reb_type == 'coin') {
        let thingy = {}
        const symbols = algo.map(coin => coin.symbol)
        algo.forEach(coin => thingy[coin.symbol] = coin.value)
        const used = this.props.top_ranks.filter(coin => symbols.includes(coin[1]))
        const percents = used.map(coin => (coin[index] * 1000) * thingy[coin[1]]).reduce((a,b) => a + b)/100000
        console.log(symbols)
        console.log(used)
        if (percents >= 0) {
          return (
            <Trend flag='up' reverseColor={true}>
              {percents}%
            </Trend>
          )
        } else {
          return (
            <Trend flag='down' reverseColor={true}>
              {percents}%
            </Trend>
          )
        }
      }
    }

  }

  renderHeader() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', }}>
				<Icon type="switcher" style={{ fontSize: '3REM'}} />
				<h2 style={{ fontSize: '230%', marginLeft: '2%'}}>All Strategies</h2>
			</div>
		)
	}

  renderAlgoInputs() {
    return (
      <div>
        <Radio.Group type='primary' value={this.state.selection} onChange={e => this.setState({ type: e.target.value})}>
          <Popover content={<p>Select a range from top 1-50 Binance coins by Marketcap. <br/> Rebalance portfolio and choose time interval between subsequent rebalances</p>} title="Rebalancing">
  				    <Radio.Button value='Rebalance'>Rebalance</Radio.Button>
          </Popover>
          <Popover content={<p>Create your own algorithms to trade with</p>} title="Custom Algorithms">
  				    <Radio.Button disabled value='Custom'>Custom</Radio.Button>
          </Popover>
  			</Radio.Group>
        <WhiteSpace />
        {
          this.renderInputType()
        }
      </div>
    )
  }

  renderInputType() {
    if (this.state.type == 'Rebalance') {
      return (
        <div>
          <Input placeholder='Name of Algo' onChange={(e) => this.setState({ algoName: e.target.value})} />
          <WhiteSpace/>
          <Popover content={<p>Checked: Strategy is public for other users to follow <br/> Unchecked: Strategy is private</p>} title="Public Strategy">
            <Checkbox onChange={(e) => this.setState({public: e.target.checked})}>Make strategy public</Checkbox>
          </Popover>
          <WhiteSpace/>
          {
            this.renderRankingType()
          }
          <WhiteSpace/>
          {
            this.renderCoinOrRank()
          }
        </div>
      )
    }
    else if (this.state.type == 'Custom'){
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
    else {
      return (null)
    }
  }

  renderRankingType() {
    return (
      <div>
        <Radio.Group type='primary' value={this.state.selection} onChange={e => this.setState({ rebType: e.target.value})}>
          <Popover content={<p>Rebalance into selected ranks</p>} title="By Rank">
  				    <Radio.Button value='rank'>By Rank</Radio.Button>
          </Popover>
          <Popover content={<p>Rebalance into selected coins</p>} title="By Coin">
  				    <Radio.Button value='coin'>By Coin</Radio.Button>
          </Popover>
  			</Radio.Group>
      </div>
    )
  }

  renderCoinOrRank() {
    if (this.state.rebType == 'coin') {
      return (
        <div>
          <Slider range step={1} max={50} min={1} defaultValue={this.state.slide} onChange={(e) => this.setState({ slide: e})} onAfterChange={(e) => this.setState({ slide: e}, console.log(this.state.slide))} />
          <WhiteSpace/>
          {
            this.outOfHundred()
          }
          <WhiteSpace/>
          {
            this.renderCoins()
          }
          <WhiteSpace/>
          <Button type='primary' onClick={() => this.onSubmit()}>Submit Algo</Button>
        </div>
      )
    }
    else if (this.state.rebType == 'rank'){
      return (
        <div>
          <Input placeholder='Days between rebalancing (0-365)' onChange={(e) => this.setState({days: parseInt(e.target.value)})} />
          <WhiteSpace/>
          <Slider range step={1} max={50} min={1} defaultValue={this.state.slide} onChange={(e) => this.setState({ slide: e})} onAfterChange={(e) => this.setState({ slide: e}, console.log(this.state.slide))} />
          <WhiteSpace/>
          {
            this.outOfHundred()
          }
          <WhiteSpace/>
          {
            this.renderRanks()
          }
          <WhiteSpace/>
          <Button type='primary' onClick={() => this.onSubmit()}>Submit Algo</Button>
        </div>
      )
    }
    else {
      return (
        null
      )
    }
  }

  outOfHundred() {
    if (this.state.rebType == 'coin') {
      const selectedCoins =this.state.arrayCoin.filter((obj) => this.props.top_ranks.slice(this.state.slide[0] - 1, this.state.slide[1]).map((coin) => {return coin[1]}).includes(obj.symbol))
      console.log(selectedCoins)
      let total = 0
      selectedCoins.forEach((pair) => total += pair.value)
      return (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row', fontSize: '150%'}}>
          <div>Allocations: {total}/100%</div>
          <div>Rankings by Marketcap: {this.state.slide[0]}-{this.state.slide[1]}</div>
        </div>
      )
    }
    else if (this.state.rebType == 'rank') {

      const selectedCoins = this.state.arrayRank.filter((obj) => ranked.slice(this.state.slide[0] - 1, this.state.slide[1]).map((coin) => {return coin[1]}).includes(obj.symbol))
      console.log(selectedCoins)
      let total = 0
      selectedCoins.forEach((pair) => total += pair.value)
      return (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row', fontSize: '150%'}}>
          <div>Allocations: {total}/100%</div>
          <div>Rankings by Marketcap: {this.state.slide[0]}-{this.state.slide[1]}</div>
        </div>
      )
    }
  }

  renderCoins() {
    const handleChange = (val, coin) => {
      const filtered = this.state.arrayCoin.filter((obj) => obj.symbol !== coin )
      console.log(filtered)
      console.log(val)
      if (!val) {
        console.log('caught')
        val = 0
      }
      this.setState({
        arrayCoin: filtered.concat({ symbol: coin, value: parseInt(val)})
      })
    }
    let topCoins = this.props.top_ranks.slice(this.state.slide[0] - 1, this.state.slide[1])

    return (
      <List
      grid={{ gutter: 16, xs: 2, sm: 2, md: 6, lg: 6, xl: 8, xxl: 8 }}
      dataSource={topCoins}
      renderItem={item => (
        <List.Item>
          <Card title={item[1]}><Input value={this.findValues(item[1])} onChange={(e) => handleChange(e.target.value, item[1])} placeholder='0'></Input></Card>
        </List.Item>
      )}
      />
    )
  }

  renderRanks() {
    const handleChange = (val, coin) => {
      const filtered = this.state.arrayRank.filter((obj) => obj.symbol !== coin)
      console.log(filtered)
      console.log(val)
      if (!val) {
        console.log('caught')
        val = 0
      }
      this.setState({
        arrayRank: filtered.concat({ symbol: coin, value: parseInt(val)})
      })
    }

    let topRanks = ranked.slice(this.state.slide[0] - 1, this.state.slide[1])

    return (
      <List
      grid={{ gutter: 16, xs: 2, sm: 2, md: 6, lg: 6, xl: 8, xxl: 8 }}
      dataSource={topRanks}
      renderItem={item => (
        <List.Item>
          <Card title={'RANK ' + item[0]}><Input value={this.findValues(item[0])} onChange={(e) => handleChange(e.target.value, item[0])} placeholder='0'></Input></Card>
        </List.Item>
      )}
      />
    )
  }

  findValues(coin) {

    if (this.state.rebType == 'coin') {
      console.log('hitfind')
      const selectedCoins =this.state.arrayCoin.filter((obj) => this.props.top_ranks.slice(this.state.slide[0] - 1, this.state.slide[1]).map((coin) => {return coin[1]}).includes(obj.symbol))
      console.log(coin)
      const newShit = selectedCoins.filter((stuff) => stuff.symbol == coin && stuff.value !== 0)
      console.log(newShit)
      if (newShit.length > 0) {
        return newShit[0].value
      }
      else {
        return null
      }
    }
    else if (this.state.rebType == 'rank') {
      console.log('hitfind')
      const selectedCoins =this.state.arrayRank.filter((obj) => ranked.slice(this.state.slide[0] - 1, this.state.slide[1]).map((coin) => {return coin[1]}).includes(obj.symbol))
      console.log(coin)
      const newShit = selectedCoins.filter((stuff) => stuff.symbol == coin && stuff.value !== 0)
      console.log(newShit)
      if (newShit.length > 0) {
        return newShit[0].value
      }
      else {
        return null
      }
    }
  }

  submitAlgo() { //custom
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

  onSubmit() {
    if (this.state.rebType == 'coin') {
      const selectedCoins =this.state.arrayCoin.filter((obj) => this.props.top_ranks.slice(this.state.slide[0] - 1, this.state.slide[1]).map((coin) => {return coin[1]}).includes(obj.symbol))
      console.log(selectedCoins)
      let total = 0
      selectedCoins.forEach((pair) => total += pair.value)
      if (this.state.algoName == '') {
        message.warning('Name is required')
      }
      else if (!(this.state.days > 0) && !(this.state.days <= 365)){
        message.warning('Days between rebalancing is required! (0-365)')
      }
      else if (total !== 100) {
        message.warning('Total % must add up to 100')
      }
      else {
        console.log(selectedCoins.map((item) => [item.symbol, item.value]))
        console.log(this.state.algoName)
        console.log(this.state.days)
        console.log(this.props.user_profile.user_id)
        const algoType = { type: this.state.type, reb_type: this.state.rebType}
        const algoData = {
          public: this.state.public,
          user_id: this.props.user_profile.user_id,
          algo_name: this.state.algoName,
          algo_type: algoType,
          algo: selectedCoins.map((item) =>  {return { symbol: item.symbol, value: item.value}}).filter((algo) => algo.value !== 0)
        }
        addAlgo(algoData)
          .then((data) => {
            console.log(data)
            if (data == true) {
              getUserAlgos(this.props.user_profile.user_id)
                .then((algos) => {
                  console.log(algos)
                  this.props.saveUserAlgos(algos)
                })
              getAllAlgos()
                .then((algoData) => {
                  this.props.saveAllAlgos(algoData)
                })
            }
            else {
              message.error('Algo name already exists')
            }
          })
      }
    }
    else if (this.state.rebType == 'rank') {

      const selectedCoins = this.state.arrayRank.filter((obj) => ranked.slice(this.state.slide[0] - 1, this.state.slide[1]).map((coin) => {return coin[1]}).includes(obj.symbol))
      console.log(selectedCoins)
      let total = 0
      selectedCoins.forEach((pair) => total += pair.value)
      if (this.state.algoName == '') {
        message.warning('Name is required')
      }
      else if (!(this.state.days > 0) && !(this.state.days <= 365)){
        message.warning('Days between rebalancing is required! (0-365)')
      }
      else if (total !== 100) {
        message.warning('Total % must add up to 100')
      }
      else {
        console.log(selectedCoins.map((item) => [item.symbol, item.value]))
        console.log(selectedCoins)
        console.log(this.state.algoName)
        console.log(this.state.days)
        console.log(this.props.user_profile.user_id)
        const algoType = { type: this.state.type, reb_type: this.state.rebType, reb_day: this.state.days}
        const algoData = {
          public: this.state.public,
          user_id: this.props.user_profile.user_id,
          algo_name: this.state.algoName,
          algo_type: algoType,
          algo: selectedCoins.map((item) =>  {return { symbol: item.symbol, value: item.value}}).filter((algo) => algo.value !== 0)
        }
        console.log(algoData)
        addAlgo(algoData)
          .then((data) => {
            console.log(data)
            if (data == true) {
              getUserAlgos(this.props.user_profile.user_id)
                .then((algos) => {
                  console.log(algos)
                  this.props.saveUserAlgos(algos)
                })
              getAllAlgos()
                .then((algoData) => {
                  this.props.saveAllAlgos(algoData)
                })
            }
            else {
              message.error('Algo name already exists')
            }
          })
      }
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
        <Divider>Create New Strategy</Divider>
				{
					this.renderAlgoInputs()
				}
        <Divider>Discover Strategies</Divider>
				{
					this.renderAlgoTabs()
				}
				</QueueAnim>
			</Card>
    )
  }

	render() {
		return (
			<div id='StrategyPage' style={comStyles().container}>
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
StrategyPage.propTypes = {
	history: PropTypes.object.isRequired,
  user_profile: PropTypes.object.isRequired,
	loading_complete: PropTypes.bool.isRequired,
  saveUserAlgos: PropTypes.func.isRequired,
	saveUserFollows: PropTypes.func.isRequired,
  saveAllAlgos: PropTypes.func.isRequired,
}

// for all optional props, define a default value
StrategyPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(StrategyPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    user_profile: redux.auth.user_profile,
		loading_complete: redux.app.loading_complete,
    user_algos: redux.algos.user_algos,
		all_algos: redux.algos.all_algos,
		user_follows: redux.algos.user_follows,
    top_ranks: redux.cmc.top_ranks,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveUserAlgos,
		saveUserFollows,
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
