import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
import Header from './Header'
import Scatterplot from './Scatterplot'
import Legend from './Legend'
// import ReactTable from './Table.js'
import ReactTable from './ReactTable.js'
import GraphSidebar from './GraphSidebar'
import DropdownForm from './DropdownForm'
import DataPoint from './DataPoint'
import * as d3 from "d3";
import * as _ from 'lodash'

class ScatterplotPorsches extends React.Component {
	constructor(props) {
		super(props);
		
		this.graphRef = React.createRef()
		this.tableRef = React.createRef()
		
		this.state = {
			data: [],
			rawData: [],
			datum: null,
			xValue: '_mileage',
			yValue: '_price',
			legendBy: 'year',
			sidebar: {
				_model: 'all',
				_submodel: 'Carrera S',
				_generation: '997',
				_transmission: 'manual',
				_cabriolet: 0,
				_drive: 'rwd',
				year: 'all',
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
		var dataUrl = "/data/cars/porsche/all/normalized"
		var data = await d3.json(dataUrl)
		// var modelUrl = '/data/cars/porsche/model'
		// var model = await d3.json(modelUrl)

		// var outputs = model[0].LinearRegression.outputs

		data = data.map(d => {
			d.selected = true;
			// d.outputDiff = parseInt(d[outputs[0]]) - parseInt(d['^'+outputs[0]])
			// d.outputDiffPercent = 100 * (d.outputDiff / d[outputs[0]])
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
			'post_time': {
				name: 'post_time',
				accessor: d => new Date( d['post_time']), 
				format: d => d3.timeFormat("%Y %b")(d),
				scale: d3.scaleLinear(),
					// .domain([
					// 	d3.min(data, (d) => new Date(d['post_time'])),
					// 	d3.max(data, (d) => new Date(d['post_time']))
					// ]),
			},
			'year': {
				name: 'year',
				accessor: d => d['year'],
				scale: d3.scaleLinear(),
					// .domain([
					// 	d3.min(data, (d) => d['year']),
					// 	d3.max(data, (d) => d['year'])
					// ]),
				ticks: this.getUniqueItems(data, d=>d['year']).length
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
			'_generation': {
				name: '_generation',
				accessor: d => d['_generation'], 
				// scale: d3.scaleOrdinal(),
				scale: d3.scaleOrdinal(d3.schemeCategory10)
		  },
		  '_color': {
				name: '_color',
				accessor: d => d['_color'], 
				scale: d3.scaleOrdinal(d3.schemeCategory10),
		  },
			'post_time': {
				name: 'post_time',
				accessor: d => new Date( d['post_time']), 
				format: d => d3.timeFormat("%Y %b")(d),
				scale: d3.scaleLinear(['white', 'navy'])
					.domain([
						d3.min(data, d => new Date(d['post_time'])),
						d3.max(data, d => new Date(d['post_time']))
					]),
			},
			'year': {
				name: 'year',
				accessor: d => d['year'],
				scale: d3.scaleOrdinal(d3.schemeCategory10)
					.domain(this.getUniqueItems(data, d=>d['year']).sort())
			},
			'_submodel': {
				name: 'submodel',
				accessor: d => d['_submodel'],
				scale: d3.scaleOrdinal(d3.schemeCategory10)
					.domain(this.getUniqueItems(data, d=>d['_submodel']).sort())
			}
		}

		this.tableOptions = {
			// '_id': { accessor: d => d._id },
			'post time': { 
				accessor: d => new Date(d.post_time), 
				width: 210,
				Cell: d => d3.timeFormat("%Y-%m-%d %H:%M")(new Date(d.row.original.post_time)),
			},
			'year': { accessor: d => d.year, width: 50 },
			'make': { accessor: d => d.make, width: 75 },
			'model': { accessor: d => d.model, width: 75 },
			'info': { 
				accessor: d => d._info,
				Cell: d => <a href={d.row.original.url} target='_blank' rel='noreferrer'>{d.value}</a>,
				width: 500
			 },
			
			'transmission': { accessor: d => d._transmission, width: 125 },
			'drive': { accessor: d => d._drive, width: 75 },
			'color': { accessor: d => d._color, width: 100 },
			'mileage': { 
				id: 'mileage',
				accessor: d => d._mileage, 
				width: 100,
				Cell: d => <div style={{'textAlign': 'right'}} >{d3.format(",.2r")(d.value)}</div>,

			},
			'price': { 
				id: 'price',
				accessor: d => d._price, 
				width: 75,
				Cell: d => <div style={{'textAlign': 'right'}} >{d3.format("$,.2r")(d.value)}</div>,
			},
		}

	  var colorsD = this.getUniqueItems(data, d=>d._color).sort()
	  console.log(colorsD)
	  var colorsR = this.getUniqueItems(data, d=>d._color).sort()
	  
	  colorsR[colorsR.indexOf('unknown')] = 'none'

		this.legendOptions._color.scale = this.legendOptions._color.scale
			.domain(colorsD)
	  	.range(colorsR)

  	console.log(this.legendOptions[this.state.legendBy].scale.domain())

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
		if (this.state.data.length == 0) return null;


		return (
			<div id='porsche-scatter' className='container'>
				<Header/>
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
					<GraphSidebar
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
		<ScatterplotPorsches />
	</ErrorBoundary>,
	document.getElementById('root')
);


