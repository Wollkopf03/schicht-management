import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Paper, TextField } from "@mui/material";
import { Component } from 'react';
import { checkGlobalID, getGlobalID } from '../../App';
import { ShiftType } from '../../common';
import { getEnableTimeSlots } from '../Admin';

type Props = {
	subscribe: (getData: () => ShiftType, getTimeSlot: () => number | undefined, key: number) => void,
	delete: (key: number) => void,
	globalID: number,
	data?: ShiftType,
	timeSlot?: number
}

export class Shift extends Component<Props, ShiftType> {

	state: ShiftType = {
		start: "",
		end: "",
		maxMembers: 1,
		memberIDs: [],
		globalID: 0,
		timeSlot: 0
	}

	componentDidMount(): void {
		if (this.props.data) {
			this.setState({ ...this.props.data })
		} else
			this.setState({ globalID: getGlobalID() })
		if (this.props.timeSlot !== undefined)
			this.setState({ timeSlot: this.props.timeSlot })
		this.props.subscribe(this.getData, this.getTimeSlot, this.props.globalID)
		checkGlobalID(this.props.globalID)
		console.log(this.props.timeSlot)

	}

	getData = () => getEnableTimeSlots() ? {
		start: this.state.start,
		end: this.state.end,
		maxMembers: this.state.maxMembers,
		memberIDs: this.state.memberIDs,
		globalID: this.props.globalID,
		timeSlot: this.state.timeSlot
	} : {
		start: this.state.start,
		end: this.state.end,
		maxMembers: this.state.maxMembers,
		memberIDs: this.state.memberIDs,
		globalID: this.props.globalID
	}


	getTimeSlot = () => this.state.timeSlot

	render() {
		return (
			<Paper variant="outlined" sx={{ my: 1, p: 2, position: "relative" }}>
				<IconButton
					sx={{ position: "absolute", top: 0, right: 0 }}
					onClick={() => this.props.delete(this.props.globalID)}>
					<CloseIcon />
				</IconButton>
				<TextField sx={{ m: 1 }}
					label="Start"
					type="time"
					value={this.state.start}
					onChange={(e) => this.setState({ start: e.target.value })}
				/>
				<TextField sx={{ m: 1 }}
					label="End"
					type="time"
					value={this.state.end}
					onChange={(e) => this.setState({ end: e.target.value })}
				/>
				<TextField sx={{ m: 1 }}
					label="Max Members"
					type="number"
					value={this.state.maxMembers}
					onChange={(e) => this.setState({ maxMembers: Number(e.target.value) })}
				/>
				<TextField sx={{ m: 1 }}
					label="Time Slot"
					type="number"
					value={this.state.timeSlot}
					onChange={(e) => this.setState({ timeSlot: Number(e.target.value) })}
				/>
			</Paper>
		)
	}
}