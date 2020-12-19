import { create } from './../utils';

/**
 * Grid Layput API class
 */
export default class GridLayout {
	/**
	 * @param {object} ui - image tool Ui module
	 * @param {object} ui.api - Editor.js API
	 * @param {ImageConfig} ui.config - user config
	 */
	constructor({ api, config }) {
		this.api = api;
		this.config = config;
	}
}
