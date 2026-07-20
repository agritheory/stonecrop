import { loadDoctypesFromObject } from '@stonecrop/graphql-middleware'

import userDoctype from '../doctypes/user.json'
import orderDoctype from '../doctypes/order.json'

export default defineNitroPlugin(() => {
	loadDoctypesFromObject({ User: userDoctype, Order: orderDoctype })
})
