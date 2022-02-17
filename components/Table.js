import React from 'react'
// import { useTable, useSortBy, useFilters, useRowSelect } from 'react-table'


function Headings(props) {
	if (props.columns.length > 0) {
		return <thead>
			<tr>
				{props.columns.map(d => {
					return <th key={d}>{d}</th>
				})}
			</tr>
		</thead>
	}
	else {
		return <thead></thead>
	}
}

function Body(props) {
	return <tbody>
		{
			props.data.map(d => {
				return (
					<tr 
						key={d[props.keyBy]} 
						id={d[props.keyBy]} 
						onClick={props.onClickRow}>
						{ props.columns.map(key => 
							<td 
								key={key} 
								style={{opacity: d.selected ? 1 : 0.1}} 
								onClick={props.onClickCell}>{ d[key] }</td>) }
					</tr>
				)
			})
		}
	</tbody>
}

class ReactTable extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {		
		return (
			<table>
				<Headings 
					columns={this.props.columns} />
				<Body 
					columns={this.props.columns} 
					data={this.props.data} 
					keyBy={this.props.keyBy} 
					onClickRow={this.props.onClickRow}
					onClickCell={this.props.onClickCell}/>
			</table>
		)
	}

}
export default ReactTable
