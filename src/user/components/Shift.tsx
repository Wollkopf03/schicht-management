import { Button, createTheme, Paper, ThemeProvider, Typography } from '@mui/material';
import { red, grey } from '@mui/material/colors';
import axios from 'axios';
import { API_BASE_URL } from '../..';
import { ProjectStructure, ShiftType } from '../../common';
import { getToken, getTokenData, setToken } from '../../hooks/useAuth';
import { authenticate } from '../../login/Login';
import { getData, getName, getUsers, update } from '../User';

const redButton = createTheme({
	palette: {
		primary: {
			main: red[600],
		},
		secondary: {
			main: red[400],
		},
	},
})

export function Shift(props: ShiftType) {
	const handleClick = async () => {
		var data: ProjectStructure | { error: string }
		if (props.memberIDs.indexOf(getTokenData().user_id) === -1) {
			data = await axios.post(API_BASE_URL + "participate/", {
				token: getToken(), project: getName(), shift: props.globalID
			})
				.then(response => response.data)
				.catch(error => { console.log(error); return null; });
		} else {
			data = await axios.post(API_BASE_URL + "cancelParticipation/", {
				token: getToken(), project: getName(), shift: props.globalID
			})
				.then(response => response.data)
				.catch(error => { console.log(error); return null; });
		}
		if ("error" in data) {
			console.log(data.error)
			switch (data.error) {
				case "Token expired":
					setToken((await authenticate(JSON.parse(localStorage.getItem("credentials")!))).token!);
					handleClick()
					break
			}
			return;
		}
		update()
	}

	var slotAlreadyTaken = false
	getData().days.forEach(day => {
		day.groups.forEach(group => {
			group.shifts.forEach(shift => {
				if (shift.timeSlot && shift.timeSlot === props.timeSlot && shift.memberIDs.indexOf(getTokenData().user_id) !== -1)
					slotAlreadyTaken = true
			})
		})
	})
	if (props.memberIDs.length === 0 && getData().expires < Date.now() / 1000)
		return <></>
	return (
		<Paper variant="outlined" sx={{ my: 1, p: 2, position: "relative" }}>
			<Typography>
				{props.start} - {props.end}
			</Typography>
			{
				getData().expires > Date.now() / 1000 &&
				<Typography color={props.memberIDs.length === props.maxMembers ? "red" : "green"}>
					{props.memberIDs.length} / {props.maxMembers} belegt
				</Typography>
			}
			<Typography color={grey[600]}>
				{props.memberIDs.map((id, index) => <span key={index}>{getUsers()[id]}<br /></span>)}
			</Typography>
			{
				getData().expires > Date.now() / 1000 && (
					props.memberIDs.indexOf(getTokenData().user_id) === -1 ?
						props.timeSlot && slotAlreadyTaken ?
							<Button variant="contained" sx={{ mt: 1 }} disabled>Kann nicht belegt werden</Button> :
							props.memberIDs.length >= props.maxMembers ?
								<Button variant="contained" sx={{ mt: 1 }} disabled>Leider belegt</Button> :
								<Button variant="contained" sx={{ mt: 1 }} onClick={handleClick}>Teilnehmen</Button> :
						<ThemeProvider theme={redButton}>
							<Button variant="contained" sx={{ mt: 1, background: "red" }} onClick={handleClick}>Nicht mehr teilnehmen</Button>
						</ThemeProvider>)
			}
		</Paper >
	)
}
