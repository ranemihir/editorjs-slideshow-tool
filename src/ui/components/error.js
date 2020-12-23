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
			doneButton: 'done-button'
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
	 * @returns {Element}
	 */
	createError(errorMessage) {
		const classObject = this;

		const errorMessageContainer = create('div', [this.CSS.errorMessageContainer], {}, [
			document.createTextNode(errorMessage)
		]);

		const doneButton = create('div', [this.CSS.doneButton], {}, [
			document.createTextNode('Done')
		]);

		doneButton.addEventListener('click', function () {
			classObject.nodes.wrapper.remove();
		});

		const errorWrapper = create('div', [this.CSS.errorWrapper], {}, [
			errorMessageContainer,
			doneButton
		]);

		return errorWrapper;
	}
}