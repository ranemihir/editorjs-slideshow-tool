/**
 * Working with Block Tunes
 */
export default class Tunes {

	/**
	 * @param {object} tune - image tool Tunes managers
	 * @param {object} tune.api - Editor API
	 * @param {Function} tune.onChange - tune toggling callback
	 */
	constructor({ api, onChange }) {
		this.api = api;
		this.onChange = onChange;
		this.buttons = [];
	}

	render() {
		return;
	}
}