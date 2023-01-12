import { Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { isXS } from '../../App';
import { DayType } from '../../common';
import { Group } from './Group';

export function Day(props: DayType) {
	const [, setWidth] = useState(window.innerWidth)
	window.addEventListener('resize', () => setWidth(window.innerWidth))
	if (isXS)
		return <>
			< Typography component="h1" variant="h5" align="center" >
				{new Date(Date.parse(props.date)).toLocaleDateString()}
			</Typography >
			<Grid container spacing={3} sx={{ mt: 1 }}>
				{props.groups.map((group, index) => <Group {...group} key={index} />)}
			</Grid>
		</>
	else
		return <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, position: "relative" }}>
			<Typography component="h1" variant="h5" align="center">
				{new Date(Date.parse(props.date)).toLocaleDateString()}
			</Typography>
			<Grid container spacing={3} sx={{ mt: 1 }}>
				{props.groups.map((group, index) => <Group {...group} key={index} />)}
			</Grid>
		</Paper>
}