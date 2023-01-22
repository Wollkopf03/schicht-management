

export type ProjectStructure = {
	expires: number,
	name: string,
	days: DayType[]
}

export type DayType = {
	date: string,
	groups: GroupType[]
}

export type GroupType = {
	name: string,
	shifts: ShiftType[]
}

export type ShiftType = {
	start: string
	end: string
	maxMembers: number,
	memberIDs: number[],
	globalID: number,
	timeSlot?: number
}