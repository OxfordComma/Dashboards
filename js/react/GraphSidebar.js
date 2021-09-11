import React from "react";
import DropdownForm from './DropdownForm'

const GraphSidebar = ({ sidebar, rawData, data, onDropdownChange, style }) => (
	<div id='sidebar-form'>
		{
			Object.keys(sidebar).map(opt => {
				var unique
				if (sidebar[opt] == 'all') {
					unique = [...new Set(data.map(item => item[opt]?.toString()).filter(d => d))].sort()
				}
				else {
					unique = [...new Set(rawData.map(item => item[opt]?.toString()).filter(d => d))].sort()
				}
				// console.log(opt)
				// console.log(unique)
				return (
					<div className='checkbox' key={opt}>
						<ul>
							<li>
								<DropdownForm
									title={opt}
									onChange={onDropdownChange}
									default={sidebar[opt]}
									id={opt}
									options={['all'].concat(unique)}
									style={style}
									/>
							</li>
						</ul>
					</div>
				)
			})
		}
	</div>
);

export default GraphSidebar;