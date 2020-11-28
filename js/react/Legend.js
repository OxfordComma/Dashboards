import React from 'react'
import * as d3 from 'd3'

class Legend extends React.Component {
	constructor(props) {
		super(props);
		this.legendRef = React.createRef()

		// Graph width and height - accounting for margins
		// this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
		// this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;
	}
	componentDidMount() {
		this.update();
	}
	// Whenever the component updates, select the <g> from the DOM, and use D3 to manipulte circles
	componentDidUpdate() {
		this.update();
	}

	updateLegend() {
		let selection = d3.select(this.legendRef.current)

		// let background = selection.selectAll('rect').data([null])
		// background.enter().append('rect')
		// 	.attr('x', -this.props.radius * 2)   
		// 	.attr('y', -this.props.radius * 2)   
		// 	.attr('width', this.drawWidth)
		// 	.attr('height', this.props.radius * 4)
		// 	.attr('opacity', 0);

		// console.log(this.props)
		const legendItems = selection.selectAll('.legend-item').data(this.props.legendItems);
		const legendItemsEnter = legendItems
			.enter().append('g')
				.attr('class', 'legend-item')
				.attr('opacity', 0)
				.on('click', d => this.props.onClickLegend(d))

		legendItems.exit().remove()
		

		legendItemsEnter.append('circle')
			.merge(legendItems.select('circle'))
				.attr('r', this.props.radius)
				.attr('fill', d => 
					this.props.legendBy == 'color' ? 
					d : 
					this.props.colorScale(d))
				.attr('fill-opacity', 1)
		
		legendItemsEnter.append('text')
			.merge(legendItems.select('text'))   
				.text(d => d)
				.attr('dy', '0.32em')
				.attr('x', this.props.radius * 2)
				.attr('text-anchor', 'start')


		legendItemsEnter.merge(legendItems)
			.transition().duration(350)
			.attr('transform', (d, i) => {
				var textLengths = d3.selectAll('.legend-item').selectAll('text').nodes().map(n => n.getComputedTextLength())
				//                  Each circle + some padding
				var totalWidth = this.props.direction == 'horizontal' ? 
					this.props.radius * 4 * textLengths.length + d3.sum(textLengths) + 20 : 
					this.props.radius * 4 + d3.max(textLengths) + 20

				var align
				if (this.props.align == 'left')
					align = 0
				if (this.props.align == 'center')
					// align = (this.props.chartWidth - totalWidth)/2
					align = 0
				if (this.props.align == 'right')
					// align = this.props.chartWidth - totalWidth
					align = 0


				if (this.props.direction == 'horizontal') {
					return `translate(${ this.props.offset + align + (this.props.radius * 4 * i) + d3.sum(textLengths.slice(0, i)) }, 0)`
				}

				if (this.props.direction == 'vertical') {
					return `translate(${ this.props.offset + align }, ${ this.props.radius * i * 4 })`
				}

			})
			.attr('opacity', d => this.props.selectedLegendItems.includes(d) ? 1 : 0.1)
	}
	update() {
		this.updateLegend();
	}

	render() {
		return (
			<svg width="10vw" height="100vh">
				<g ref={this.legendRef} className='legend'
					transform={`translate(${this.props.margin.left}, ${this.props.margin.top + this.props.radius})`} />
			</svg>
		)
	}
}

Legend.defaultProps = {
	data: [],
	width: 300,
	height: 300,
	radius: 5,
	offset: 0,
	margin: {
		left: 10,
		right: 10,
		top: 10,
		bottom: 10
	}
};

export default Legend