import { Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { isXS } from '../../App';
import { GroupType } from '../../common';
import { Shift } from './Shift';

export function Group(props: GroupType) {
	const [, setWidth] = useState(window.innerWidth)
	window.addEventListener('resize', () => setWidth(window.innerWidth))
	return (
		<Grid item md={4} sm={6} xs={12}>
			{isXS ?
				<>
					<Typography component="h1" variant="h5" align="center">
						{props.name}
					</Typography>
					{props.shifts.map((shift, index) => <Shift {...shift} key={index} />)}<br />
				</> :
				<Paper variant="outlined" sx={{ p: 2, position: "relative" }}>
					<Typography component="h1" variant="h5" align="center">
						{props.name}
					</Typography>
					{props.shifts.map((shift, index) => <Shift {...shift} key={index} />)}<br />
				</Paper>
			}
		</Grid>
	)
}