import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header.js'
import Sidebar from './Sidebar.js'
import { ScatterplotLegend, Table } from 'quantifyjs'
// import { ScatterplotLegend, Table } from '/Users/nick/Projects/quantify/dist/index.js'
import * as d3 from "d3";
import styles from '../styles/Dashboard.module.css'
import tableStyles from '../styles/Table.module.css'


class Dashboard extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = {
			data: [],
			rawData: [],
			xValue: props.xValue,
			yValue: props.yValue,
			legendBy: props.legendBy,
			sidebar: props.sidebar
		};

		this.updateOptions = this.updateOptions.bind(this)
		this.onClickLegend = this.onClickLegend.bind(this)
		this.onClickChartItem = this.onClickChartItem.bind(this)
		this.onClickBackground = this.onClickBackground.bind(this)
				
		this.onLegendDropdownChange = this.onLegendDropdownChange.bind(this)
		this.onXAxisDropdownChange = this.onXAxisDropdownChange.bind(this)
		this.onYAxisDropdownChange = this.onYAxisDropdownChange.bind(this)
		this.onSidebarDropdownChange = this.onSidebarDropdownChange.bind(this)

		this.updateOptions([])
	}


	async componentDidMount() {
		console.log('componentDidMount')
		var dataUrl = this.props.dataUrl

		// Load data from local URL
		var data = await fetch(dataUrl).then(r => r.json())

		data = data.map(d => {
			d.selected = true;
			return d
		})

		var rawData = data

		var sidebar = this.state.sidebar
		
		Object.keys(sidebar).map(s => {
			if (sidebar[s] == 'all')
				return
			else
				data = data.filter(d => d[s]?.toString() == sidebar[s])
		})

		this.updateOptions(data)

		this.setState({ 
			data: data,
			rawData: rawData,
		})
	}

	componentDidUpdate() {
		this.updateOptions(this.state.data)
	}

	updateOptions(data) {
		// console.log(data)
		this.xOptions = this.props.xOptions

		this.yOptions = this.props.yOptions

		this.legendOptions = this.props.legendOptions
		
		this.tableOptions = this.props.tableOptions
	}

	onClickLegend(item) {
		console.log('legend click')
		var currentData = this.state.data
		console.log(item)
		
		var newData = currentData.map(c => {
			c.selected = c[this.state.legendBy] == item
			return c
		})

		this.setState({ 
			data: newData,
		})
	}

	onClickChartItem(item) {
		console.log('circle click')
		console.log(item)
		var currentData = this.state.data
		var currentlySelected = currentData.filter(d => d.selected == true)
		var newData
		var datum

		if (currentlySelected.length == 1 && currentlySelected[0]._id == item._id) {
			newData = currentData.map(c => {
				c.selected = true
				return c
			})
			datum = null
		}
		else {
			newData = currentData.map(c => {
				c.selected = c._id==item._id ? true : false
				return c
			})
			datum = newData.filter(c => c.selected)[0]
		}
		this.setState({ 
			data: newData,
			datum: datum
		})
	}

	onClickBackground(event) {
		console.log('background click')
		var currentData = this.state.data
		var newData = currentData.map(c => {
			c.selected = true
			return c
		})

		this.setState({ 
			data: newData,
			datum: null
		})

	}

	onLegendDropdownChange(event) {
		console.log('legend dropdown change')
		var legendItem = event.target.value
		var legendBy = legendItem

		event.preventDefault();

		this.setState({ 
			legendBy: legendBy,
		})
	}

	onXAxisDropdownChange(event) {
		console.log('x-axis dropdown change')

		event.preventDefault();
		console.log(event.target.value)
		var value = event.target.value
		this.setState({ 
			xValue: value
		})
	}

	onYAxisDropdownChange(event) {
		console.log('y-axis dropdown change')

		event.preventDefault();
		var value = event.target.value
		this.setState({ 
			yValue: value
		})
	}

	onSidebarDropdownChange(event) {
		console.log('sidebar dropdown change')

		event.preventDefault();
		console.log(event.currentTarget.id)
		var beingChanged = event.currentTarget.id
		var sidebar = this.state.sidebar

		sidebar[beingChanged] = event.target.value
		var data = this.state.rawData
		// console.log(data)
		
		// Modify data based on sidebar selection
		Object.keys(sidebar).map(s => {
			if (sidebar[s] == 'all')
				return
			else
				data = data.filter(d => d[s]?.toString() == sidebar[s])
		})

		// If we filter too far, reset and use the new filter
		if (data.length == 0) {
			Object.keys(sidebar).map(s => {
				if (s == beingChanged) {
					sidebar[s] = event.target.value
				}
				else
					sidebar[s] = 'all'
			})

			data = this.state.rawData.filter(d => d[beingChanged]?.toString() == sidebar[beingChanged])
		}
		console.log(data)

		this.updateOptions(data)

		this.setState({ 
			sidebar: sidebar,
			data: data
		})
	}

	render() {
		if (this.state.data.length == 0) return <div className={styles.container}></div>;

		return (
			<div className={styles.container}>
				<Sidebar
					sidebar={this.state.sidebar}
					rawData={this.state.rawData}
					data={this.state.data}
					onDropdownChange={this.onSidebarDropdownChange}
					xOptions={Object.keys(this.xOptions)}
					xSelected={this.state.xValue}
					yOptions={Object.keys(this.yOptions)}
					ySelected={this.state.yValue}
					legendOptions={Object.keys(this.legendOptions)}
					legendSelected={this.state.legendValue}
					onXAxisDropdownChange={this.onXAxisDropdownChange}
					onYAxisDropdownChange={this.onYAxisDropdownChange}
					onLegendDropdownChange={this.onLegendDropdownChange}
				/>
				<div className={styles.main}>
					<div className={styles.chart}>
						<ScatterplotLegend
							x={this.xOptions[this.state.xValue]}
							y={this.yOptions[this.state.yValue]}
							data={this.state.data.filter(d => !(
								d[this.state.xValue] == 'unknown' || d[this.state.yValue] == 'unknown' || d[this.state.legendBy] == 'unknown' || 
								d[this.state.xValue] == undefined || d[this.state.yValue] == undefined || d[this.state.legendBy] == undefined 
							)).filter(d => (
								this.state.sidebar['_model'] == 'all' || this.state.sidebar['_model'] == d['_model']
							))} 
							hue={this.legendOptions[this.state.legendBy]}
							size={this.legendOptions[this.state.legendBy]}// size={this.legendOptions[this.state.legendBy]}
							// onClickChartItem={this.onClickChartItem}
							// onClickBackground={this.onClickBackground}
							// colorScale={d3.interpolateRdBu}
							keyBy={d => d['_id']}
							setTooltip={d => d['title']}
							marginLeft={60}
						/>
					</div>
					<Table 
						data={this.state.data.filter(d => d.selected)}
						options={this.tableOptions}
						onClickRow={this.onClickRow}
						keyBy={'_id'}
						sortBy={this.props.sortTableBy}
						styles={tableStyles}
						rowStyle={Object.keys(this.tableOptions).map(t => (this.tableOptions[t].width ? this.tableOptions[t].width : '1fr')).join(' ') + ' !important'}
					/>
				</div>
				
			</div>
		)
	}
}

export default Dashboard