export const actionElements = [
	{
		type: 'button',
		label: 'Show Alert',
		action: buttonClicked,
	},
	{
		type: 'dropdown',
		label: 'Action Menu',
		actions: [
			{
				label: 'Show Current Timestamp',
				action: showCurrentTime,
			},
			{
				label: 'Show Random Number',
				action: showRandomNumber,
			},
			{
				label: 'Show App Name',
				action: showAppName,
			},
			{
				label: 'Show Company Name',
				action: showCompanyName,
			},
		],
	},
	{
		type: 'dropdown',
		label: 'Link Menu',
		actions: [
			{
				label: 'Google',
				link: '/',
			},
			{
				label: 'Yahoo',
				link: '/',
			},
			{
				label: 'Bing',
				link: '/',
			},
		],
	},
]

function buttonClicked() {
	alert('Button clicked!')
}

function showCurrentTime() {
	alert(Date.now())
}

function showRandomNumber() {
	alert(Math.floor(Math.random() * 100))
}

function showAppName() {
	alert('Stonecrop')
}

function showCompanyName() {
	alert('Agritheory')
}
