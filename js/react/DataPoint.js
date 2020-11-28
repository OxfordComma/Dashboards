import React from 'react'
// import ReactDOM from 'react-dom'

var DataPoint = function(props) {
	if (!props.datum) 
		return null

	var model = props.model.LinearRegression
	// console.log(model)

	var categoricalInputs = model.input_types
		.filter(i => i.dtype == 'category')
		.map(i => i.column)
	var numericInputs = model.input_types
		.filter(i => ['int', 'float64'].includes(i.dtype))
		.map(i => i.column)
	var inputs = ['intercept'].concat( 
		(categoricalInputs.concat(numericInputs)).sort() 
	)
	var outputs = model.outputs
	

	var weightedInputs = inputs.map(i => {
		if (i == 'intercept')
			return model.weights[i].weight;
		if (categoricalInputs.includes(i)) {
			var encodedName = i + '_' + props.datum[i].toString()
			if (model.weights[encodedName] != undefined)
				return parseFloat(model.weights[encodedName].weight)
			else
				return 0
		}
		if (numericInputs.includes(i)) {
			var scaledInput  = (props.datum[i] - model.weights[i].mean) / model.weights[i].stdev
			return parseFloat(model.weights[i].weight) * parseFloat(scaledInput)
		}
	})

	

	// console.log(weightedInputs)
	// var predictedOutput = parseInt(weightedInputs.reduce((a, b) => a + b, 0))
	// var outputDiff = parseInt(props.datum[outputs[0]] - predictedOutput)
	// var outputDiffPercent = (outputDiff / props.datum[outputs[0]]) * 100

	return (
		!props.datum ? null : 
		
				<table>
					<tbody>
						<tr>
							<th>Column</th>
							{inputs.map(i => <th>{i}</th>)}
							{outputs.map(u => <th>{u}</th>)}
							<th>priceDiff</th>
							<th>priceDiffPercent</th>
						</tr>
						<tr>
							<th>Data Values</th>
							{inputs.map(i => <td>{props.datum[i]}</td>)}
							{outputs.map(i => <td>{props.datum[i]}</td>)}
						</tr>
						<tr>
							<th>Data Weights</th>
							{weightedInputs.map(w => <td>{parseInt(w)}</td>)}
							<td>{props.datum['^'+outputs[0]]}</td>
							<td>{props.datum['outputDiff']}</td>
							<td>{props.datum['outputDiffPercent']}</td>
						</tr>
					</tbody>
				</table>
				
	)

}

export default DataPoint