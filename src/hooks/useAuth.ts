import jwtDecode from "jwt-decode"

export const getToken = () => localStorage.getItem('token')

export const setToken = (token: string) => localStorage.setItem('token', token)

export const deleteToken = () => {
	localStorage.clear()
	window.location.replace("/login")
}

export const getTokenData: () => { app: string, exp: number, user_email: string, user_id: number, user_name: string } = () => jwtDecode(getToken()!)