import React from "react";
// import DropdownForm from './DropdownForm'
import styles from '../styles/Sidebar.module.css'

function SidebarItem({
	opt,
	onChange,
	sidebar,
	items,
	selected,
}) {
	return <div className={styles.sidebaritem}>
		<div className={styles.sidebarcell}>
			{opt}
		</div>
		<select id={opt} onChange={onChange} value={sidebar[opt]} className={styles.sidebarcell}>
			{items.map(d => <option key={d} value={ d } selected={d == selected}>{ d }</option>)}
		</select>
	</div>
}



export default function Sidebar(props) {
	return (
		<div className={styles.sidebar}>
			<SidebarItem opt={'x-axis'} onChange={props.onXAxisDropdownChange} sidebar={props.sidebar} items={props.xOptions} selected={props.xSelected}/>
			<SidebarItem opt={'y-axis'} onChange={props.onYAxisDropdownChange} sidebar={props.sidebar} items={props.yOptions} selected={props.ySelected}/>
			<SidebarItem opt={'legend'} onChange={props.onLegendDropdownChange} sidebar={props.sidebar} items={props.legendOptions} selected={props.legendSelected}/>
			
			{
				Object.keys(props.sidebar).map(opt => {
					var unique
					if (props.sidebar[opt] == 'all') {
						unique = [...new Set(props.rawData.map(item => item[opt]?.toString()).filter(d => d))].sort()
					}
					else {
						unique = [...new Set(props.rawData.map(item => item[opt]?.toString()).filter(d => d))].sort()
					}
					
					return <SidebarItem opt={opt} onChange={props.onDropdownChange} sidebar={props.sidebar} items={['all'].concat(unique)}/>
				})
			}
		</div>
	)
}

