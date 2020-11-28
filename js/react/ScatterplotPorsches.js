import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
// import ScatterplotWithLegend from './ScatterplotWithLegend.js'
import Scatterplot from './Scatterplot'
import Legend from './Legend'
// import ReactTable from './Table.js'
import ReactTable from './ReactTable.js'
import GraphSidebar from './GraphSidebar'
import DropdownForm from './DropdownForm'
import DataPoint from './DataPoint'
import * as d3 from "d3";

class ScatterplotPorsches extends React.Component {
	constructor(props) {
		super(props);
		
		this.graphRef = React.createRef()
		this.tableRef = React.createRef()
		
		this.legendOptions = [
			'_generation', 
			'_cabriolet', 
			'_transmission', 
			'_submodel', 
			'_color', 
			'_drive',
			'year'
		]
	
		this.xOptions = {
			'year': {
				label: 'year',
				accessor: d=>d['year']
			},
			'post_time': {
				label: 'post time',
				accessor: d => new Date( d['post_time']), 
				format: d => d3.timeFormat("%B %d, %Y")(d)
			},
			'_mileage': {
				label: 'mileage',
				accessor: d=>d['_mileage']
			}
		}
		console.log(this.xOptions[0])

		this.yOptions = {
			'^_price': {
				label: 'predicted price',
				accessor: d => d['^_price']
			},
			_price: { 
				label: 'price',
				accessor: d => d._price, 
			},
			price_diff: {
				label: 'actual over predicted',
				accessor: d => (d._price/d['^_price'])
			},
			_mileage: {
				label: 'mileage',
				accessor: d => d._mileage
			}
		}

		this.tableOptions = {
			'_id': { accessor: d => d._id },
			'year': { accessor: d => d.year },
			'make': { accessor: d => d.make },
			'model': { accessor: d => d.model },
			'info': { 
				accessor: d => d.info,
				Cell: d => <a href={d.row.original.url} target='_blank' rel='noreferrer'>{d.value}</a>
			 },
			'_mileage': { accessor: d => d._mileage },
			'_transmission': { accessor: d => d._transmission },
			'_drive': { accessor: d => d._drive },
			'color': { accessor: d => d._color },
			'_price': { accessor: d => d._price },
			'^_price': { accessor: d => d['^_price'] },
			'price_diff': { accessor: d => parseInt((d._price/d['^_price'])*100) }

		}
		
		this.state = {
			data: [],
			rawData: [],
			datum: null,
			xValue: 'year',
			yValue: '_price',
			legendBy: '_submodel',
			colorScale: d3.scaleOrdinal(d3.schemeCategory10),
			sidebar: {
				_model: 'all',
				_submodel: 'Carrera S',
				_generation: '997',
				transmission: 'all',
				_cabriolet: 'all',
				_drive: 'all',
			}
		};
``
		this.onClickLegend = this.onClickLegend.bind(this)
		this.onClickChartItem = this.onClickChartItem.bind(this)
		this.onClickBackground = this.onClickBackground.bind(this)
				
		this.onLegendDropdownChange = this.onLegendDropdownChange.bind(this)
		this.onXAxisDropdownChange = this.onXAxisDropdownChange.bind(this)
		this.onYAxisDropdownChange = this.onYAxisDropdownChange.bind(this)
		this.onSidebarDropdownChange = this.onSidebarDropdownChange.bind(this)
	}

	async componentDidMount() {
		var dataUrl = "http://localhost:3000/data/cars/porsche/normalized"
		var data = await d3.json(dataUrl)
		var modelUrl = 'http://localhost:3000/data/cars/porsche/model'
		var model = await d3.json(modelUrl)

		// console.log(model)

		var outputs = model[0].LinearRegression.outputs

		data = data.map(d => {
			d.selected = true;
			d.outputDiff = parseInt(d[outputs[0]]) - parseInt(d['^'+outputs[0]])
			d.outputDiffPercent = 100 * (d.outputDiff / d[outputs[0]])
			return d
		})

		var rawData = data
		
		console.log(data)
		console.log(model)

		var sidebar = this.state.sidebar
		Object.keys(sidebar).map(s => {
			if (sidebar[s] == 'all')
				return
			else
				data = data.filter(d => d[s].toString() == sidebar[s])
		})

		this.setState({ 
			data: data,
			rawData: rawData,
			machineLearningModel: model[0]
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
		console.log(data)
		console.log(sidebar)
		
		Object.keys(sidebar).map(s => {
			if (sidebar[s] == 'all')
				return
			else
				data = data.filter(d => d[s]?.toString() == sidebar[s])
		})

		this.setState({ 
			sidebar: sidebar,
			data: data
		})
	}

	render() {
		return (
			<div id='porsche-scatter' className='container'>
				<div className='header'>
					<DropdownForm
						title='X axis:'
						onChange={this.onXAxisDropdownChange}
						onSubmit={this.onXAxisDropdownSubmit}
						options={Object.keys(this.xOptions)}
						default={this.state.xValue}
					/>
					<DropdownForm
						title='Y axis:'
						onChange={this.onYAxisDropdownChange}
						onSubmit={this.onYAxisDropdownSubmit}
						options={Object.keys(this.yOptions)}
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
						xValue={this.xOptions[this.state.xValue]}
						yValue={this.yOptions[this.state.yValue]}
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
				{/*<div className='info'>
					<DataPoint 
						datum={this.state.datum} 
						model={this.state.machineLearningModel}
					/>
					</div>
				*/}
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


