import React from "react";
// import Checkbox from './Checkbox.js'
import DropdownForm from './DropdownForm'

const GraphSidebar = ({ sidebar, data, onDropdownChange }) => (
	<div id='sidebar-form'>
		{
			Object.keys(sidebar).map(opt => {
				var unique = [...new Set(data.map(item => item[opt]))].sort()
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
									style={{width: 150+'px'}}
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