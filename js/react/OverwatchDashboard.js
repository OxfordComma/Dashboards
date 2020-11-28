import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
import Scatterplot from './Scatterplot'
import Legend from './Legend'


import GraphSidebar from './GraphSidebar'
import DropdownForm from './DropdownForm'
import * as d3 from "d3";


class OverwatchDashboard extends React.Component {
	constructor(props) {
		super(props);

		this.graphRef = React.createRef()
		this.legendRef = React.createRef()

		this.legendOptions = ['hero_name', 'map_name', 'map_type', 'match_id', 'player_name', 'stat_name', 'team_name']
		this.xOptions = [
		// 'match_id', 'stat_amount']
			{ 
				label: 'match_id', 
				accessor: d=>d['match_id'] 
			},{
				label: 'match_number',
				accessor: d=>d['match_number']
			}]
		// this.yOptions = [{ 
		// 		label: 'Damage Done', 
		// 		accessor: d=>d['Damage Done'] 
		// 	}]
		// this.yOptions = Object.keys()

		// this.derivedParams = [{
		// 	name: 'match_number',
		// 	accessor: d=>1
		// }]

		this.state = {
			data: [],
			rawData: [],
			
			// xAccessor: d => d.match_id,
			// yAccessor: d => d.stat_amount,
			xValue: 'match_number',
			yValue: 'Damage Done',
			legendBy: 'player',
			colorScale: d3.scaleOrdinal(d3.schemeCategory10),
			sidebar: {
				hero_name: 'All Heroes',
				map_name: 'all',
				map_type: 'all',
				team_name: 'Los Angeles Valiant',
				// stat_name: 'All Damage Done'
			}
		}

		this.onClickLegend = this.onClickLegend.bind(this)
		this.onClickChartItem = this.onClickChartItem.bind(this)
		this.onClickBackground = this.onClickBackground.bind(this)
		
		this.onLegendDropdownChange = this.onLegendDropdownChange.bind(this)
		this.onXAxisDropdownChange = this.onXAxisDropdownChange.bind(this)
		this.onYAxisDropdownChange = this.onYAxisDropdownChange.bind(this)
		this.onSidebarDropdownChange = this.onSidebarDropdownChange.bind(this)
	}

	unique(data, accessor) {
		if (typeof accessor == 'string')
			return [...new Set(data.map(d => d[accessor]))].sort()
		else
			return [...new Set(data.map(accessor))].sort()
	}

	async componentDidMount() {
		var team = encodeURIComponent(this.state.sidebar.team_name)
		var dataUrl = "http://localhost:3000/data/overwatch?team="+team
		var data = await d3.json(dataUrl)
		var matchDateTimes = this.unique(data, 'start_time')
			// .map(d => new Date(d))
			.sort()
		console.log(matchDateTimes)

		// Derived parameters
	
		var data = data.map(d => {
			d.selected = true
			d['match_number'] = matchDateTimes.indexOf(d.start_time)
			return d
		})
		console.log(data)


		var rawData = data
	
		var sidebar = this.state.sidebar
		Object.keys(sidebar).map(s => {
		// 	console.log(s)
			if (sidebar[s] == 'all')
				return
			else
				data = data.filter(d => d[s].toString() == sidebar[s])
		})

		// data = d3.nest()
		// 	.key(d => d[this.state.legendBy])
		// 	// .key(d => d.player)
		// 	.rollup(d => {
		// 		return d.reduce((acc, curr) => {
		// 			return acc += parseInt(curr.stat_amount)
		// 		}, 0)
		// 	})
		// 	.entries(data)

		console.log(data)

		this.setState({ 
			data: data,
			rawData: rawData,
		})
	}



	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))].sort()
	}

	getLegendItems (data) {
			return this.getUniqueItems(data, d => d[this.state.legendBy]).sort()
	}

	onClickLegend(item) {
		console.log('legend click')
		var currentData = this.state.data
		
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

		this.setState({ 
			// xAccessor: d => d[event.target.value]
			xValue: event.target.value
		})
	}

	onYAxisDropdownChange(event) {
		console.log('y-axis dropdown change')

		event.preventDefault();

		this.setState({ 
			// yAccessor: d => d[event.target.value]
			yValue: event.target.value
		})
	}

	async onSidebarDropdownChange(event) {
		console.log('sidebar dropdown change')

		event.preventDefault();
		var beingChanged = event.currentTarget.id
		var sidebar = this.state.sidebar

		sidebar[beingChanged] = event.target.value
		var data
		if (beingChanged == 'team_name') {
			var team = encodeURIComponent(event.target.value)
			var dataUrl = "http://localhost:3000/data/overwatch?team="+team
			var rawData = await d3.json(dataUrl)
			this.setState({
				rawData: rawData
			})
			data = rawData
		}
		else
		{
			data = this.state.rawData
		}
		
		Object.keys(sidebar).map(s => {
			if (sidebar[s] == 'all')
				return
			else
				data = data.filter(d => {
					// console.log(d[s].toString())
					// console.log(sidebar[s])
					return d[s].toString() == sidebar[s]
				})
		})
		console.log(sidebar)
		console.log(data)

		this.setState({ 
			sidebar: sidebar,
			data: data
		})
	}
	


	render() {
		console.log(this.graphRef.current?.offsetHeight)
		return (
			<div className='container'>
				<div className='header'>
					<DropdownForm
						title='X axis:'
						onChange={this.onXAxisDropdownChange}
						onSubmit={this.onXAxisDropdownSubmit}
						options={this.xOptions.map(d => d.label)}
						default={this.state.xValue}
					/>
					<DropdownForm
						title='Y axis:'
						onChange={this.onYAxisDropdownChange}
						onSubmit={this.onYAxisDropdownSubmit}
						options={this.yOptions.map(d => d.label)}
						default={this.state.yValue}
					/>
					<DropdownForm
						title='Legend:'
						onChange={this.onLegendDropdownChange}
						onSubmit={this.onLegendDropdownSubmit}
						options={this.legendOptions}
						default={this.state.legendBy}
					/>
				</div>
				<div className='sidebar'>
					<GraphSidebar
						sidebar={this.state.sidebar}
						data={this.state.rawData}
						onDropdownChange={this.onSidebarDropdownChange}
					/>
				</div>
				<div className='chart' ref={this.graphRef}>
					<Scatterplot
						width={this.graphRef.current?.offsetWidth}
						height={this.graphRef.current?.offsetHeight}
						xValue={this.xOptions.filter(d => d.label==this.state.xValue)[0]}
						yValue={this.yOptions.filter(d => d.label==this.state.yValue)[0]}
						data={this.state.data}
						legendBy={this.state.legendBy}
						colorScale={this.state.colorScale}
						onClickChartItem={this.onClickChartItem}
						onClickBackground={this.onClickBackground}
					/>
				</div>
				<div className='legend'>
					<Legend
						// chartWidth={this.graphRef.current?.offsetWidth}
						direction={'vertical'}
						align={'left'}
						legendItems={this.getLegendItems(this.state.data)}
						selectedLegendItems={this.getLegendItems(this.state.data.filter(d => d.selected))}
						onClickLegend={this.onClickLegend}
						colorScale={this.state.colorScale}
						legendBy={this.state.legendBy}
					/>
			</div>
		</div>
		)
	}
}

// Render application
ReactDOM.render(
	<ErrorBoundary>
		<OverwatchDashboard />
	</ErrorBoundary>,
	document.getElementById('root')
);