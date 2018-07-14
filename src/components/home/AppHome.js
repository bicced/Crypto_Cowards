// Compt for copying as a template
// This compt is used for...

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
import 'antd/dist/antd.css'
import 'ant-design-pro/dist/ant-design-pro.css'
import CountDown from 'ant-design-pro/lib/CountDown'
import {
	Card, Row, Col, Icon, Tooltip, Divider, Menu, Dropdown, Button
} from 'antd'
 //
//import Binance from 'node-binance-api'

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M





const chartData = []
for (let i = 0; i < 20; i += 1) {
  chartData.push({
    x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    y1: Math.floor(Math.random() * 100) + 1000,
    y2: Math.floor(Math.random() * 100) + 10,
  })
}


const salesPieData = [
  {
    x: 'A',
    y: 4544,
  },
  {
    x: 'B',
    y: 3321,
  },
  {
    x: 'C',
    y: 3113,
  },
  {
    x: 'D',
    y: 2341,
  },
  {
    x: 'E',
    y: 1231,
  },
  {
    x: 'F',
    y: 1231,
  },
]

const targetTime = new Date().getTime() + 39000000



class AppHome extends Component {

	constructor() {
		super()
		this.state = {
			visitData: [],
			ticker: 'BTCUSDT',
			timeframe: '1d',
		}
	}

	componentWillMount() {
		this.grabGraphs()

	}

	renderCardRow() {
		return (
			<div style={comStyles().topCards}>
				<ChartCard style={{width: '50%'}} title="Next Rebalancing">
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
						<CountDown style={{ fontSize: 30, marginTop: '10%' }} target={targetTime} />
						<WaterWave
							height={200}
							title="Time used"
							percent={30}
							color='#FFA500'
						/>
					</div>
				</ChartCard>

				<ChartCard
					title="Performance"
					style={{width: '50%'}}
				>
					<Pie
						hasLegend
						title="销售额"
						subTitle="Allocations"
						total={() => (
							<span
								dangerouslySetInnerHTML={{
									__html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))
								}}
							/>
						)}
						data={salesPieData}
						valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
						height={200}
					/>
				</ChartCard>
				<Button onClick={() => this.testButton()}>Test button</Button>
			</div>
		)
	}

	testButton() {
		getBalance(this.props.user_profile.user_id)
			.then((data) => {
				console.log(data)
			})
	}

	grabGraphs() {
		getCandlesticks({ticker: this.state.ticker, timeframe: this.state.timeframe})
			.then((data) => {
				let newVisitData = []
				for (let i = 0; i < data.price.length; i += 1) {
					newVisitData.push({x: data.time[i], y: Math.round(data.price[i])})
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
		    <Menu.Item>
		      <a onClick={() => this.changeGraphState(0,'BTCUSDT')}>BTC/USDT</a>
		    </Menu.Item>
		    <Menu.Item>
		      <a onClick={() => this.changeGraphState(0,'EOSBTC')}>EOS/BTC</a>
		    </Menu.Item>
				<Menu.Item>
		      <a value='asd' onClick={(e) => console.log(e)}>TEST</a>
		    </Menu.Item>
		  </Menu>
		)

		const timeframe = (
		  <Menu >
		    <Menu.Item>
		      <a onClick={() => this.changeGraphState(1,'12h')}>'12h'</a>
		    </Menu.Item>
		    <Menu.Item>
		      <a onClick={() => this.changeGraphState(1,'1d')}>'1d'</a>
		    </Menu.Item>
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
						total={numeral(12321).format('0,0')}
						status="up"
						subTotal={17.1}
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
				<Icon type="home" style={{ fontSize: '3REM'}} />
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
			justifyContent: 'space-between',
			marginTop: '2%'
		}
	}
}
