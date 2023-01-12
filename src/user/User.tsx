import { Logout } from '@mui/icons-material';
import { AppBar, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { Component } from 'react';
import { API_BASE_URL } from '..';
import { ProjectStructure } from '../common';
import { deleteToken, getToken, setToken } from '../hooks/useAuth';
import { authenticate } from '../login/Login';
import { Day } from './components/Day';

type State = {
	name: string,
	projects: string[],
	days: JSX.Element[]
}

var name = ""
export const getName = () => name
const setName = (newName: string) => { name = newName }

var updatefunction: (name: string) => void
export const update = () => updatefunction(getName())
const setUpdate = (cb: (name: string) => void) => { updatefunction = cb }

var globalData: ProjectStructure
export const getData = () => globalData

var users: string[]
export const getUsers = () => users

export class User extends Component<{}, State> {
	state: State = {
		name: "",
		projects: [],
		days: []
	}

	id = 0

	componentDidMount(): void {
		this.getProjects()
		this.getUsers()
		setUpdate(this.update)
	}

	logout = () => {
		setToken("")
		localStorage.removeItem("credentials")
		window.location.replace("/login")
	}

	getProjects = async () => {
		const data: { projects: string[] } = await axios.post(API_BASE_URL + "listProjects/", { token: getToken() })
			.then(response => response.data)
			.catch(error => { console.log(error); return null; });
		if ("error" in data) {
			console.log(data.error)
			switch (data.error) {
				case "Token expired":
					const token = (await authenticate(JSON.parse(localStorage.getItem("credentials")!))).token
					if (token)
						setToken(token);
					else
						deleteToken()
					this.getProjects()
					break
			}
			return;
		}
		this.setState({ projects: data.projects })
	}

	getUsers = async () => {
		const data: { users: string[] } = await axios.post(API_BASE_URL + "getUsernames/", { token: getToken() })
			.then(response => response.data)
			.catch(error => { console.log(error); return null; });
		if ("error" in data) {
			console.log(data.error)
			switch (data.error) {
				case "Token expired":
					const token = (await authenticate(JSON.parse(localStorage.getItem("credentials")!))).token
					if (token)
						setToken(token);
					else
						deleteToken()
					this.getUsers()
					break
			}
			return;
		}
		users = data.users
	}

	update = async (name: string) => {
		this.setState({ name })
		setName(name)
		const data: ProjectStructure | { error: string } = await axios.post(API_BASE_URL + "load/", {
			token: getToken(), name
		})
			.then(response => response.data)
			.catch(error => { console.log(error); return null; });
		if ("error" in data) {
			console.log(data.error)
			switch (data.error) {
				case "Token expired":
					const token = (await authenticate(JSON.parse(localStorage.getItem("credentials")!))).token
					if (token)
						setToken(token);
					else
						deleteToken()
					this.update(name)
					break
			}
			return;
		}
		this.setState({
			days: data.days.map(day => <Day key={this.id++} {...day} />),
		})
		globalData = data
	}

	render() {
		return (
			<>
				<AppBar
					position="relative"
					color="default"
					sx={{
						width: '100%',
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						p: 0,
						borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
						zIndex: 999
					}}
				>
					<Grid sx={{ display: 'flex' }}>
						<Tooltip title="Logout">
							<IconButton
								sx={{ m: 1 }}
								onClick={this.logout}>
								<Logout sx={{ color: "#ff0000" }} />
							</IconButton>
						</Tooltip>
					</Grid>
				</AppBar>
				<Container maxWidth="xl" sx={{ mb: 8 }}>
					<Paper variant="outlined" sx={{ md: { xs: 3, md: 6 }, mt: 10, p: { xs: 2, md: 3 } }}>
						<Typography component="h1" variant="h4" align="center">
							{process.env.REACT_APP_NAME}
						</Typography>
						<FormControl sx={{ m: 1, width: "40%" }}>
							<InputLabel id="projectLabel">Projekt</InputLabel>
							<Select
								labelId="projectLabel"
								id="project"
								value={this.state.name}
								label="Projekt"
								onChange={(e) => this.update(e.target.value)}
							>
								{this.state.projects.map(project => <MenuItem value={project} key={project}>{project}</MenuItem>)}
							</Select>
						</FormControl>
						{this.state.days}
					</Paper>
				</Container>
			</>
		)
	}
}