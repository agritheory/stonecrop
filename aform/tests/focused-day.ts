/** The calendar day focus is on, as the month shown and the day's number, or null when focus is on no day. */
export const focusedDay = () => {
	const focused = document.activeElement
	if (!focused?.classList.contains('date-cell')) return null
	return `${document.querySelector('.adatepicker th')?.textContent?.trim()} ${focused.textContent?.trim()}`
}
