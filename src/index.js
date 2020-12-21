/**
 * The plugin structure is split into 2 parts: 
 * 1) index.js — Plugin's primary interface, core API and methods for working with the data.
 * 2) ui.js — Used for UI manipulations: render, showing preloader, etc.
 */

import SlideshowIcon from './assets/svg/slideshowIcon.svg';
import UI from './ui/index';
// eslint-disable-next-line
import css from './assets/styles/index.css';

/**
 * Slideshow plugin primary API
 */
export default class SlideshowPlugin {
	/**
	 * 
	 * Get plugin toolbox settings
	 * 
	 * icon - Plugin icon's SVG
	 * title - Title to show in toolbox
	 *
	 * @returns {{icon: string, title: string}}
	 */
	static get toolbox() {
		return {
			icon: SlideshowIcon,
			title: 'Slideshow',
		};
	}

	/**
	 * @param {object} tool - tool properties got from editor.js
	 * @param {ImageToolData} tool.data - previously saved data
	 * @param {ImageConfig} tool.config - user config for Tool
	 * @param {object} tool.api - Editor.js API
	 * @param {boolean} tool.readOnly - read-only mode flag
	 */
	constructor({ data, config, api }) {
		this.api = api;

		/**
		 * Tool's initial config
		 */
		this.config = {
			imageData: config.imageData || [],
			cloudinaryBaseUrl: config.cloudinaryBaseUrl || '',
		};

		/**
		 * provided data while configuring
		 */
		this.data = data || {};

		/**
		 * Module for working with UI
		 */
		this.ui = new UI({
			api,
			config: this.config
		});
	}

	/**
	 * Renders Block content
	 *
	 * @public
	 *
	 * @returns {HTMLDivElement}
	 */
	render() {
		return this.ui.render();
	}

	/**
	 * Empty blockSetting
	 * 
	 * @public
	 *
	 * @returns {Element}
	 */
	renderSettings() {
		return document.createElement('div');
	}

	/**
	 * Return Block data
	 *
	 * @public
	 *
	 * @returns {SlideshowPluginData}
	 */
	save(blockContent) {
		return {
			layout: blockContent.layout,
			imagesOrder: blockContent.imagesOrder //[]
		};
	}
}