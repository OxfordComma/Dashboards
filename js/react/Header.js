import React from 'react'
import * as d3 from 'd3'
// import { legendColor } from 'd3-svg-legend'

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.legendRef = React.createRef()

	}
	componentDidMount() {
		this.update();
	}
	// Whenever the component updates, select the <g> from the DOM, and use D3 to manipulte circles
	componentDidUpdate() {
		this.update();
	}

	update() {

	}

	render() {
		return (
			<div className='header'>
				<a href='/dash/porsche'>Porsche</a>
				<a href='/dash/craigslist'>Craigslist</a>
				<a href='/dash/fbmarketplace'>Facebook Marketplace</a>

			</div>
		)
	}
}



export default Header