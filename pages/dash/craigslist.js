import React from 'react'
import Dashboard from '../../components/Dashboard.js'
import * as d3 from 'd3'

export default function Craigslist(props) {
	return (
		<Dashboard
			dataUrl='/api/data/craigslist'
			xValue='_year'
			yValue='_price'
			legendBy='_model'
			sidebar={{
				_make: 'Mazda',
				_model: 'all',
			}}
			xOptions={{
				'_year': {
					name: '_year',
					accessor: d => d['_year'],
					scale: d3.scaleLinear(),
				},
				_price: { 
					label: 'price',
					accessor: d => d['_price'], 
					scale: d3.scaleLinear(),
				},
				_mileage: {
					label: 'mileage',
					accessor: d => d['_mileage'],
					scale: d3.scaleLinear(),
				},
				post_date: {
					label: 'post_date',
					accessor: d => new Date(d['post_date']),
					format: d3.utcFormat("%Y-%m-%d"),
					scale: d3.scaleTime(),
				}
			}}
			yOptions={{
				_price: { 
					label: 'price',
					accessor: d => d['_price'], 
					scale: d3.scaleLinear(),
				},
				_mileage: {
					label: 'mileage',
					accessor: d => d._mileage,
					scale: d3.scaleLinear(),
				}
			}}
			legendOptions={{
				'_make': {
					name: 'make',
					accessor: d => d['_make'],
					scale: d3.scaleOrdinal(d3.schemeCategory10)
						// .domain(this.getUniqueItems(data, d=>d['_make']).sort())
				},
				'_model': {
					name: 'model',
					accessor: d => d['_model'],
					scale: d3.scaleOrdinal(d3.schemeCategory10)
						// .domain(this.getUniqueItems(data, d=>d['_model']).sort())
				},
				'_year': {
					name: 'year',
					accessor: d => d['_year'],
					scale: d3.scaleOrdinal(d3.schemeCategory10)
				}
			}}
			tableOptions={{
			'post_date': { 
				accessor: d => d['post_date'],
				sortType: (a, b) => new Date(a.values['post_date']) - new Date(b.values['post_date']) > 0 ? 1 : -1,
				Cell: d => d3.utcFormat("%Y-%m-%d")(
						new Date(d.row.original['post_date']),
				 ),
				width: '2fr',
			},
			'year': { accessor: d => d._year,  },
			'make': { accessor: d => d._make,  },
			'model': { accessor: d => d._model,  },
			'title': { 
				accessor: d => d.title.replace(d._year, '').replace(d._make, '').replace(d._model, ''),
				width: '3fr',
			 },
			'price': { 
				id: 'price',
				accessor: d => d._price, 
				Cell: d => 
					<div style={{'textAlign': 'right'}} >
						<a href={d.row.original.url} target='_blank' rel='noreferrer'>{d3.format("$,.2r")(d.value)}
						</a>
					</div>,
			},
		}}
		sortTableBy={{id: 'post_date', desc: true}}


		/>
	)
}