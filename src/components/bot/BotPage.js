// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { addAlgo, getUserAlgos, getAllAlgos } from '../../api/algo/user_algos'
import { saveUserAlgos, saveUserSelected, saveAllAlgos } from '../../actions/algo/algo_actions'
import { checkRebalancing } from '../../api/test/test'
import {
  List, Avatar, Button, Spin, Input, Card, Divider, Icon, message, Radio, Slider, Popover
} from 'antd'
import {
	WhiteSpace
} from 'antd-mobile'
import { saveBot, getBot, activateBot, deactivateBot } from '../../api/bot/selected_bot'
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

class BotPage extends Component {

  constructor() {
    super()
    this.state = {
      algo: '',
      algoName: '',
      type: '',
      slide: [1, 3],
      list: [],
      arrayCoin: [],
      arrayRank: [],
      days: 0,
      total: 0,
      rebType: '',
      activatedButton: false,
    }
  }

  componentWillMount() {
    this.setState({
      arrayCoin: binanceSymbols.map((coin) => { return {symbol: coin, value: 0}}),
      arrayRank: binanceRanks.map((coin) => { return {symbol: coin, value: 0}})
    })

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

  renderInputType() {
    if (this.state.type == 'Rebalance') {
      return (
        <div>
          <Input placeholder='Name of Algo' onChange={(e) => this.setState({ algoName: e.target.value})} />
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

  renderAlgoInputs() {
    return (
      <div>
        <Radio.Group type='primary' value={this.state.selection} onChange={e => this.setState({ type: e.target.value})}>
          <Popover content={<p>Select a range from top 1-50 Binance coins by Marketcap. <br/> Rebalance portfolio and choose time interval between next and subsequent rebalances</p>} title="Rebalancing">
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
      const ranked = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11],
                      [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23],
                        [24, 24], [25, 25], [26, 26], [27, 27], [28, 28], [29, 29], [30, 30], [31, 31], [32, 32], [33, 33], [34, 34], [35, 35],
                          [36, 36], [37, 37], [38, 38], [39, 39], [40, 40], [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46], [47, 47],
                            [48, 48], [49, 49], [50, 50]]
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
          user_id: this.props.user_profile.user_id,
          algo_name: this.state.algoName,
          algo_type: algoType,
          algo: selectedCoins.map((item) =>  {return { symbol: item.symbol, value: item.value}})
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
      const ranked = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11],
                      [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23],
                        [24, 24], [25, 25], [26, 26], [27, 27], [28, 28], [29, 29], [30, 30], [31, 31], [32, 32], [33, 33], [34, 34], [35, 35],
                          [36, 36], [37, 37], [38, 38], [39, 39], [40, 40], [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46], [47, 47],
                            [48, 48], [49, 49], [50, 50]]

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
          user_id: this.props.user_profile.user_id,
          algo_name: this.state.algoName,
          algo_type: algoType,
          algo: selectedCoins.map((item) =>  {return { symbol: item.symbol, value: item.value}})
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


    // const selectedCoins = this.props.top_ranks.slice(this.state.slide[0] - 1, this.state.slide[1])
    // console.log(this.state.arrayCoin.filter((obj) => selectedCoins.map((coin) => {return coin[1]}).includes(obj.symbol)))

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

  findValues(coin) {
    const ranked = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11],
                    [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23],
                      [24, 24], [25, 25], [26, 26], [27, 27], [28, 28], [29, 29], [30, 30], [31, 31], [32, 32], [33, 33], [34, 34], [35, 35],
                        [36, 36], [37, 37], [38, 38], [39, 39], [40, 40], [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46], [47, 47],
                          [48, 48], [49, 49], [50, 50]]
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
    const ranked = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11],
                    [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23],
                      [24, 24], [25, 25], [26, 26], [27, 27], [28, 28], [29, 29], [30, 30], [31, 31], [32, 32], [33, 33], [34, 34], [35, 35],
                        [36, 36], [37, 37], [38, 38], [39, 39], [40, 40], [41, 41], [42, 42], [43, 43], [44, 44], [45, 45], [46, 46], [47, 47],
                          [48, 48], [49, 49], [50, 50]]

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


  renderButton(algo_id) {
    if (this.props.user_selected) {
      if (this.props.user_selected.algo_id == algo_id) {
        return (<div style={{color: '#FF4500'}}><Icon type='star-o' /> Selected Bot</div>)
      }
      else {
        return (<Button type='default' onClick={() => this.selectBot(algo_id)} >Select Strategy</Button>)
      }
    }
    else {
      return (<Button type='default' onClick={() => this.selectBot(algo_id)} >Select Strategy</Button>)
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
             <List.Item actions={[<a>edit</a>]}>
               <List.Item.Meta
                 avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
                 title={
                   <Popover content={<p>{JSON.stringify(item.algo)}</p>} title={item.algo_name}>
                     <a>
                      {item.algo_name}
                     </a>
                   </Popover>
                 }
               />
               <div>{this.renderButton(item.algo_id)}</div>
             </List.Item>
           )}
         />
        </div>
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
             <List.Item actions={[<a>edit</a>]}>
               <List.Item.Meta
                 avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
                 title={
                   <Popover content={<p>{JSON.stringify(item.algo)}</p>} title={item.algo_name}>
                     <a>
                      {item.algo_name}
                     </a>
                   </Popover>
                 }
               />
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
      return <Button type='primary' loading={this.state.activatedButton} onClick={() => this.activate()}>Activate Strategy</Button>
    }
    else if (this.props.user_selected[0].active == true){
      return <Button type='primary' loading={this.state.activatedButton} onClick={() => this.deactivate()}>Deactivate Strategy</Button>
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
           <List.Item actions={[<a>edit</a>]}>
             <List.Item.Meta
               avatar={<Avatar src="https://image.ibb.co/fVto1o/784915.jpg" />}
               title={
                 <Popover content={<p>{JSON.stringify(item.algo)}</p>} title={item.algo_name}>
                   <a style={{color: 'orange'}}>
                    {item.algo_name}
                   </a>
                 </Popover>
               }
             />
             <div>{this.isActive()}</div>
           </List.Item>
         )}
       />
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
        <Divider>Create Strategy</Divider>
				{
					this.renderAlgoInputs()
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
        <Divider style={{color: '#FF4500'}}><Icon type='star-o'/> Selected Bot</Divider>
        {
          this.renderSelectedBot()
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
  saveUserAlgos: PropTypes.func.isRequired,
  saveUserSelected: PropTypes.func.isRequired,
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
    top_ranks: redux.cmc.top_ranks,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveUserAlgos,
    saveUserSelected,
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
