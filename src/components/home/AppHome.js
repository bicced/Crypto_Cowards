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
import 'antd/dist/antd.css'
import 'ant-design-pro/dist/ant-design-pro.css'
import CountDown from 'ant-design-pro/lib/CountDown'
import {
	Card, Row, Col, Icon, Tooltip, Divider
} from 'antd'

const visitData = []
const beginDay = new Date().getTime()
for (let i = 0; i < 50; i += 1) {
	visitData.push({
		x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
		y: Math.floor(Math.random() * 100) + 10,
	})
}

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
			</div>
		)
	}

	renderCardBelow() {
		return (
			<div style={{marginTop: '3%'}}>
				<ChartCard title="Price history">
					<NumberInfo
						total={numeral(12321).format('0,0')}
						status="up"
						subTotal={17.1}
					/>
					<MiniArea
						 line
						 color="#FFA500"
						 borderColor="#FF4500"
						 height={200}
						 data={visitData}
					/>
				</ChartCard>
			</div>
		)
	}

	renderRest() {
		return (
			<div>

				<TimelineChart
					height={200}
					data={chartData}
					titleMap={{ y1: '客流量', y2: '支付笔数' }}
				/>
				<ChartCard
	        title="Time until next rebalance"
	        action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
	        total="78%"
					style={{width: '50%'}}
	        footer={
	          <div>
	            <span>
	              Upward Trend Flag
	              <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>12%</Trend>
	            </span>
	            <span style={{ marginLeft: 16 }}>
	              Downward Trend Flag
	              <Trend flag="down" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>11%</Trend>
	            </span>
	          </div>
	        }
	        contentHeight={46}
	      >
	        <MiniProgress percent={78} strokeWidth={8} target={80} />
	      </ChartCard>
				<MiniArea
					 line
					 color="#cceafe"
					 height={45}
					 data={visitData}
				/>
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
