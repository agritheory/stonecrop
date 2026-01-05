import { makeWrapPlansPlugin } from 'postgraphile/utils'

import type { HookConfig, HookPlan } from '../types'

export const createPglRockfoilPlugin = (hookMap: HookConfig) => {
	const queryPlans: HookPlan = {}
	const mutationPlans: HookPlan = {}

	for (const [fieldname, plans] of Object.entries(hookMap)) {
		if (plans.beforeQuery || plans.afterQuery) {
			queryPlans[fieldname] = {
				plan: (plan, $source, fieldArgs, info) => {
					// Process before query hooks
					if (plans.beforeQuery) {
						plans.beforeQuery(plan, $source, fieldArgs, info)
					}

					// Execute the query plan
					let $result = plan()

					// Process after query hooks
					if (plans.afterQuery) {
						$result = plans.afterQuery($result, plan, $source, fieldArgs, info)
					}

					return $result
				},
			}
		}

		if (plans.beforeMutation || plans.afterMutation) {
			mutationPlans[fieldname] = {
				plan: (plan, $source, fieldArgs, info) => {
					// Process before mutation hooks
					if (plans.beforeMutation) {
						plans.beforeMutation(plan, $source, fieldArgs, info)
					}

					// Execute the mutation plan
					let $result = plan()

					// Process after mutation hooks
					if (plans.afterMutation) {
						$result = plans.afterMutation($result, plan, $source, fieldArgs, info)
					}

					return $result
				},
			}
		}
	}

	return makeWrapPlansPlugin({
		Query: queryPlans,
		Mutation: mutationPlans,
	})
}
