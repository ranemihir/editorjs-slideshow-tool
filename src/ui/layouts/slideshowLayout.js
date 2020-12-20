// eslint-disable-next-line no-unused-vars
import { create } from './../utils';

/**
 * Slideshow Layout API class
 */
export default class SlideshowLayout {
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