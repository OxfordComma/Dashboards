import React from 'react'
import Dashboard from '../../components/Dashboard.js'
import * as d3 from 'd3'

let _year = {
	name: '_year',
	scale: d3.scaleLinear(),
	min: 1980,
}

let _price = { 
	name: '_price',
	accessor: d => d['_price'], 
	scale: d3.scaleLinear(),
	format: d3.format('$,.0f')
}

let post_date = {
	name: 'post_date',
	accessor: d => new Date(d['post_date']),
	format: d3.utcFormat("%Y-%m-%d"),
	scale: d3.scaleLinear(),
}

export default function Craigslist(props) {
	return (
		<Dashboard
			dataUrl='/api/data/craigslist'
			xValue='_year'
			yValue='_price'
			legendBy='_year'
			sidebar={{
				_make: 'Mazda',
				_model: 'all',
			}}
			xOptions={{
				'_year': _year,
				_price: _price,
				post_date: post_date,
			}}
			yOptions={{
				_price: _price,
			}}
			legendOptions={{
				'_year': _year,
				'_make': '_make',
				'_model': '_model',
				'_price': _price,
				'post_date': post_date,
			}}
			tableOptions={{
			'post_date': { 
				accessor: d => d['post_date'],
				sortType: (a, b) => new Date(a.values['post_date']) - new Date(b.values['post_date']) > 0 ? 1 : -1,
				Cell: d => d3.utcFormat("%Y-%m-%d")(new Date(d.row.original['post_date'])),
				width: '2fr',
			},
			'year': { accessor: d => d['_year'],  },
			'make': { accessor: d => d['_make'],  },
			'model': { accessor: d => d['_model'],  },
			'title': { 
				accessor: d => d.title.replace(d._year, '').replace((new RegExp(d._make, 'i')), '').replace((new RegExp(d._model, 'i')), ''),
				width: '3fr',
			 },
			'price': { 
				id: 'price',
				accessor: d => d._price, 
				Cell: d => 
					<div style={{'textAlign': 'right'}} >
						<a href={d.row.original.url} target='_blank' rel='noreferrer'>
							{d3.format("$,.2r")(d.value)}
						</a>
					</div>,
			},
		}}
		sortTableBy={{id: 'post_date', desc: true}}

		/>
	)
}