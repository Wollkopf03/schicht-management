import { Close } from '@mui/icons-material';
import { Paper, IconButton, TextField, Grid, Button } from '@mui/material';
import { Component } from 'react';
import { DayType, GroupType } from '../../common';
import { Group } from './Group';

type State = {
	date: string,
	groups: JSX.Element[]
}

type Props = {
	subscribe: (cb: () => DayType, key: number) => void,
	delete: (key: number) => void,
	id: number,
	data?: DayType
}

export class Day extends Component<Props, State> {

	state: State = {
		date: "",
		groups: []
	}

	componentDidMount(): void {
		if (this.props.data) {
			this.setState({ date: this.props.data.date })
			this.setState({
				groups: this.props.data.groups.map(group => <Group subscribe={this.subscribe} delete={this.delete} id={this.id} key={this.id++} data={group} />)
			})
		}
		this.props.subscribe(() => {
			return {
				date: this.state.date,
				groups: this.groups.map(cb => cb[1]())
			}
		}, this.props.id)
	}

	id = 0

	groups: ([number, () => GroupType])[] = []

	subscribe = (cb: () => GroupType, key: number) => {
		this.groups.push([key, cb])
	}

	delete = (key: number) => {
		this.groups = this.groups.filter(group => group[0] !== key)
		this.setState({
			groups: this.groups.map(group => <Group subscribe={this.subscribe} delete={this.delete} id={group[0]} key={group[0]} data={group[1]()} />)
		})
	}

	render() {
		return (
			<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, position: "relative" }}>
				<IconButton
					sx={{ position: "absolute", top: 0, right: 0 }}
					onClick={() => this.props.delete(this.props.id)}>
					<Close />
				</IconButton>
				<TextField sx={{ m: 1 }}
					label="Date"
					type="date"
					value={this.state.date}
					onChange={(e) => this.setState({ date: e.target.value })}
				/>
				<Grid container spacing={3} sx={{ mt: 1 }}>
					{this.state.groups}
					<Grid item sm={4}>
						<Button
							onClick={() => this.setState({ groups: [...this.state.groups, <Group subscribe={this.subscribe} delete={this.delete} id={this.id} key={this.id++} />] })}>
							+ Add new Group
						</Button>
					</Grid>
				</Grid>
			</Paper>
		)
	}
}