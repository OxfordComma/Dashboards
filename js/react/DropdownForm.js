import React from 'react'

var DropdownForm = function(props) {
	return (
		<span>
			
			<form>
				{props.title}
				<select id={props.title} onChange={props.onChange} onSubmit={props.onSubmit} value={props.default} style={props.style}>
					{props.options.map(d => <option key={d} value={ d }>{ d }</option>)}
				</select>
			</form>
		</span>
	)
}

DropdownForm.defaultProps = {
	style: {}
}

export default DropdownForm