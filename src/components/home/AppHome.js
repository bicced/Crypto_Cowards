// Compt for copying as a template
// This compt is used for...
import humanizeDuration from 'humanize-duration'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { MiniArea, WaterWave, TimelineChart, Pie, yuan, ChartCard, Field, MiniBar, MiniProgress} from 'ant-design-pro/lib/Charts'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import Trend from 'ant-design-pro/lib/Trend'
import NumberInfo from 'ant-design-pro/lib/NumberInfo'
import numeral from 'numeral'
import Binance from 'node-binance-api'
import { getCandlesticks, getBalance } from '../../api/binance/save_binance'
import { getRebalanceTime } from '../../api/bot/selected_bot'
import 'antd/dist/antd.css'
import 'ant-design-pro/dist/ant-design-pro.css'
import CountDown from 'ant-design-pro/lib/CountDown'
import { changeSelectedTab } from '../../actions/app/app_actions'
import math from 'mathjs'
import {
	Card, Row, Col, Icon, Tooltip, Divider, Menu, Dropdown, Button
} from 'antd'

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'Days',
      h: () => 'Hours',
      m: () => 'Mins',
      s: () => 's',
      ms: () => 'ms',
    }
  }
})


class AppHome extends Component {

	constructor() {
		super()
		this.state = {
			visitData: [],
			ticker: 'BTCUSDT',
			targetTime: null,
			targetPercent: 100,
			timeframe: '1d',
			salesPieData: [ { x: 'BTC', y: 500 }, { x: 'ETH', y: 400 }, { x: 'BNB', y: 300, }, { x: 'EOS', y: 300 }, { x: 'LTC', y: 200 }, { x: 'XRP', y: 100, }]
		}
	}

	componentWillMount() {
		this.grabGraphs()
		getRebalanceTime(this.props.user_profile.user_id)
			.then((data) => {
				console.log(data)
				this.setState({targetTime: moment().add(data.dateis, 'minutes'), targetPercent: data.percent})
			})
		if (this.props.user_profile.api_exists) {
			getBalance(this.props.user_profile.user_id)
				.then((data) => {
					console.log(data)
					const mapBalance = data.map((coin) => {return { x: coin[0], y: coin[1]}}).sort((a,b) => {return b.y - a.y})
					this.setState({
						salesPieData: mapBalance
					})
				})
		}

	}

	renderCardRow() {
		return (
			<div style={screen.width >= 550 ? comStyles().topCards : comStyles().topCardz}>
				<ChartCard style={{width: '100%'}} title="Next Rebalancing">
					<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
						{
							this.state.targetTime
							?
							<CountDown
								style={{ fontSize: '150%', marginTop: '10%' }}
								format={(time) =>  shortEnglishHumanizer(time, { units: ['d', 'h', 'm'], round: true})}
								target={this.state.targetTime}
							/>
							:
							<a style={{ fontSize: '150%', marginTop: '10%' }} onClick={() => this.props.changeSelectedTab('bot')}>No active strategies</a>
						}
						<WaterWave
							height={220}
							title="Time left"
							percent={this.state.targetPercent}
							color='#FFA500'
						/>
					</div>
				</ChartCard>

				<ChartCard
					style={{width: '100%'}}
					title="Portfolio"
				>
					<div>
						<Pie
							hasLegend
							title="Allocations"
							subTitle="Allocations"
							total={() => (
								<div>
									{'$' + math.round(this.state.salesPieData.reduce((pre, now) => now.y + pre, 0), 2)}
								</div>
							)}
							data={this.state.salesPieData}
							valueFormat={val => <div>{'$' + math.round( val ,2)}</div> }
							height={240}
						/>
					</div>
				</ChartCard>
			</div>
		)
	}

	linkApiButton() {
		console.log('clicked')
		this.props.changeSelectedTab('settings')
	}

	grabGraphs() {
		getCandlesticks({ticker: this.state.ticker, timeframe: this.state.timeframe})
			.then((data) => {
				let newVisitData = []
				for (let i = 0; i < data.price.length; i += 1) {
					newVisitData.push({x: data.time[i], y: parseFloat(data.price[i])})
				}
				return newVisitData
			})
			.then((data) => {
				console.log(data)
				this.setState({
					visitData: data
				})
			})
	}

	changeGraphState(type, value) {
		console.log(type, value)
		if (type == 0){
			this.setState({
				ticker: value
			}, () => {
				this.grabGraphs()
			})
		}
		else {
			this.setState({
				timeframe: value
			}, () => {
				this.grabGraphs()
			})
		}
	}

	renderCardBelow() {

		const ticker = (
			<Menu>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'BTCUSDT')}>BTC/USDT</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'EOSBTC')}>EOS/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'ETHBTC')}>ETH/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'TRXBTC')}>TRX/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'ETCBTC')}>ETC/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'VENBTC')}>VEN/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'ADABTC')}>ADA/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'ICXBTC')}>ICX/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'XRPBTC')}>XRP/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'XLMBTC')}>XLM/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'ZRXBTC')}>ZRX/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'LTCBTC')}>LTC/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'ARNBTC')}>ARN/BTC</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(0,'NEOBTC')}>NEO/BTC</a></Menu.Item>
			</Menu>
		)
		const timeframe = (
			<Menu >
				<Menu.Item><a onClick={() => this.changeGraphState(1,'1m')}>1m</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'3m')}>3m</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'5m')}>5m</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'15m')}>15m</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'30m')}>30m</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'1h')}>1h</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'2h')}>2h</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'4h')}>4h</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'6h')}>6h</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'8h')}>8h</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'12h')}>12h</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'1d')}>1d</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'3d')}>3d</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'1w')}>1w</a></Menu.Item>
				<Menu.Item><a onClick={() => this.changeGraphState(1,'1M')}>1M</a></Menu.Item>
			</Menu>
		)

		return (
			<div style={{marginTop: '1%'}}>
				<ChartCard title="Price history">
					<NumberInfo
						title={
							<div style={{marginTop: '2%'}}>
								<Dropdown overlay={ticker} >
									<Button type='default'>{this.state.ticker}</Button>
								</Dropdown>
								<Dropdown overlay={timeframe} >
									<Button type='default'>{this.state.timeframe}</Button>
								</Dropdown>
							</div>
						}
					/>
					<MiniArea
						 line
						 color="#FFA500"
						 borderColor="#FF4500"
						 height={200}
						 data={this.state.visitData}
					/>
				</ChartCard>
			</div>
		)
	}


	renderUserHeader() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', minWidth: '100%', }}>
				<Icon type="dashboard" style={{ fontSize: '3REM'}} />
				<h2 style={{ fontSize: '230%', marginLeft: '2%' }}>{` Dashboard`}</h2>
			</div>
		)
	}

	renderPage() {
		return (
			<Card
				className='pretty_scrollbar'
				id='scroll_div'
				style={comStyles().scroll}
				bordered={false}
			>
				<QueueAnim type="bottom" component="div">
					{
						this.renderUserHeader()
					}
					{
						this.props.user_profile.api_exists
						?
						null
						:
						<Button type='primary' onClick={() => this.linkApiButton()}>Activate Account</Button>
					}
					{
						this.renderCardRow()
					}
					{
						this.renderCardBelow()
					}

				</QueueAnim>

			</Card>
		)
	}

	render() {
		return (
			<div id='AppHome' style={comStyles().container}>
				{
					this.props.loading_complete
					?
					this.renderPage()
					:
					<Card loading />
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
AppHome.propTypes = {
	history: PropTypes.object.isRequired,
	user_profile: PropTypes.object.isRequired,
	loading_complete: PropTypes.bool.isRequired,
	changeSelectedTab: PropTypes.func.isRequired,
}

// for all optional props, define a default value
AppHome.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AppHome)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		user_profile: redux.auth.user_profile,
		loading_complete: redux.app.loading_complete,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		changeSelectedTab,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			width: '100%',
			height: '100%',
		},
		topCards: {
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			marginTop: '2%'
		},
		topCardz: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			marginTop: '2%'
		},
	}
}
