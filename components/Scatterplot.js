import React from 'react'
import * as d3 from "d3";
// import { regressionLoess, regressionQuad, regressionLinear, regressionExp } from 'd3-regression'
import d3Tip from 'd3-tip'


class Scatterplot extends React.Component {
	constructor(props) {
		super(props);

		this.svgRef = React.createRef()

		this.state = {
			drawWidth: 100,
			drawHeight: 100,
			xValue: this.props.xValue,
			yValue: this.props.yValue

		}
	}
	componentDidMount() {
		this.setState({
			drawWidth: this.svgRef.current?.clientWidth - this.props.margin.left - this.props.margin.right,
			drawHeight: this.svgRef.current?.clientHeight - this.props.margin.top - this.props.margin.bottom
		})
		this.update();
	}
	componentDidUpdate() {
		this.update();
	}

	updateScales() {
		console.log(this.props)
		// Calculate limits
		this.xMin = this.props.xMin ?? d3.min(this.props.data, (d) => +this.props.xValue.accessor(d));
		this.xMax = this.props.xMax ?? d3.max(this.props.data, (d) => +this.props.xValue.accessor(d));
		this.yMin = this.props.yMin ?? d3.min(this.props.data, (d) => +this.props.yValue.accessor(d));
		this.yMax = this.props.yMax ?? d3.max(this.props.data, (d) => +this.props.yValue.accessor(d));
		this.legendMin = d3.min(this.props.data, (d) => this.props.legendValue.accessor(d))
		this.legendMax = d3.max(this.props.data, (d) => this.props.legendValue.accessor(d))

		//Padding for the graph area
		// var drawWidth = this.svgRef.current.clientWidth - this.props.margin.left - this.props.margin.right;
		// var drawHeight = this.svgRef.current.clientHeight - this.props.margin.top - this.props.margin.bottom;
		
		// var xOpt = Object.assign({}, this.props.xValue)
		// var yOpt = Object.assign({}, this.props.yValue)
		// console.log(xOpt.axisScale(100000))
		// console.log(yOpt.axisScale(100000))

		// Define scales
		this.xScale = this.props.xValue.scale
			.domain([this.xMin, this.xMax])
			.range([this.props.margin.left, this.state.drawWidth])
			// .nice()
		
		this.yScale = this.props.yValue.scale
			.domain([this.yMin, this.yMax])
			.range([this.state.drawHeight, this.props.margin.top])
		
		this.legendScale = this.props.legendValue.scale
		
	}
	updatePoints() {
		// Add tip
		let tip = d3Tip().attr('class', 'd3-tip').html(this.props.tooltip)
		
		// Add hovers using the d3-tip library        
		d3.select('.chart-group').call(tip);

		// Create the transparent background width
		let background = d3.select('.chart-group').selectAll('rect').data([null])
		background.enter().append('rect')
			.attr('class', 'chart-background')
			.attr('x', 0)   
			.attr('y', 0)   
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('opacity', 0)
			.on('click', d => {
				this.props.onClickBackground(d)
			})
		console.log(this.props.data);
		// Select all circles and bind data
		let circles = d3.select('.chart-group')
			.selectAll('circle')
			.data(this.props.data, this.props.keyBy);

		// Use the .enter() method to get your entering elements, and assign their positions
		let circlesEnter = circles
			.enter().append('circle')
			.attr('class', 'chart-item')
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.attr('r', this.props.radius)				
			.style('fill-opacity', 0)
			.attr('cx', (d) => 
				isNaN(this.xScale(this.props.xValue.accessor(d))) ? 0 : this.xScale(this.props.xValue.accessor(d)) )
			.attr('cy', (d) => 
				isNaN(this.yScale(this.props.yValue.accessor(d))) ? 0 : this.yScale(this.props.yValue.accessor(d)) )
			

		circlesEnter.merge(circles)
			.on('click', d => this.props.onClickChartItem(d))
			.transition().duration(this.props.transitionSpeed)
			.attr('fill', (d) => this.legendScale( this.props.legendValue.accessor(d)) )
			.attr('cx', (d) => {
				return isNaN(this.xScale(this.props.xValue.accessor(d))) ? 0 : this.xScale(this.props.xValue.accessor(d))
			})
			.attr('cy', (d) => 
				isNaN(this.yScale(this.props.yValue.accessor(d))) ? 0 : this.yScale(this.props.yValue.accessor(d)) )
			// .attr('pointer-events', d => d.selected == true ? 'visiblePainted' : 'none')
			// .attr('_id', d => d._id)
			.style('fill-opacity', 1)
			.style('stroke', 'black')
			.style('stroke-width', 0.5)
			.style('stroke-opacity', d => d.selected == true ? 1 : 0)


		// Use the .exit() and .remove() methods to remove elements that are no longer in the data
		circles.exit()
			.transition().duration(this.props.transitionSpeed)
				// .attr('cx', (d) => 
					// isNaN(this.xScale(d[this.props.xValue])) ? 0 : this.xScale(d[this.props.xValue]) )
				// .attr('cy', (d) => 
					// isNaN(this.yScale(d[this.props.yValue])) ? 0 : this.yScale(d[this.props.yValue]) )
				.style('fill-opacity', 0)
			.remove();

		
		// var regressionGenerator = regressionLoess()
		// 	.x(d => d[this.props.xValue])
		// 	.y(d => d[this.props.yValue])
		// 	.bandwidth(0.75)
		// 	// .domain([this.xMin, this.xMax])

		// var lineGenerator = d3.line()
		// 	// .curve(d3.curveBasis)
		// 	.x(d => this.xScale(d[0]))
		// 	.y(d => this.yScale(d[1]))

		// var nestData = d3.nest()
		// 	.key(d => this.props.legendBy(d))
		// 	.entries(this.props.data)
		
		// var lines = d3.select(this.chartAreaRef.current).selectAll('.regression').data(nestData)

		// var linesEnter = lines.enter().append('path')
		// 	.attr('class', 'regression')
		// 	.attr('stroke', d => this.props.colorScale(d.key))
		// 	.style('fill', 'none')
			
		// linesEnter.merge(lines)
		// 	.transition().duration(800)
		// 		.attr('stroke-opacity', d => 
		// 			this.props.selectedLegendItems.length == 1 && this.props.selectedLegendItems[0] == d.key.toString() ? 1 : 0)

		// linesEnter.merge(lines)
		// 	.datum(d => {
		// 		// console.log(d.values)
		// 		// var regressionData = this.props.data.filter(pt => this.props.legendBy(pt) == d)
		// 		return regressionGenerator(d.values)
		// 	})
		// 	.attr('d', lineGenerator)

		// lines.exit().remove()
	}
	updateAxes() {
		// Graph width and height - accounting for margins
		let xAxisFunction = d3.axisBottom()
			.scale(this.xScale)
			.ticks(this.props.xTicks)
			.tickFormat(this.props.xValue?.format ? this.props.xValue.format : this.props.xFormat)


		let yAxisFunction = d3.axisLeft()
			.scale(this.yScale)
			.ticks(this.props.yTicks)
			.tickFormat(this.props.yValue?.format ? this.props.yValue.format : this.props.yFormat);

		d3.select('.x-axis-g')
			.transition().duration(350)
			.call(xAxisFunction);

		d3.select('.y-axis-g')
			.transition().duration(350)
			.call(yAxisFunction);
	}
	update() {
		this.updateScales();
		this.updatePoints();
		this.updateAxes();
	}
	render() {
		if (this.props.data.length == 0) return null;
		//Padding for the graph area
		// var drawWidth = this.svgRef.current?.clientWidth - this.props.margin.left - this.props.margin.right;
		// var drawHeight = this.svgRef.current?.clientHeight - this.props.margin.top - this.props.margin.bottom;
		// console.log(this.svgRef)
		// console.log(drawHeight)
// transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}
		return (
			<svg ref={this.svgRef} width='100%vw' height='100%vh' >
				<g className='chart-group' >
					{/*<text transform={`translate(${this.drawWidth/2},0)`}>{this.props.title}</text>*/}
					
					{/*<g className='chart-background' ref={this.chartAreaRef}/>*/}
					
					<g className='x-axis-g'
						transform={`translate(${0}, ${this.state.drawHeight})`}></g>
					<g className='y-axis-g'
						transform={`translate(${this.props.margin.left}, ${0})`}></g>
				</g>
				<text className="x-axis-label" transform={`translate(${this.state.drawWidth/2}, 
					${this.svgRef.current?.clientHeight - 5})`}>{this.props.xValue?.label ? this.props.xValue.label : 'unknown'}</text>

				<text className="y-axis-label" transform={`translate(${0}, 
					${10})`}>{this.props.yValue?.label ? this.props.yValue.label : 'unknown'}</text>
			
			</svg>
		)
	}
}

Scatterplot.defaultProps = {
	radius: 5,
	margin: {
		left: 30,
		right: 25,
		top: 20,
		bottom: 20
	},
	transitionSpeed: 300,
	xFormat: number => d3.format('t')(number),
	yFormat: number => d3.format('.2s')(number).replace('.0', ''),
	xTicks: 10,
	yTicks: 10
}

export default Scatterplot