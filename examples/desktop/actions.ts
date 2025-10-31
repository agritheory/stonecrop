/**
 * Field trigger action functions for the Desktop example
 * This demonstrates the field trigger system in action
 */
import {
	registerGlobalAction,
	registerTransitionAction,
	getGlobalTriggerEngine,
	type FieldChangeContext,
	type TransitionChangeContext,
} from '@stonecrop/stonecrop'
import { reactive } from 'vue'

// ============= DEBUGGING AND NOTIFICATIONS =============

// Notification interface
interface Notification {
	id: string
	message: string
	type: 'info' | 'success' | 'warning' | 'error'
	timestamp: Date
}

// Reactive notifications array for UI
export const notifications = reactive<Notification[]>([])

let notificationId = 0

export function addNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
	const notification = {
		id: `notif-${++notificationId}`,
		message,
		type,
		timestamp: new Date(),
	}
	notifications.push(notification)

	// Auto-remove after 5 seconds for info/success, 8 seconds for warnings/errors
	const timeout = ['warning', 'error'].includes(type) ? 8000 : 5000
	setTimeout(() => {
		const index = notifications.findIndex(n => n.id === notification.id)
		if (index > -1) {
			notifications.splice(index, 1)
		}
	}, timeout)
}

export function removeNotification(id: string) {
	const index = notifications.findIndex(n => n.id === id)
	if (index > -1) {
		notifications.splice(index, 1)
	}
}

// ============= NAME VALIDATION ACTIONS =============

registerGlobalAction('validateName', (context: FieldChangeContext) => {
	const { fieldname, afterValue } = context

	if (!afterValue || typeof afterValue !== 'string') {
		addNotification(`${fieldname} cannot be empty`, 'warning')
		return
	}

	if (afterValue.length < 2) {
		addNotification(`${fieldname} must be at least 2 characters long`, 'warning')
	} else if (afterValue.length > 50) {
		addNotification(`${fieldname} is too long (max 50 characters)`, 'warning')
	} else {
		addNotification(`${fieldname} validated successfully`, 'success')
	}
})

registerGlobalAction('updateFullName', (context: FieldChangeContext) => {
	const { path, afterValue } = context

	// This would typically update a computed full_name field
	// For demo purposes, we'll just show a notification
	addNotification(`Full name updated due to ${context.fieldname} change to "${afterValue}"`, 'info')
})

// ============= PHONE VALIDATION ACTIONS =============

registerGlobalAction('validatePhoneFormat', (context: FieldChangeContext) => {
	const { afterValue } = context

	if (!afterValue) return

	// Simple phone validation - you could use a more sophisticated library
	const phoneRegex = /^\+?[\d\s\-\(\)]+$/

	if (!phoneRegex.test(afterValue)) {
		addNotification('Phone number format is invalid', 'error')
	} else if (afterValue.length < 10) {
		addNotification('Phone number seems too short', 'warning')
	} else {
		addNotification('Phone number format is valid', 'success')
	}
})

registerGlobalAction('notifyPhoneChange', (context: FieldChangeContext) => {
	const { beforeValue, afterValue } = context

	if (beforeValue !== afterValue) {
		addNotification(`Phone number changed from "${beforeValue || 'empty'}" to "${afterValue || 'empty'}"`, 'info')
	}
})

// ============= EMAIL VALIDATION ACTIONS =============

registerGlobalAction('validateEmailFormat', (context: FieldChangeContext) => {
	const { afterValue } = context

	if (!afterValue) return

	// Simple email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (!emailRegex.test(afterValue)) {
		addNotification('Email format is invalid', 'error')
	} else {
		addNotification('Email format is valid', 'success')
	}
})

// ============= NOTES VALIDATION ACTIONS =============

registerGlobalAction('validateNotes', (context: FieldChangeContext) => {
	const { afterValue } = context

	if (afterValue && typeof afterValue === 'string') {
		if (afterValue.length > 500) {
			addNotification('Notes are quite long. Consider keeping them concise.', 'warning')
		} else if (afterValue.length > 50) {
			addNotification('Good notes provided', 'success')
		}
	}
})

// ============= ISSUE-SPECIFIC ACTIONS =============

registerGlobalAction('validateSubject', (context: FieldChangeContext) => {
	const { afterValue } = context

	if (!afterValue || typeof afterValue !== 'string') {
		addNotification('Issue subject is required', 'error')
		return
	}

	if (afterValue.length < 5) {
		addNotification('Issue subject should be more descriptive (min 5 characters)', 'warning')
	} else if (afterValue.length > 100) {
		addNotification('Issue subject is too long (max 100 characters)', 'warning')
	} else {
		addNotification('Issue subject looks good', 'success')
	}
})

registerGlobalAction('onStatusChange', (context: FieldChangeContext) => {
	const { beforeValue, afterValue } = context

	if (beforeValue !== afterValue) {
		addNotification(`Issue status changed from "${beforeValue || 'none'}" to "${afterValue}"`, 'info')

		// Demo: Automatic actions based on status
		if (afterValue === 'Resolved') {
			addNotification('🎉 Issue marked as resolved! Consider adding resolution notes.', 'success')
		} else if (afterValue === 'Closed') {
			addNotification('📁 Issue closed. Thank you for your work!', 'info')
		} else if (afterValue === 'In Progress') {
			addNotification('⚡ Issue is now in progress. Good luck!', 'info')
		}
	}
})

registerGlobalAction('onPriorityChange', (context: FieldChangeContext) => {
	const { beforeValue, afterValue } = context

	if (beforeValue !== afterValue) {
		addNotification(`Priority changed from "${beforeValue || 'none'}" to "${afterValue}"`, 'info')

		if (afterValue === 'Critical') {
			addNotification('🚨 CRITICAL priority set! This needs immediate attention.', 'warning')
		} else if (afterValue === 'High') {
			addNotification('⚠️ High priority issue - please address soon.', 'warning')
		}
	}
})

registerGlobalAction('validatePriorityStatus', (context: FieldChangeContext) => {
	// This would typically check other fields in the record
	// For demo, we'll just validate the priority itself
	const { afterValue } = context

	if (afterValue === 'Critical') {
		// In a real app, you might check if status is appropriate for critical priority
		addNotification('Critical priority issues should have immediate attention', 'info')
	}
})

registerGlobalAction('validateDescription', (context: FieldChangeContext) => {
	const { afterValue } = context

	if (afterValue && typeof afterValue === 'string') {
		if (afterValue.length > 1000) {
			addNotification('Description is quite long. Consider breaking it into smaller sections.', 'info')
		} else if (afterValue.length > 50) {
			addNotification('Good detailed description provided', 'success')
		}
	}
})

registerGlobalAction('validateFutureDate', (context: FieldChangeContext) => {
	const { afterValue } = context

	if (afterValue) {
		const selectedDate = new Date(afterValue)
		const today = new Date()
		today.setHours(0, 0, 0, 0) // Reset time for date comparison

		if (selectedDate < today) {
			addNotification('⚠️ Selected date is in the past', 'warning')
		} else if (selectedDate.getTime() === today.getTime()) {
			addNotification('📅 Due date is today', 'info')
		} else {
			addNotification('📅 Future date selected', 'success')
		}
	}
})

// ============= GENERIC ACTIONS =============

registerGlobalAction('updateTimestamp', (context: FieldChangeContext) => {
	// This would typically update a "modified" or "last_updated" field
	addNotification(`Record timestamp updated due to ${context.fieldname} change`, 'info')
})

registerGlobalAction('logFieldChange', (context: FieldChangeContext) => {
	const { path, fieldname, beforeValue, afterValue, operation, timestamp } = context

	console.log('🔄 Field Change Log:', {
		path,
		field: fieldname,
		from: beforeValue,
		to: afterValue,
		operation,
		timestamp: timestamp.toISOString(),
	})

	// Show a subtle notification for field changes
	addNotification(`Field "${fieldname}" changed`, 'info')
})

// ============= DOCTYPE FIELD TRIGGER REGISTRATION =============
// Register field triggers for actual doctype names that HST will use
// HST should generate paths like "todo-form.123.first_name" using doctype.slug

const engine = getGlobalTriggerEngine()
if (engine) {
	// Register field triggers for actual doctype names from the server
	// These match the doctype names defined in server.ts

	// Todo form field triggers (doctype: "todo-form")
	engine.registerDoctypeActions(
		'todo-form',
		new Map([
			['first_name', ['validateName', 'updateFullName', 'logFieldChange']],
			['last_name', ['validateName', 'updateFullName', 'logFieldChange']],
			['phone', ['validatePhoneFormat', 'notifyPhoneChange', 'logFieldChange']],
			['email', ['validateEmailFormat', 'logFieldChange']],
			['notes', ['validateNotes', 'logFieldChange']],
		])
	)

	// Todo list field triggers (doctype: "todo-list")
	engine.registerDoctypeActions(
		'todo-list',
		new Map([
			['first_name', ['validateName', 'updateFullName', 'logFieldChange']],
			['last_name', ['validateName', 'updateFullName', 'logFieldChange']],
			['phone', ['validatePhoneFormat', 'notifyPhoneChange', 'logFieldChange']],
		])
	)

	// Issue form field triggers (doctype: "issue-form")
	engine.registerDoctypeActions(
		'issue-form',
		new Map([
			['subject', ['validateSubject', 'logFieldChange']],
			['status', ['onStatusChange', 'validatePriorityStatus', 'updateTimestamp', 'logFieldChange']],
			['priority', ['onPriorityChange', 'validatePriorityStatus', 'logFieldChange']],
			['description', ['validateDescription', 'logFieldChange']],
			['due_date', ['validateFutureDate', 'updateTimestamp', 'logFieldChange']],
		])
	)

	// Issue list field triggers (doctype: "issue-list")
	engine.registerDoctypeActions(
		'issue-list',
		new Map([
			['subject', ['validateSubject', 'logFieldChange']],
			['status', ['onStatusChange', 'logFieldChange']],
			['priority', ['onPriorityChange', 'logFieldChange']],
		])
	)
}

// ============= XSTATE TRANSITION ACTIONS =============
// These are transition actions that follow the uppercase convention
// They are automatically triggered when XState FSM transitions occur

registerTransitionAction('SAVE', (context: TransitionChangeContext) => {
	const { doctype, recordId, currentState, targetState, fsmContext } = context

	console.log('💾 SAVE Transition:', {
		doctype,
		recordId,
		from: currentState,
		to: targetState,
		fsmContext,
	})

	addNotification(`💾 Saving ${doctype} record ${recordId}...`, 'info')

	// Simulate save operation
	setTimeout(() => {
		addNotification(`✅ ${doctype} record ${recordId} saved successfully!`, 'success')
	}, 500)
})

registerTransitionAction('CANCEL', (context: TransitionChangeContext) => {
	const { doctype, recordId, currentState, targetState } = context

	console.log('❌ CANCEL Transition:', {
		doctype,
		recordId,
		from: currentState,
		to: targetState,
	})

	addNotification(`❌ Cancelled editing ${doctype} record ${recordId}`, 'warning')
})

registerTransitionAction('DELETE', (context: TransitionChangeContext) => {
	const { doctype, recordId, currentState, targetState } = context

	console.log('🗑️ DELETE Transition:', {
		doctype,
		recordId,
		from: currentState,
		to: targetState,
	})

	addNotification(`🗑️ Deleting ${doctype} record ${recordId}...`, 'warning')

	// Simulate delete operation
	setTimeout(() => {
		addNotification(`🗑️ ${doctype} record ${recordId} deleted successfully`, 'info')
	}, 500)
})

registerTransitionAction('CREATE', (context: TransitionChangeContext) => {
	const { doctype, currentState, targetState } = context

	console.log('➕ CREATE Transition:', {
		doctype,
		from: currentState,
		to: targetState,
	})

	addNotification(`➕ Creating new ${doctype} record...`, 'info')
})

registerTransitionAction('EDIT', (context: TransitionChangeContext) => {
	const { doctype, recordId, currentState, targetState } = context

	console.log('✏️ EDIT Transition:', {
		doctype,
		recordId,
		from: currentState,
		to: targetState,
	})

	addNotification(`✏️ Editing ${doctype} record ${recordId}`, 'info')
})

registerTransitionAction('VALIDATE', (context: TransitionChangeContext) => {
	const { doctype, recordId, fsmContext } = context

	console.log('✓ VALIDATE Transition:', {
		doctype,
		recordId,
		fsmContext,
	})

	// Example validation logic
	const hasErrors = false // In real app, check validation state

	if (hasErrors) {
		addNotification(`⚠️ Validation failed for ${doctype} record ${recordId}`, 'error')
	} else {
		addNotification(`✓ Validation passed for ${doctype} record ${recordId}`, 'success')
	}
})

registerTransitionAction('SUBMIT', (context: TransitionChangeContext) => {
	const { doctype, recordId, currentState, targetState } = context

	console.log('📤 SUBMIT Transition:', {
		doctype,
		recordId,
		from: currentState,
		to: targetState,
	})

	addNotification(`📤 Submitting ${doctype} record ${recordId}...`, 'info')

	// Simulate submit operation
	setTimeout(() => {
		addNotification(`✅ ${doctype} record ${recordId} submitted successfully!`, 'success')
	}, 700)
})
