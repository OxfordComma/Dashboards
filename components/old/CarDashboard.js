import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import Tachometer from './Tachometer.js'
import * as d3 from "d3";


class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			powerGauge: null,
			rpms: 0
		}
	}
	
	componentDidMount() {
		var carId = document.getElementById('root').className
		// var dataUrl = "http://localhost:3000/data/cars/porsche/"+carId
		var connection = new WebSocket('ws://localhost:8001/websocket');
		// console.log(dataUrl)

		// d3.json(dataUrl).then((data) => {
		// 	console.log(data)

		// 	this.setState({ 
		// 		jsonData: data,
		// 	})
		// });
		// var powerGauge = Gauge('#power-gauge', {
		// 	size: 300,
		// 	clipWidth: 300,
		// 	clipHeight: 300,
		// 	ringWidth: 60,
		// 	minValue: 0,
		// 	maxValue: 8000,
		// 	transitionMs: 100,
		// })
		// console.log(this.powerGauge)
		connection.onmessage = (event) => {
			//get data & parse
			var newData = JSON.parse(event.data);
			// console.log(newData.rpms)
			// console.log(this.powerGauge)
			// if (this.state.powerGauge)
			// powerGauge.update(parseFloat(newData['rpms']));
			this.setState({
				// powerGauge: powerGauge,
				rpms: parseFloat(newData['rpms'])
			})
		}

		// powerGauge.render();
		
	}

	

	

	render() {
		return (
			<div>
			<div id='power-gauge'>

			</div>
				<Tachometer
					width={600}
					height={600}
					innerRadius={150}
					outerRadius={165}
					startAngle={-135}
					endAngle={135}
					numTicks={9}
					rpms={this.state.rpms}/>
			</div>

		)
	}
}

// Render application
ReactDOM.render(
	<ErrorBoundary>
		<Dashboard />
	</ErrorBoundary>,
	document.getElementById('root')
);





