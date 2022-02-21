import React from 'react'
import Dashboard from '../../components/Dashboard.js'
import * as d3 from 'd3'

export default function Rennlist(props) {
	return (
		<Dashboard
			dataUrl='/api/data/rennlist'
			xValue='_mileage'
			yValue='_price'
			legendBy='year'
			sidebar={{
				_model: 'all',
				_submodel: 'Carrera S',
				_generation: '997',
				_transmission: 'manual',
				_cabriolet: 0,
				_drive: 'rwd',
				year: 'all',
			}}
			xOptions={{
				'post_time': {
					name: 'post_time',
					accessor: d => new Date( d['post_time']), 
					format: d => d3.timeFormat("%Y %b")(d),
					scale: d3.scaleLinear(),
						// .domain([
						// 	d3.min(data, (d) => new Date(d['post_time'])),
						// 	d3.max(data, (d) => new Date(d['post_time']))
						// ]),
				},
				'year': {
					name: 'year',
					accessor: d => d['year'],
					scale: d3.scaleLinear(),
						// .domain([
						// 	d3.min(data, (d) => d['year']),
						// 	d3.max(data, (d) => d['year'])
						// ]),
					// ticks: this.getUniqueItems(data, d=>d['year']).length
				},
				_price: { 
					label: 'price',
					accessor: d => d['_price'], 
					scale: d3.scaleLinear(),
						// .domain([
						// 	d3.min(data, (d) => d['_price']),
						// 	d3.max(data, (d) => d['_price'])
						// ]),
				},
				_mileage: {
					label: 'mileage',
					accessor: d => d['_mileage'],
					scale: d3.scaleLinear(),
						// .domain([
						// 	d3.min(data, (d) => d['_mileage']),
						// 	d3.max(data, (d) => d['_mileage'])
						// ]),
				}
			}}
			yOptions={{
				_price: { 
					label: 'price',
					accessor: d => d['_price'], 
					scale: d3.scaleLinear(),
						// .domain([
						// 	d3.min(data, (d) => d['_price']),
						// 	d3.max(data, (d) => d['_price'])
						// ]),
				},
				_mileage: {
					label: 'mileage',
					accessor: d => d._mileage,
					scale: d3.scaleLinear(),
				  // 	.domain([
						// 	d3.min(data, (d) => d['_mileage']),
						// 	d3.max(data, (d) => d['_mileage'])
						// ]),
				}
			}}
			legendOptions={{
				'_generation': {
					name: '_generation',
					accessor: d => d['_generation'], 
					scale: d3.scaleOrdinal(d3.schemeCategory10)
			  },
			  '_color': {
					name: '_color',
					accessor: d => d['_color'], 
					scale: d3.scaleOrdinal(d3.schemeCategory10),
			  },
				'post_time': {
					name: 'post_time',
					accessor: d => new Date( d['post_time']), 
					format: d => d3.timeFormat("%Y %b")(d),
					scale: d3.scaleLinear(['white', 'navy'])
					// 	.domain([
					// 		d3.min(data, d => new Date(d['post_time'])),
					// 		d3.max(data, d => new Date(d['post_time']))
					// 	]),
				},
				'year': {
					name: 'year',
					accessor: d => d['year'],
					scale: d3.scaleOrdinal(d3.schemeCategory10)
						// .domain(this.getUniqueItems(data, d=>d['year']).sort())
				},
				'_submodel': {
					name: 'submodel',
					accessor: d => d['_submodel'],
					scale: d3.scaleOrdinal(d3.schemeCategory10)
						// .domain(this.getUniqueItems(data, d=>d['_submodel']).sort())
				}
			}}
			tableOptions={{
				// '_id': { accessor: d => d._id },
				'post time': { 
					accessor: d => new Date(d.post_time), 
					Cell: d => d3.timeFormat("%Y-%m-%d %H:%M")(new Date(d.row.original.post_time)),
					width: '2fr',
				},
				'year': { accessor: d => d.year,  },
				'make': { accessor: d => d.make,  },
				'model': { accessor: d => d.model,  },
				'info': { 
					accessor: d => d._info,
					Cell: d => <a href={d.row.original.url} target='_blank' rel='noreferrer'>{d.value.replace(/\(\)\|/, '')}</a>,
					width: '4fr'
				 },
				
				'transmission': { accessor: d => d._transmission, width: '2fr', },				
				'drive': { accessor: d => d._drive,  },
				'color': { accessor: d => d._color,  },
				'mileage': { 
					id: 'mileage',
					accessor: d => d._mileage, 
					Cell: d => d3.format(",.2r")(d.value),//d => <div style={{'textAlign': 'right'}} >{d3.format(",.2r")(d.value)}</div>,

				},
				'price': { 
					id: 'price',
					accessor: d => d._price,
					Cell: d => d3.format("$,.2r")(d.value)//<div style={{'textAlign': 'right'}} >{d3.format("$,.2r")(d.value)}</div>,
				},
			}}
		sortTableBy={{id: 'post time', desc: true}}

		/>
	)
}