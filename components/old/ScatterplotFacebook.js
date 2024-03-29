import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import Header from './Header'
import Scatterplot from './Scatterplot'
import Legend from './Legend'
import ReactTable from './ReactTable.js'
import Sidebar from './Sidebar'
import DropdownForm from './DropdownForm'
import DataPoint from './DataPoint'
import * as d3 from "d3";
import * as _ from 'lodash'

class ScatterplotFacebook extends React.Component {
	constructor(props) {
		super(props);
		
		this.graphRef = React.createRef()
		this.tableRef = React.createRef()
		
		this.state = {
			data: [],
			rawData: [],
			datum: null,
			xValue: '_year',
			yValue: '_price',
			legendBy: '_make',
			sidebar: {
				_make: 'all',
				_model: 'Miata',
			}
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

	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))].sort()
	}

	async componentDidMount() {
		var dataUrl = "/data/cars/fbmarketplace/normalized"
		var data = await d3.json(dataUrl)
		console.log(data)
		// var modelUrl = '/data/cars/porsche/model'
		// var model = await d3.json(modelUrl)

		// var outputs = model[0].LinearRegression.outputs

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
			// machineLearningModel: model[0],
		})
	}

	componentDidUpdate() {
		this.updateOptions(this.state.data)
	}

	updateOptions(data) {
		// console.log(data)
		this.xOptions = {
			// 'post_time': {
			// 	name: 'post_time',
			// 	accessor: d => new Date( d['post_time']), 
			// 	format: d => d3.timeFormat("%Y %b")(d),
			// 	scale: d3.scaleLinear(),
			// },
			'_year': {
				name: '_year',
				accessor: d => d['_year'],
				scale: d3.scaleLinear(),
					// .domain([
					// 	d3.min(data, (d) => d['year']),
					// 	d3.max(data, (d) => d['year'])
					// ]),
				// ticks: this.getUniqueItems(data, d=>d['year']).length
			},
			_price: { 
				label: 'price',
				accessor: d => d['_price'], 
				scale: d3.scaleLinear(),
					// .domain([
					// 	d3.min(data, (d) => d['_price']),
					// 	d3.max(data, (d) => d['_price'])
					// ]),
			},
			_mileage: {
				label: 'mileage',
				accessor: d => d['_mileage'],
				scale: d3.scaleLinear(),
					// .domain([
					// 	d3.min(data, (d) => d['_mileage']),
					// 	d3.max(data, (d) => d['_mileage'])
					// ]),
			},
			last_updated: {
				label: 'last_updated',
				accessor: d => d['last_updated'],
				scale: d3.scaleLinear(),
					// .domain([
					// 	d3.min(data, (d) => d['_mileage']),
					// 	d3.max(data, (d) => d['_mileage'])
					// ]),
			}
		}

		this.yOptions = {
			_price: { 
				label: 'price',
				accessor: d => d['_price'], 
				scale: d3.scaleLinear(),
					// .domain([
					// 	d3.min(data, (d) => d['_price']),
					// 	d3.max(data, (d) => d['_price'])
					// ]),
			},
			_mileage: {
				label: 'mileage',
				accessor: d => d._mileage,
				scale: d3.scaleLinear(),
			  // 	.domain([
					// 	d3.min(data, (d) => d['_mileage']),
					// 	d3.max(data, (d) => d['_mileage'])
					// ]),
			}
		}

		this.legendOptions = {
			// '_generation': {
			// 	name: '_generation',
			// 	accessor: d => d['_generation'], 
			// 	// scale: d3.scaleOrdinal(),
			// 	scale: d3.scaleOrdinal(d3.schemeCategory10)
		 //  },
		 //  '_color': {
			// 	name: '_color',
			// 	accessor: d => d['_color'], 
			// 	scale: d3.scaleOrdinal(d3.schemeCategory10),
		 //  },
			// 'post_time': {
			// 	name: 'post_time',
			// 	accessor: d => new Date( d['post_time']), 
			// 	format: d => d3.timeFormat("%Y %b")(d),
			// 	scale: d3.scaleLinear(['white', 'navy'])
			// 		.domain([
			// 			d3.min(data, d => new Date(d['post_time'])),
			// 			d3.max(data, d => new Date(d['post_time']))
			// 		]),
			// },
			// 'year': {
			// 	name: 'year',
			// 	accessor: d => d['year'],
			// 	scale: d3.scaleOrdinal(d3.schemeCategory10)
			// 		.domain(this.getUniqueItems(data, d=>d['year']).sort())
			// },
			'_make': {
				name: 'make',
				accessor: d => d['_make'],
				scale: d3.scaleOrdinal(d3.schemeCategory10)
					.domain(this.getUniqueItems(data, d=>d['_make']).sort())
			},
			'_model': {
				name: 'model',
				accessor: d => d['_model'],
				scale: d3.scaleOrdinal(d3.schemeCategory10)
					.domain(this.getUniqueItems(data, d=>d['_model']).sort())
			}
		}

		this.tableOptions = {
			// // '_id': { accessor: d => d._id },
			'last_updated': { 
				accessor: d => d.date, 
				width: 150,
				Cell: d => d3.timeFormat("%Y-%m-%d %H:%M")(new Date(d.row.original.last_updated)),
			},
			'year': { accessor: d => d._year, width: 150 },
			'make': { accessor: d => d._make, width: 150 },
			'model': { accessor: d => d._model, width: 300 },
			'title': { 
				accessor: d => d.title,
				Cell: d => <a href={d.row.original.url} target='_blank' rel='noreferrer'>{d.value}</a>,
				width: 600
			 },
			
			// 'transmission': { accessor: d => d._transmission, width: 125 },
			// 'drive': { accessor: d => d._drive, width: 75 },
			// 'color': { accessor: d => d._color, width: 100 },
			// 'mileage': { 
			// 	id: 'mileage',
			// 	accessor: d => d._mileage, 
			// 	width: 100,
			// 	Header: () => (<div style={{'textAlign': 'right'}} >mileage</div>),
			// 	Cell: d => <div style={{'textAlign': 'right'}} >{d3.format(",.2r")(d.value)}</div>,

			// },
			'price': { 
				id: 'price',
				accessor: d => d._price, 
				width: 75,
				Cell: d => <div style={{'textAlign': 'right'}} >{d3.format("$,.2r")(d.value)}</div>,
			},
		}

	 //  var colorsD = this.getUniqueItems(data, d=>d._color).sort()
	 //  console.log(colorsD)
	 //  var colorsR = this.getUniqueItems(data, d=>d._color).sort()
	  
	 //  colorsR[colorsR.indexOf('unknown')] = 'none'

		// this.legendOptions._color.scale = this.legendOptions._color.scale
		// 	.domain(colorsD)
	 //  	.range(colorsR)

  // 	console.log(this.legendOptions[this.state.legendBy].scale.domain())

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

		// var legendOption = this.legendOptions[legendBy]
	 //  legendOption.scale
	 //  	.domain(this.getUniqueItems(this.state.data, d=>legendOption.accessor(d)).sort())

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
		// if (data.length == 0) {
		// 	Object.keys(sidebar).map(s => {
		// 		if (s == beingChanged) {
		// 			sidebar[s] = event.target.value
		// 		}
		// 		else
		// 			sidebar[s] = 'all'
		// 	})

		// 	data = this.state.rawData.filter(d => d[beingChanged]?.toString() == sidebar[beingChanged])
		// }
		// console.log(data)

		this.updateOptions(data)

		this.setState({ 
			sidebar: sidebar,
			data: data
		})
	}

	render() {
		if (this.state.data.length == 0) return null;


		return (
			<div id='porsche-scatter' className='container'>
				<Header options={[ 
					{name: 'Porsches', href: '/dash/porsche'}, 
					{name: 'Craigslist', href: '/dash/craigslist'}, 
					{name: 'FB Marketplace', href: '/dash/fbmarketplace'}, 
				]}/>
				<div className='sidebar'>
					<div className='dropdown'>
						<DropdownForm
							title='X axis:'
							onChange={this.onXAxisDropdownChange}
							onSubmit={this.onXAxisDropdownSubmit}
							options={Object.keys(this.xOptions)}
							default={this.state.xValue}
							style={{width: 90+'px'}}

						/>
						<DropdownForm
							title='Y axis:'
							onChange={this.onYAxisDropdownChange}
							onSubmit={this.onYAxisDropdownSubmit}
							options={Object.keys(this.yOptions)}
							default={this.state.yValue}
							style={{width: 90+'px'}}
						/>
					</div>
					<Sidebar
						sidebar={this.state.sidebar}
						rawData={this.state.rawData}
						data={this.state.data}
						onDropdownChange={this.onSidebarDropdownChange}
						style={{width: 90+'px'}}
					/>
				</div>
				<div className='chart' ref={this.graphRef}>
					<Scatterplot
						// width={this.graphRef.current?.offsetWidt}
						// height={this.graphRef.current?.offsetHeight}
						xValue={this.xOptions[this.state.xValue]}
						yValue={this.yOptions[this.state.yValue]}
						xTicks={this.xOptions[this.state.xValue].ticks ? this.xOptions[this.state.xValue].ticks : undefined}
						data={this.state.data}
						legendBy={this.state.legendBy}
						legendValue={this.legendOptions[this.state.legendBy]}
						onClickChartItem={this.onClickChartItem}
						onClickBackground={this.onClickBackground}
						keyBy={d => d['_id']}
					/>
				</div>
				<div className='legend'>
					<DropdownForm
							// title='Legend:'
							onChange={this.onLegendDropdownChange}
							onSubmit={this.onLegendDropdownSubmit}
							options={Object.keys(this.legendOptions)}
							default={this.state.legendBy}
							style={{width: 130+'px'}}
						/>
					<Legend
						// chartWidth={this.graphRef.current?.offsetWidth}
						orientation={'vertical'}
						// cells={10}
						// align={'left'}
						// legendItems={this.getLegendItems(this.state.data)}
						// selectedLegendItems={this.getLegendItems(this.state.data.filter(d => d.selected))}
						// onClickLegend={this.onClickLegend}
						legendValue={this.legendOptions[this.state.legendBy]}
						// legendBy={this.state.legendBy}
						// format={this}
					/>
			</div>
					<div className='table' ref={this.tableRef}>
						<ReactTable 
							data={this.state.data.filter(d => d.selected)}
							options={this.tableOptions}
							onClickRow={this.onClickRow}
							// onClickCell={this.onClickCell}
							keyBy={'_id'}
							/>
				</div>
			</div>
		)
	}
}


// Render application
ReactDOM.render(
	<ErrorBoundary>
		<ScatterplotFacebook />
	</ErrorBoundary>,
	document.getElementById('root')
);


