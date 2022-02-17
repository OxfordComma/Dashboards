import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/index.module.css'
import Header from '../components/Header.js'
import Sidebar from '../components/Sidebar.js'
import PlaylistEdit from '../components/PlaylistEdit.js'
import ReactTable from '../components/ReactTable.js'
import Tags from '../components/Tags.js'
import React, { useState, useEffect } from 'react'
import { getSession, signIn, signOut } from "next-auth/react"
import buildFunction from '../lib/buildFunction.js'




// Show delete confirmation screen
function ConfirmDelete(props) {
	if (props.show) {
		return (
			<div className={styles.confirmdelete}>
				<div>
					Are you sure you&apos;d like <br/>
					to delete your playlist<br/>
					{props.playlist.name}?
				</div>
				<form onSubmit={props.callback} style={{'align-self':'center'}}>
					<button value='yes' type='submit'>yes</button>
					<button value='no' onClick={props.close}>no</button>
				</form>
			</div>
		)
	}
	else 
		return null
}

// Show loading screen
function Loading(props) {
	let [text, setText] = useState('Loading.\u00A0\u00A0')

	useEffect(() => {
		// if (props.show) {
		let intervalId = setTimeout(() => 
      setText((text) => {
      	// console.log(text)
      	if (text=='Loading...')
      		return 'Loading.\u00A0\u00A0'
      	if (text=='Loading.\u00A0\u00A0')
      		return 'Loading..\u00A0'
      	if (text=='Loading..\u00A0')
      		return 'Loading...'
    	})
    , 500);
	}, [text])
	return (
	<div className={styles.showloading}>
		{text}
	</div>
	)
}


class Home extends React.Component {
	constructor(props) {
		super(props)
		
		// this.buildFunction = this.buildFunction.bind(this)
		this.buildFunction = buildFunction.bind(this)

		this.addPlaylist = this.addPlaylist.bind(this)
		this.editPlaylist = this.editPlaylist.bind(this)
		this.copyPlaylist = this.copyPlaylist.bind(this)
		this.confirmDeletePlaylist = this.confirmDeletePlaylist.bind(this)
		this.deletePlaylist = this.deletePlaylist.bind(this)
		this.setSelectedPlaylistById = this.setSelectedPlaylistById.bind(this)
		this.addSourceToPlaylist = this.addSourceToPlaylist.bind(this)
		
		this.removeSource = this.removeSource.bind(this)
		this.savePlaylistAndSource = this.savePlaylistAndSource.bind(this)
		this.saveToSpotify = this.saveToSpotify.bind(this)

		this.selectTag = this.selectTag.bind(this)

		this.state = {
			playlists:[],
			sources: [],
			
			editingPlaylist: null,
			selectedTags: [],
			selectedPlaylist: null,
			confirmDeletePlaylist: null,
			showLoading: false
		}
	}

	setStateAsync(state) {
		console.log('set state async:', state)
	  return new Promise((resolve) => {
	    this.setState(state, resolve)
	  });
	}


	async componentDidMount() {
		console.log('componentDidMount')
		await this.setStateAsync({
			showLoading: true,
		})
		// }, async () => {

		let user = await fetch('/api/user').then(r => r.json())
		console.log('user loaded from database:', user)

		if (!user || (user.playlists.length == 0 && user.sources.length == 0))
			return
		
		// All playlists start out unmodified
		let playlists = user.playlists.map(p => {
			p.modified = false;
			return p
		})

		let sources = user.sources.map(s => {
			return {
				...s,
				tracks: []
			}
		})

		await this.setStateAsync({
			playlists: playlists,
			sources: sources,
		// }, async () => {
		})
		
		if (playlists.length > 0)
			await this.setSelectedPlaylistById(playlists[0].id)

		await this.setStateAsync({ showLoading: false })
		// })
		// })

	}


	// When new tracks are loaded, assign tags and the source (for the table)
	formatNewTracks = function(t, s) {
		t['source'] = s.name
		t['tags'] = t.artists.map(a => a.genres).flat()
		
		// Return any individual words within the genres too
		t.artists.map(a => a.genres).flat().filter(a => a).map(tag => {
			if (tag.includes(' '))
				t['tags'] = t['tags'].concat(tag.split(' '))
		})
		if (t['album']['release_date']) {
			let decadeTag = t['album']['release_date'].slice(0, 3)+'0s'
			t['tags'] = t['tags'].concat([decadeTag])	
		}
		
		return t
	}

	// Get playlist data after applying filters
	getRawData(id) {
		let playlists = this.state.playlists

		if (playlists.length == 0) 
			return []

		if (id)
			playlists = playlists.filter(p => p.id == id)

		let tracks = playlists.map(p => {
			let playlistData = p.sources.map(s => {
				let src = {
					...this.state.sources.filter(src => src.id == s.id)[0],
					...s
				}

				// Apply the source filters
				let tracks = src.tracks.filter(t => {
					let toReturn = true
					src.filters.map(f => {
						let func = this.buildFunction(f)
						if (!func(t))
							toReturn = false
					})

					return toReturn
				})

				return tracks
			}).flat()

			// Apply the playlist filters
			playlistData = playlistData.filter(t => {
				let toReturn = true
				p.filters.map(f => {
					let func = this.buildFunction(f)
					if (!func(t))
						toReturn = false
				})

				return toReturn
			})
			
			// Check for duplicates by artists and track name
			if (p.removeDuplicates)
				return playlistData.reduce((prev, curr) => {
					let formatName = item => (item.artists.map(a => a.name).join(', ') + ' ' + item.name).toLowerCase()
					return prev.map(formatName).includes(formatName(curr)) ? prev : prev.concat(curr)
				}, [])
			else
				return playlistData
		}).flat()
		
		return tracks
	}


	// Get data for selected playlist with tag filters
	getFilteredData(id) {
		let tracks = this.getRawData(id)

			// Check for selected tags in the sources
			tracks = tracks.filter(t => {
				// If no tags selected, show all
				if (this.state.selectedTags.length == 0)
					return true
				// If the tag is in the selected tags, show them all
				if (t.tags.filter(tag => this.state.selectedTags.includes(tag)).length > 0 )
					return true

				return false
			})
		
		return tracks
	}

	addPlaylist(event) {
		event.preventDefault()

		let newPlaylist = {
			id:  Math.random().toString(16).slice(2),
			name: 'New Playlist',
			uri: null,
			sources: [],
			filters: [],
			removeDuplicates: false,
			modified: true
		}
		console.log('add playlist:', newPlaylist)

		let playlists = this.state.playlists
		playlists.push(newPlaylist)

		this.setState({
			editingPlaylist: newPlaylist,
			selectedPlaylist: newPlaylist,
			playlists: playlists,
		})
	}

	editPlaylist(event, playlist) {
		event.preventDefault();

		playlist.modified = true
		console.log('edit playlist:', playlist)

		this.setState({ 
			editingPlaylist: playlist,
			selectedPlaylist: playlist
		})
	}

	copyPlaylist(event, playlist) {
		event.preventDefault();
		console.log('copy playlist:', playlist)

		playlist = {
			...playlist,
			name: 'Copy of ' + playlist.name,
			id: Math.random().toString(16).slice(2),
			uri: null,
			modified: true
		}

		let playlists = this.state.playlists
		let sources = this.state.sources

		playlists.push(playlist)

		// fetch('/api/user', { 
		// 	method: 'POST', 
		// 	body: JSON.stringify({
		// 		playlists: playlists,
		// 		sources: sources,
		// 	})
		// })

		this.setState({
			playlists: playlists,
			selectedPlaylist: playlist
		})


	}

	confirmDeletePlaylist(event, playlist) {
		event.preventDefault()
		console.log('confirm delete playlist:', playlist)

		this.setState({
			confirmDeletePlaylist: playlist,
		})		
	}

	deletePlaylist(event) {
		event.preventDefault();
		
		let playlist = this.state.confirmDeletePlaylist
		console.log('delete playlist:', playlist)

		fetch('/api/playlist', { 
			method: 'DELETE', 
			body: JSON.stringify({
				uri: playlist.uri
			})
		})//.then(d => d.json())

		let playlists = this.state.playlists.filter(p => p.id != playlist.id)
		let sources = this.state.sources
		// console.log('playlists:', playlists)

		// sources = sources.map(s => {
		// 	let copy = Object.assign({}, s)
		// 	delete copy.tracks
		// 	return copy
		// })

		// console.log('sources:', sources)

		// fetch('/api/user', { 
		// 	method: 'POST', 
		// 	body: JSON.stringify({
		// 		playlists: playlists,
		// 		sources: sources,
		// 	})
		// })

		this.setState({
			playlists: playlists,
			confirmDeletePlaylist: null,
			selectedPlaylist: this.state.playlists[0]
		})

		this.saveToSpotify(playlists, sources)
	}


	async setSelectedPlaylistById(id) {
		let selectedPlaylist = this.state.playlists.filter(p => p.id == id)[0]
		console.log('set selected playlist:', selectedPlaylist)

		await this.setStateAsync({
			showLoading: true,
		})
		// }, async () => {


		// source IDs for the playlist that was selected
		let selectedPlaylistSourceIds = selectedPlaylist.sources.map(s => s.id)
		// Find any state sources that don't have tracks loaded yet
		let sources = this.state.sources.filter(s => s.tracks.length == 0 && selectedPlaylistSourceIds.includes(s.id) )
		
		let sourcePromises = sources.map(s => {
			// If it is a playlist:
			if (s.sourceType == 'playlist')
				return fetch('/api/playlist?artistfeatures=true&trackfeatures=true&uri=' + s.uri)
					.then(r => r.json())
					.then(tracks => tracks.map(t => this.formatNewTracks(t, s)))

			// If it is liked songs:
			if (s.sourceType == 'liked songs')
				return fetch('/api/playlist?artistfeatures=true&trackfeatures=true&savedtracks=true&limit='+s.limit)
					.then(r => r.json())
					.then(tracks => tracks.map(t => this.formatNewTracks(t, s)))
		})

		let sourceResults = await Promise.all(sourcePromises)

		sources = sources.map((s, i) => {
			return {
				...s,
				tracks: sourceResults[i],
			}
		})

		await this.setStateAsync({
			selectedPlaylist: selectedPlaylist,
			sources: this.state.sources.filter(s => !sources.map(src => src.id).includes(s.id)).concat(sources),
			showLoading: false,
		})
		// })
		
	}

	addSourceToPlaylist(source) {
		console.log('add source to playlist:', source)

		if (!this.state.sources.map(s => s.id).includes(source.id)) {
			this.setState({
				sources: this.state.sources.filter(s => s.id != source.id).concat(source)
			})
		}
	}

	removeSource(id) {
		console.log('remove source:', id)

		// If the sources include the removed source, get rid of it
		if (this.state.sources.map(s => s.id).includes(id)) {
			this.setState({
				sources: this.state.sources.filter(s => s.id != id)
			})
		}

		// If any of the playlists include the removed source, get rid of them
		let playlists = this.state.playlists.map(p => {
			if (p.sources.map(s => s.id).includes(id)) {
				p.sources = p.sources.filter(src => src.id != id)
			}

			return p
		})

		this.setState({
			playlists: playlists
		})
	}
 

	async savePlaylistAndSource(playlist, source) {
		console.log('save playlist and source')

		let newPlaylists = this.state.playlists
		let newSources = this.state.sources
		this.setState({
			showLoading: true,
		}, async () => {



			if (source) {
				console.log('save source:', source)

				if (source.sourceType == 'playlist')
					source.tracks = await fetch('/api/playlist?artistfeatures=true&trackfeatures=true&uri=' + source.uri).then(d => d.json())
				
				if (source.sourceType == 'liked songs')
					source.tracks = await fetch('/api/playlist?artistfeatures=true&trackfeatures=true&savedtracks=true&limit='+source.limit).then(d => d.json())

				source.tracks = source.tracks.map(t => this.formatNewTracks(t, source))
				newSources = newSources.filter(s => s.id != source.id).concat(source)
				this.setState({
					editingPlaylist: playlist,
				})
			}

			if (playlist) {
				console.log('save playlist:', playlist)

				newPlaylists = newPlaylists.map(p => {
					if (p.id == playlist.id)
						return playlist
					return p
				})
				
				if (!newPlaylists.map(p => p.id).includes(playlist.id)) {
					console.log('new playlist?')
					newPlaylists = newPlaylists.concat(playlist)
				}

			}

			console.log('newPlaylists:', newPlaylists)
			console.log('newSources:', newSources)
			// console.log('state:', this.state)
			
			this.setState({
				sources: newSources,
				// editingPlaylist: playlist,
				playlists: newPlaylists,
				showLoading: false,
			// }, async () => {
				// await this.saveToSpotify([playlist])
			})

			if (!source) {
				this.setSelectedPlaylistById(playlist.id)
				await this.saveToSpotify(newPlaylists, newSources)
			}
		})
	}

	

	async saveToSpotify(playlists, sources) {

		// Send the playlist to the endpoint for all of the playlists

		playlists = await Promise.all(
			playlists.map(async p => {
				if (!p.modified)
					return p

				let tracks = this.getFilteredData(p.id)
				console.log('tracks for playlist ', p, ':', tracks)

				let newPlaylist = await fetch('/api/playlist', { 
					method: p.uri == null ? 'POST' : 'PUT',
					body: JSON.stringify({
						playlist: {
							uri: p.uri,
							name: p.name,
							trackUris: tracks.map(t => t.uri ),
						}
					})
				}).then(d => d.json())

				// If we created a new playlist, set the playlist URI
				if (p.uri == null) {
					p.uri = newPlaylist.uri
				}

				return p

			})
		)

		console.log('save playlists:', playlists)
		// Removed the modified variable before committing to the database
		playlists = playlists.map(p => {
			delete p.modified
			return p
		})

		// Remove the tracks object before committing to the database
		sources = sources.map(s => {
			let copy = Object.assign({}, s)
			delete copy.tracks
			return copy
		})


		// Update user object in mongo
		let response = await fetch('/api/user', { 
			method: 'POST', 
			body: JSON.stringify({
				playlists: playlists,
				sources: sources,
			})
		})
	}


	selectTag(event) {
		event.preventDefault()
		let tag = event.target.innerText
		console.log('select tag:', tag)

		if (this.state.selectedTags.includes(tag)) {
			this.setState({
				selectedTags: this.state.selectedTags.filter(t => t != tag)
			})
		}
		else {
			this.setState({
				selectedTags: this.state.selectedTags.concat([tag])
			})
		}
	}

	render() {
		console.log('index state:', this.state)
		return (
			<div className={styles.container}>
				<Header/>
				<Sidebar className={styles.sidebar} 
					playlists={this.state.playlists}
					selectedPlaylist={this.state.selectedPlaylist}
					setSelectedPlaylistById={this.setSelectedPlaylistById}
					addPlaylist={this.addPlaylist}
					copyPlaylist={this.copyPlaylist}
					editPlaylist={this.editPlaylist}
					confirmDeletePlaylist={this.confirmDeletePlaylist}
				/>

				<main className={styles.main}>
					<Tags
						data={this.getRawData(this.state.selectedPlaylist?.id)}
						selectTag={this.selectTag}
						selectedTags={this.state.selectedTags}
					/>
					<ReactTable
						data={this.getFilteredData(this.state.selectedPlaylist?.id)}
						options={{
							artist: { 
								accessor: d => d.artists[0].name, 
								// minWidth: 150,
							},
							track: { 
								accessor: d => d.name, 
								Cell: d => <a href={d.row.original.uri}>{d.row.original.name}</a>,
								// minWidth: 500,
							},
							album: {
								accessor: d => d.album.name,
								// minWidth: 150,
							},
							source: { 
								accessor: d => d.source,
								// minWidth: 100
							}
						}}
					/>
				</main>
				{this.state.editingPlaylist ? 
					<PlaylistEdit
						show={true} 
						data={this.getFilteredData(this.state.selectedPlaylist?.id)}
						selectedPlaylist={this.state.editingPlaylist}
						sources={this.state.sources}
						addSourceToPlaylist={this.addSourceToPlaylist}
						savePlaylistAndSource={this.savePlaylistAndSource}
						saveSource={this.saveSource}
						removeSource={this.removeSource}
						close={() => {
							// e.preventDefault();
							// if (
							// 	this.state.editingPlaylist.name == 'New Playlist' && 
							// 	this.state.editingPlaylist.sources.length == 0 && 
							// 	this.state.editingPlaylist.filters.length == 0 && 
							// 	this.state.editingPlaylist.uri == null
							// ) {
							// 	this.setState({
							// 		playlists: this.state.playlists.filter(p => p.id != this.state.editingPlaylist.id)
							// 	}, () => this.setState({ selectedPlaylist: this.state.playlists[2] }))
							// }
							this.setState({ editingPlaylist: null })
						}}
					/> : null}
				
				<ConfirmDelete
					show={this.state.confirmDeletePlaylist != null}
					callback={this.deletePlaylist}
					playlist={this.state.confirmDeletePlaylist}
					close={e => { 
						e.preventDefault();
						this.setState({ confirmDeletePlaylist: null })}
					}
				/>
				{this.state.showLoading ? <Loading/> : null}
			</div>
		)
	}
}

export default Home
