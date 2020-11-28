import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import Scatterplot from './Scatterplot.js'
import Legend from './Legend.js'
import * as d3 from "d3";


class ScatterplotLegend extends React.Component {
	constructor(props) {
		super(props);

		console.log(props)

		// Need this to define with by CSS Grid
		this.graphRef = React.createRef()

		// Define what happens when you click on things
		this.onClickLegend = this.onClickLegend.bind(this)
		this.onClickChartItem = this.onClickChartItem.bind(this)
		this.onClickBackground = this.onClickBackground.bind(this)

		

		this.state = {
			data: props.data,
			selectedData: props.data,
			colorScale: d3.scaleOrdinal(d3.schemeCategory10)
				.domain(this.getUniqueItems(props.data, d => d[props.legendBy])),
			datum: null
		}

	}

	// Helpers
	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))].sort()
	}

	getLegendItems (data) {
			return this.getUniqueItems(data, d => d[this.props.legendBy]).sort()
	}


	onClickLegend(item) {
		console.log('legend click')
		var currentData = this.state.selectedData
		
		var newData = currentData.map(c => {
			c.selected = c[this.props.legendBy] == item
			return c
		})

		this.setState({ 
			selectedData: newData,
		})
	}

	onClickChartItem(item) {
		console.log('circle click')
		console.log(item)
		var currentData = this.state.selectedData
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
			selectedData: newData,
			datum: datum
		})
	}

	onClickBackground(event) {
		console.log('background click')
		var currentData = this.state.selectedData
		var newData = currentData.map(c => {
			c.selected = true
			return c
		})

		this.setState({ 
			selectedData: newData,
			datum: null
		})

	}

	componentDidUpdate() {
		if (this.props.data != this.state.data) {

			var selectedData = this.props.data.map(d =>{
				d.selected = true;
				return d;
			})

			this.setState({
				data: this.props.data,
				selectedData: selectedData
			})
		}

	}
	
	render() {
		return (
			<div className='container'>
				<div className='chart' ref={this.graphRef}>
					<Scatterplot
						width={this.graphRef.current?.offsetWidth}
						height={this.graphRef.current?.offsetHeight}
						xAccessor={this.props.xAccessor}
						yAccessor={this.props.yAccessor}
						data={this.state.selectedData}
						legendBy={this.props.legendBy}
						colorScale={this.state.colorScale}
						onClickChartItem={this.onClickChartItem}
						onClickBackground={this.onClickBackground}
					/>
				</div>
				<div className='legend'>
					<Legend
						chartWidth={this.graphRef.current?.offsetWidth}
						direction={'vertical'}
						align={'left'}
						legendItems={this.getLegendItems(this.state.selectedData)}
						selectedLegendItems={this.getLegendItems(this.state.selectedData.filter(d => d.selected))}
						onClickLegend={this.onClickLegend}
						colorScale={this.state.colorScale}
						legendBy={this.props.legendBy}
						/>
			</div>
		</div>
		)
	}
}
export default ScatterplotLegend