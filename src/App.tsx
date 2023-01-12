import { AppBar, createTheme, Grid, ThemeProvider, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Admin } from './admin/Admin'
import { getToken } from './hooks/useAuth'
import { Login } from './login/Login'
import { User } from './user/User'

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 740,
			md: 1090,
			lg: 1000,
			xl: 1236,
		}
	}
})

export var isXS: boolean

var globalID = 1
export const getGlobalID = () => globalID++
export const checkGlobalID = (id: number) => {
	if (globalID <= id)
		globalID = id + 1
}

export function App() {
	isXS = useMediaQuery(theme.breakpoints.down("sm"));
	const [, setWidth] = useState(window.innerWidth)
	useEffect(() => {
		function handleResize() {
			setWidth(window.innerWidth)
		}
		window.addEventListener('resize', handleResize)
	})

	if (!getToken() && window.location.pathname !== "/login") {
		window.location.replace("/login")
		return <></>
	}

	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<User />} />
					<Route path="/backend" element={<Admin />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
			<AppBar
				position="relative"
				color="default"
				sx={{
					width: '100%',
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					p: 0,
					borderTop: (theme) => `1px solid ${theme.palette.divider}`,
				}}
			>
				<Grid sx={{ display: 'flex' }}>
					<Typography sx={{
						position: 'relative',
						left: 5,
					}} variant="h6" color="rgba(0, 0, 0, 0.5)">
						by Lukas Wollmann
					</Typography>
					<Typography sx={{
						position: 'absolute',
						right: 5,
					}} variant="h6" color="rgba(0, 0, 0, 0.5)">
						v{process.env.REACT_APP_VERSION}
					</Typography>
				</Grid>
			</AppBar>
		</ThemeProvider>
	)
}
