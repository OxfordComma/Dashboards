import React from 'react'
import styles from '../styles/Header.module.css'

export default function Header(props) {
	// console.log(props)
	let options=[ 
		{name: 'Rennlist', href: '/dash/rennlist'}, 
		{name: 'Craigslist', href: '/dash/craigslist'}, 
		{name: 'FB Marketplace', href: '/dash/fbmarketplace'}, 
	]
	return (
		<div className={styles.header}>
			{options.map(opt => {
				return <a href={opt.href}>{opt.name}</a>
			})}
		</div>
	)
}