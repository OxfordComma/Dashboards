import React from "react";
// import DropdownForm from './DropdownForm'
import styles from '../styles/Sidebar.module.css'

export default function Sidebar(props) {
	return (
		<div className={styles.sidebar}>
			<div>
			x-axis
			<select id='x-axis' onChange={props.onXAxisDropdownChange} style={{width: 90+'px'}}>
				{props.xOptions.map(d => <option key={d} value={ d }>{ d }</option>)}
			</select>
			</div>
			<div>
			y-axis
			<select id='y-axis' onChange={props.onYAxisDropdownChange} style={{width: 90+'px'}}>
				{props.yOptions.map(d => <option key={d} value={ d }>{ d }</option>)}
			</select>
			</div>
			
			{
				Object.keys(props.sidebar).map(opt => {
					var unique
					if (props.sidebar[opt] == 'all') {
						unique = [...new Set(props.rawData.map(item => item[opt]?.toString()).filter(d => d))].sort()
					}
					else {
						unique = [...new Set(props.rawData.map(item => item[opt]?.toString()).filter(d => d))].sort()
					}
					
					return (
						<div>
							{opt}
							<select id={opt} onChange={props.onDropdownChange} style={props.style}>
								{['all'].concat(unique).map(d => <option key={d} value={ d }>{ d }</option>)}
							</select>
						</div>
					)
				})
			}
		</div>
	)
}

