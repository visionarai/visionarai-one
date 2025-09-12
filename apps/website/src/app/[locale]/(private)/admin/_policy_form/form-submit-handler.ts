/**
 * Form submission utilities for policy forms
 */

/**
 * Default submit handler that displays form data in an alert
 * Useful for development and testing
 */
export const createAlertSubmitHandler = () => {
	return (data: unknown) => {
		alert(JSON.stringify(data, null, 2));
	};
};

/**
 * Create a custom submit handler with callback
 */
export const createCustomSubmitHandler = (callback: (data: unknown) => void) => {
	return callback;
};
