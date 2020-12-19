/**
 * The plugin structure is split into 3 parts: 
 * 1) index.js — Plugin's primary interface, core API and methods for working with the data.
 * 2) tunes.js — Working with the Editor's Block Tunes API.
 * 3) ui.js — Used for UI manipulations: render, showing preloader, etc.
 */

import SlideshowIcon from './assets/svg/slideshowIcon.svg';
import UI from './ui/index';
import Tunes from './tunes';
// eslint-disable-next-line
import css from './index.css';

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
			imageData: config.imageData || {},
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

		/**
		 * Module for working with tunes
		 */
		this.tunes = new Tunes({
			api,
			actions: this.config.actions,
			onChange: (tuneName) => this.tuneToggled(tuneName),
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
	 * Makes buttons with tunes: add background, add border, stretch image
	 *
	 * @public
	 *
	 * @returns {Element}
	 */
	renderSettings() {
		return this.tunes.render(this.data.layout);
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