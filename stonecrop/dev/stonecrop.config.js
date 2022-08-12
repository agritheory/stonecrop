// import stonecrophttpclient from 'stonecrophttpclient'

// expected keys
let config = {}

config.app = {
	name: 'Test App',
	publisher: 'AgriTheory',
	email: 'support@agritheory.com',
	repo: 'https://github.com/agritheory/stonecrop',
	requirements: [],
}

config.routes = {}
config.events = {
	server: {},
	client: {},
	common: {},
}
// config.client = stonecrophttpclient
config.customComponents = []

export default { config }
