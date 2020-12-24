import { create } from './../utils';

/**
 * API for displaying errors
 */
export default class Error {
	/**
	 * 
	 * @param {string} errorMessage
	 */
	constructor({ errorMessage }) {
		/**
		 * print error on console.
		 */
		console.error(errorMessage);

		this.nodes = {
			wrapper: this.createError(errorMessage)
		};
	}

	/**
	 * CSS classes
	 *
	 * @returns {object}
	 */
	get CSS() {
		return {
			errorWrapper: 'error-wrapper',
			errorMessageContainer: 'error-message-container',
			closeButton: 'close-button'
		};
	}

	/**
	 * Returns the error UI
	 */
	render() {
		return this.nodes.wrapper;
	}

	/**
	 * Creates and returns error UI
	 * 
	 * @param {string} errorMessage 
	 * 
	 * @returns {Element} errorWrapper - wrapper of the component.
	 */
	createError(errorMessage) {
		const classObject = this;

		const errorMessageContainer = create('div', [this.CSS.errorMessageContainer], {}, [
			document.createTextNode(errorMessage)
		]);

		const closeButton = create('div', [this.CSS.closeButton], {}, [
			document.createTextNode('Close')
		]);

		/**
		 * Removes the error message.
		 */
		closeButton.addEventListener('click', function () {
			classObject.nodes.wrapper.remove();
		});

		const errorWrapper = create('div', [this.CSS.errorWrapper], {}, [
			errorMessageContainer,
			closeButton
		]);

		return errorWrapper;
	}
}