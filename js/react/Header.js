import React from 'react'
import * as d3 from 'd3'

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.update();
	}
	componentDidUpdate() {
		this.update();
	}

	update() {

	}

	render() {
		console.log(this.props)
		return (
			<div className='header'>
				{this.props.options?.map(opt => {
					return <a href={opt.href}>{opt.name}</a>
				})}
			</div>
		)
	}
}



export default Header