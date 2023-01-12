import { Logout } from '@mui/icons-material';
import { AppBar, Button, Checkbox, Container, FormControlLabel, FormGroup, Grid, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { Component } from 'react';
import { API_BASE_URL } from '..';
import { DayType, ProjectStructure } from '../common';
import { deleteToken, getToken, setToken } from '../hooks/useAuth';
import { authenticate } from '../login/Login';
import { Day } from './components/Day';

type State = {
	name: string,
	days: JSX.Element[],
	enableTimeSlots: boolean
}

export var getEnableTimeSlots: () => boolean
const setEnableTimeSlots = (cb: () => boolean) => getEnableTimeSlots = cb

export class Admin extends Component<{}, State> {
	state: State = {
		name: "",
		days: [],
		enableTimeSlots: false
	}

	id = 0

	days: ([number, () => DayType])[] = []

	componentDidMount(): void {
		setEnableTimeSlots(() => this.state.enableTimeSlots)
	}

	subscribe = (cb: () => DayType, key: number) => {
		this.days.push([key, cb])
	}

	delete = (key: number) => {
		this.days = this.days.filter(day => day[0] !== key)
		this.setState({
			days: this.days.map(day => <Day subscribe={this.subscribe} delete={this.delete} id={day[0]} key={day[0]} data={day[1]()} />)
		})
	}

	logout = () => {
		setToken("")
		window.location.replace("/login")
	};

	save = async () => {
		const data: { error: string } | { success: boolean } = await axios.post(API_BASE_URL + "save/", {
			token: getToken(), data: JSON.stringify({ name: this.state.name, days: this.days.map(day => day[1]()) })
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
					this.save()
					break
			}
		}
	}

	load = async () => {
		const data: ProjectStructure | { error: string } = await axios.post(API_BASE_URL + "load/", {
			token: getToken(), name: this.state.name
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
					this.load()
					break
			}
			return;
		}
		this.days = []
		this.setState({ days: [] })
		this.setState({
			days: data.days.map(day => <Day subscribe={this.subscribe} delete={this.delete} id={this.id} key={this.id++} data={day} />)
		})
	}

	toggleEnableTimeSlots = () => {
		this.setState({ enableTimeSlots: !this.state.enableTimeSlots })
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
						<Grid container />
						<Tooltip title="Load">
							<Button
								sx={{ m: 1 }}
								variant='outlined'
								onClick={this.load}
							>Load</Button>
						</Tooltip>
						<Tooltip title="Save">
							<Button
								sx={{ m: 1 }}
								variant='contained'
								onClick={this.save}
							>Save</Button>
						</Tooltip>

					</Grid>
				</AppBar>
				<Container maxWidth="xl" sx={{ mb: 8 }}>
					<Paper variant="outlined" sx={{ md: { xs: 3, md: 6 }, mt: 10, p: { xs: 2, md: 3 } }}>
						<Typography component="h1" variant="h4" align="center">
							{process.env.REACT_APP_NAME}
						</Typography>
						<TextField sx={{ m: 1 }}
							label="Name"
							value={this.state.name}
							onChange={(e) => this.setState({ name: e.target.value })}
						/><br />
						<FormGroup>
							<FormControlLabel control={
								<Checkbox onClick={this.toggleEnableTimeSlots} />}
								label={(this.state.enableTimeSlots ? "Dis" : "En") + "able Time Slots"}
							/>
						</FormGroup>
						{this.state.days}
						<Button
							onClick={() => this.setState({ days: [...this.state.days, <Day subscribe={this.subscribe} delete={this.delete} id={this.id} key={this.id++} />] })}>
							+ Add new Day
						</Button>
					</Paper>
				</Container>
			</>
		)
	}
}