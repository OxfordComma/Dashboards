import React from 'react'
import * as d3 from "d3";
// import { regressionLoess, regressionQuad, regressionLinear, regressionExp } from 'd3-regression'
import d3Tip from 'd3-tip'


class Scatterplot extends React.Component {
	constructor(props) {
		super(props);
		this.chartAreaRef = React.createRef()
		this.xAxisRef = React.createRef()
		this.yAxisRef = React.createRef()
	}
	componentDidMount() {
		this.update();
	}
	componentDidUpdate() {
		this.update();
	}

	updateScales() {
		// Calculate limits
		this.xMin = this.props.xMin ?? d3.min(this.props.data, (d) => +this.props.xValue.accessor(d));
		this.xMax = this.props.xMax ?? d3.max(this.props.data, (d) => +this.props.xValue.accessor(d));
		this.yMin = this.props.yMin ?? d3.min(this.props.data, (d) => +this.props.yValue.accessor(d));
		this.yMax = this.props.yMax ?? d3.max(this.props.data, (d) => +this.props.yValue.accessor(d));
		
		//Padding for the graph area
		this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
		this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;
		
		// Define scales
		this.xScale = d3.scaleLinear().domain([this.xMin, this.xMax]).range([0, this.drawWidth])
		this.yScale = d3.scaleLinear().domain([this.yMax, this.yMin]).range([0, this.drawHeight])

	}
	updatePoints() {
		// Add tip
		let tip = d3Tip().attr('class', 'd3-tip').html(d => d['info']);
		
		// Add hovers using the d3-tip library        
		d3.select(this.chartAreaRef.current).call(tip);

		// Create the transparent background width
		let background = d3.select(this.chartAreaRef.current).selectAll('rect').data([null])
		background.enter().append('rect')
			.attr('class', 'chart-background')
			.attr('x', 0)   
			.attr('y', 0)   
			.attr('width', isNaN(this.drawWidth) ? 0 : this.drawWidth)
			.attr('height', isNaN(this.drawHeight) ? 0 : this.drawHeight)
			.attr('opacity', 0)
			.on('click', d => {
				this.props.onClickBackground(d)
			})

		// Select all circles and bind data
		let circles = d3.select(this.chartAreaRef.current)
			.selectAll('circle')
			.data(this.props.data, d => d['_id']);

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
			.attr('fill', (d) => 
				this.props.legendBy == 'color' ? 
				d['color'] : 
				this.props.scale(d[this.props.legendBy]) 
				)
			.attr('cx', (d) => 
				isNaN(this.xScale(this.props.xValue.accessor(d))) ? 0 : this.xScale(this.props.xValue.accessor(d)) )
			.attr('cy', (d) => 
				isNaN(this.yScale(this.props.yValue.accessor(d))) ? 0 : this.yScale(this.props.yValue.accessor(d)) )
			.attr('pointer-events', d => d.selected == true ? 'visiblePainted' : 'none')
			.attr('_id', d => d._id)
			.style('fill-opacity', d => d.selected == true ? 1 : 0.03)
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
			.ticks(5, 's')
			.tickFormat(this.props.xValue?.format ? this.props.xValue.format : this.props.xFormat)

		let yAxisFunction = d3.axisLeft()
			.scale(this.yScale)
			.ticks(5, 's')
			.tickFormat(this.props.yValue?.format ? this.props.yValue.format : this.props.yFormat);

		d3.select(this.xAxisRef.current)
			.transition().duration(350)
			.call(xAxisFunction);

		d3.select(this.yAxisRef.current)
			.transition().duration(350)
			.call(yAxisFunction);
	}
	update() {
		this.updateScales();
		this.updatePoints();
		this.updateAxes();
	}
	render() {
		if (this.props.width == undefined || this.props.height == undefined) {
			return <g ref={this.chartAreaRef}
					transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`} />
		}

		return (
			<svg width={this.props.width} height={this.props.height}>
				<g>
					{/*<text transform={`translate(${this.drawWidth/2},0)`}>{this.props.title}</text>*/}
					
					<g ref={this.chartAreaRef}
						transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`} />
					
					<g ref={this.xAxisRef}
						transform={`translate(${this.props.margin.left}, ${this.props.height - this.props.margin.bottom})`}></g>
					<g ref={this.yAxisRef}
						transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}></g>

					<text className="axis-label" transform={`translate(${this.props.margin.left + this.props.width / 2}, 
						${this.props.height - this.props.margin.bottom + 30})`}>{this.props.xValue.label}</text>

					<text className="axis-label" transform={`translate(${this.props.margin.left - 35}, 
						${this.props.height / 2 + this.props.margin.top}) rotate(-90)`}>{this.props.yValue.label}</text>
				</g>
			</svg>
		)
	}
}

Scatterplot.defaultProps = {
	radius: 5,
	margin: {
		left: 50,
		right: 50,
		top: 20,
		bottom: 35
	},
	transitionSpeed: 300,
	xFormat: number => d3.format('t')(number),
	yFormat: number => d3.format('.2s')(number).replace('.0', '')
}

export default Scatterplot