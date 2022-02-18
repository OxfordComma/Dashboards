import * as d3 from 'd3';
import React from 'react'
import ReactDOM from 'react-dom'

function deg2rad(deg) {
	return deg * Math.PI / 180;
}


class Tachometer extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			range: props.endAngle - props.startAngle
		}
		this.tachometerRef = React.createRef()
		this.gaugeScale = d3.scaleLinear()
			.range([0,1])
			.domain([0, 8000]);
		
		this.gaugeScale
			.ticks(this.props.numTicks);
		
	}
	
	componentDidMount() {
		var pointerWidth = 10
		var pointerTailLength	= 5
		var pointerHeadLengthPercent = 1.0
		var pointerHeadLength = pointerHeadLengthPercent * this.props.innerRadius
		var arc = d3.arc()
			.innerRadius(this.props.innerRadius)
			.outerRadius(this.props.outerRadius)
			.startAngle(deg2rad(this.props.startAngle))
			.endAngle(deg2rad(this.props.endAngle))

		var svg = d3.select(this.tachometerRef.current)
			.append('svg').attr('width', this.props.width).attr('height', this.props.width)
		
		svg.append('path')
			.attr('transform', `translate(${this.props.width/2}, ${this.props.height/2})`)
			.attr('d', arc)
			.attr('fill', 'orange')
		
		var lineData = [ [pointerWidth / 2, 0], 
			[0, -pointerHeadLength],
			[-(pointerWidth / 2), 0],
			[0, pointerTailLength],
			[pointerWidth / 2, 0] ];

		var pointerLine = d3.line()
		var pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')

		pg.append('path')
			.attr('d', pointerLine)
			.attr('transform', `translate(${this.props.width/2}, ${this.props.height/2}) rotate(${this.props.startAngle})`);
		
		var numTicks = this.props.numTicks
		var tickData = d3.range(numTicks)
			.map(d => { return d/numTicks });
		
		// console.log(d3.range(numTicks))
		var ticks = svg
			.selectAll('.ticks').data(tickData)
			.enter().append('g')
			.attr('class', 'ticks')
			.attr('transform', d => 
				`translate(${this.props.width/2}, ${this.props.height/2})
				rotate(${this.props.startAngle + (this.state.range * d) - 90})
				translate(${this.props.innerRadius}, ${0})`
			)
		// var tickRects = ticks.append('g')
			
		var tickBars = ticks
			.append('rect')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', this.props.innerRadius / 5)
				.attr('height', this.props.innerRadius / 80)
				.attr('fill', 'white')
				.attr('transform', `translate(-50, 0)`)

		var tickText = ticks
			.append('text')
				// .text(d => this.props.startAngle + (this.gaugeScale(d) * this.state.range))
				.attr('transform', `translate(20, 0)`)
		// console.log(tickBars)

			// arcs.selectAll('path')
			// 	.data(tickData)
			// .enter().append('path')
			// 	.attr('fill', function(d, i) {
			// 		return config.arcColorFn(d * i);
			// 	})
			// 	.attr('d', arc);
		// this.update()
	}

	componentDidUpdate() {
		var newAngle = this.props.startAngle + (this.gaugeScale(this.props.rpms) * this.state.range);
		// console.log(this.gaugeScale(this.props.rpms))
		this.update()
		d3.select('.pointer > path')
			.transition().duration(400)
			.ease(d3.easeLinear)
			.attr('transform', `translate(${this.props.width/2}, ${this.props.height/2}) rotate(${newAngle})`);
	}

	update() {
		
	}
	
	render() {
		return (<div ref={this.tachometerRef} ></div>)
	}
};

export default Tachometer