import React from 'react'
import Dashboard from '../../components/Dashboard.js'
import * as d3 from "d3";

export default function FacebookMarketplace(props) {
	return (
		<Dashboard
			dataUrl='/api/data/fbmarketplace'
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
						// .domain(new Set(data.map(d=>d['_make'])).sort())
				},
				'_model': {
					name: 'model',
					accessor: d => d['_model'],
					scale: d3.scaleOrdinal(d3.schemeCategory10)
						// .domain(new Set(data.map(d=>d['_model'])).sort())
				}
			}}
			tableOptions={{
			'post_date': { 
				accessor: d => d['post_date'],
				sortType: (a, b) => new Date(a.values['post_date']) - new Date(b.values['post_date']) > 0 ? 1 : -1,
				width: 150,
				Cell: d => d3.utcFormat("%Y-%m-%d")(
						new Date(d.row.original['post_date']),
				 ),
			},
			'year': { accessor: d => d._year, width: 150 },
			'make': { accessor: d => d._make, width: 150 },
			'model': { accessor: d => d._model, width: 300 },
			'title': { 
				accessor: d => d.title.replace(d._year, '').replace(d._make, '').replace(d._model, ''),
				Cell: d => <a href={d.row.original.url} target='_blank' rel='noreferrer'>{d.value}</a>,
				width: 500
			 },
			'price': { 
				id: 'price',
				accessor: d => d._price, 
				width: 75,
				Cell: d => <div style={{'textAlign': 'right'}} >{d3.format("$,.2r")(d.value)}</div>,
			},
		}}
		sortTableBy={'post_date'}
		/>
	)
}