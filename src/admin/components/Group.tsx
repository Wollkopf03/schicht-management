import { Close } from '@mui/icons-material';
import { Grid, Paper, IconButton, TextField, Button } from '@mui/material';
import { Component } from 'react';
import { getGlobalID } from '../../App';
import { GroupType, ShiftType } from '../../common';
import { Shift } from './Shift';

type State = {
	name: string,
	shifts: JSX.Element[]
}

type Props = {
	subscribe: (cb: () => GroupType, key: number) => void,
	delete: (key: number) => void,
	id: number,
	data?: GroupType
}

export class Group extends Component<Props, State> {

	state: State = {
		name: "",
		shifts: []
	}

	componentDidMount(): void {
		if (this.props.data) {
			this.setState({ name: this.props.data.name })
			this.setState({
				shifts: this.props.data.shifts.map(shift =>
					<Shift
						subscribe={this.subscribe}
						delete={this.delete}
						globalID={shift.globalID}
						key={shift.globalID}
						data={shift} />
				)
			})
		}
		this.props.subscribe(() => {
			return {
				name: this.state.name,
				shifts: this.shifts.map(cb => cb[1]())
			}
		}, this.props.id)
	}

	shifts: ([number, () => ShiftType, () => number | undefined])[] = []

	subscribe = (getData: () => ShiftType, getTimeSlot: () => number | undefined, key: number) => {
		this.shifts.push([key, getData, getTimeSlot])
	}

	delete = (key: number) => {
		this.shifts = this.shifts.filter(shift => shift[0] !== key)
		this.setState({
			shifts: this.shifts.map(shift =>
				<Shift
					subscribe={this.subscribe}
					delete={this.delete}
					globalID={shift[0]}
					key={shift[0]}
					data={shift[1]()} />)
		})
	}
	getNextTimeSlot = () => {
		var lastTimeSlot = 0
		this.shifts.forEach(cb => {
			var timeSlot = cb[2]()
			if (timeSlot !== undefined)
				if (timeSlot >= lastTimeSlot)
					lastTimeSlot = timeSlot + 1
		})
		return lastTimeSlot
	}

	render() {
		return (
			<Grid item sm={4} >
				<Paper variant="outlined" sx={{ p: 2, position: "relative" }}>
					<IconButton
						sx={{ position: "absolute", top: 0, right: 0 }}
						onClick={() => this.props.delete(this.props.id)}>
						<Close />
					</IconButton>
					<TextField sx={{ m: 1 }}
						label="Name"
						value={this.state.name}
						onChange={(e) => this.setState({ name: e.target.value })}
					/>
					{this.state.shifts}
					<br />
					<Button
						onClick={() => {
							const id = getGlobalID()
							this.setState({
								shifts: [...this.state.shifts,
								<Shift
									subscribe={this.subscribe}
									delete={this.delete}
									globalID={id} key={id}
									timeSlot={this.getNextTimeSlot()} />
								]
							})
						}}>
						+ Add new shift
					</Button>
				</Paper>
			</Grid>
		)
	}
}