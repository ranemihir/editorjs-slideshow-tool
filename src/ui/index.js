import GridLayout from './layouts/gridLayout';
import SlideshowLayout from './layouts/slideshowLayout';
import { create } from './utils';

/**
 * Image selector class.
 * Also the main interface of the plugin.
 */
export default class UI {
	/**
	 * @param {object} ui - image tool Ui module
	 * @param {object} ui.api - Editor.js API
	 * @param {ImageConfig} ui.config - user config
	 */
	constructor({ api, config, data }) {
		this.api = api;
		this.config = config;
		this.data = data;

		/**
		 * queue of images which are selected by user.
		 */
		this.selectedImages = [];

		/**
		 * Three primary node elements of image selector:
		 * 1. Image selection grid (top).
		 * 2. Selected images queue (middle).
		 * 3. Bottom toolbar (bottom).
		 */
		this.nodes = {
			imageSelectionGrid: this.createImageSelectionGrid(this.config),
			selectedImagesQueue: this.createSelectedImagesQueue(this.selectedImages),
			bottomToolbar: this.createBottomToolbar()
		};

		/**
		 * Four primary UI components of the plugin:
		 * 1. Wrapper - The main wrapper or div container 
		 * 2. imageSelector - The image selector UI
		 * 3. gridLayout
		 * 4. slideshowLayout
		 */
		this.uiComponents = {
			wrapper: create('div', [this.CSS.main]),
			imageSelector: this.createImageSelector(
				this.nodes.imageSelectionGrid,
				this.nodes.selectedImagesQueue,
				this.nodes.bottomToolbar
			),
			gridLayout: null,
			slideshowLayout: null
		};

		/**
		 * If there is no data provided on initialisation,
		 * present the image selector
		 * Otherwise, present the grid or slideshow layout based on the data.
		 */
		if (data == {}) {
			this.wrapper.appendChild(this.uiComponents.imageSelector);
		} else {
			if (data.layout == 'grid') {
				this.uiComponents.gridLayout = new GridLayout(data);
				this.wrapper.appendChild(this.uiComponents.gridLayout);
			} else {
				this.uiComponents.slideshowLayout = new SlideshowLayout(data);
				this.wrapper.appendChild(this.uiComponents.slideshowLayout);
			}
		}
	}

	/**
	 * CSS classes
	 *
	 * @returns {object}
	 */
	get CSS() {
		return {
			/**
			 * Wrapper styles
			 */
			main: 'main',

			/**
			 * Image selector styles
			 */
			imageSelector: 'image-selector',
			imageSelectionGrid: 'image-selection-grid',
			selectedImages: 'selected-images',
			bottomToolbar: 'bottom-toolbar',
			captionTextbox: 'caption-textbox',
			addToArticleButton: 'add-to-article-button',
			/**
			 * Image cell styles
			 */
			imageCell: 'image-cell',
			imageCaption: 'image-caption'
		};
	}

	/**
	 * Renders tool UI
	 *
	 * @param {ImageToolData} toolData - saved tool data
	 * @returns {Element}
	 */
	render() {
		return this.uiComponents.wrapper;
	}

	/**
	 * Creates and returns image selctor component
	 * 
	 * @returns {Element}
	 */
	createImageSelector(imageSelectionGrid, selectedImagesQueue, bottomToolbar) {
		const imageSelector = create('div', [this.CSS.imageSelector], {}, [
			imageSelectionGrid,
			selectedImagesQueue,
			bottomToolbar
		]);

		return imageSelector;
	}

	/**
	 * Creates image selction grid and appends all the imageCells to it.
	 * 
	 * @returns {Element}
	 */
	createImageSelectionGrid(config) {
		const imageSelectionGrid = create('div', [this.CSS.imageSelectionGrid], {} /*, !append image cells*/);
		return imageSelectionGrid;
	}

	/**
	 * Creates a queue which reprsentes all the selcted images by the user from the selection grid.
	 * 
	 * @returns {Element}
	 */
	createSelectedImagesQueue(selectedImages) {
		const selectedImagesQueue = create('div', [this.CSS.selectedImages], {}, selectedImages);
		return selectedImagesQueue;
	}

	/**
	 * Creates and returns the bottom toolbar.
	 * 
	 * @returns {Element}
	 */
	createBottomToolbar() {
		/**
		 * Creates a textbox for users to write a caption on bottom left corner.
		 */
		const captionTextbox = create('input', [this.captionTextbox], {
			type: 'text',
			placeholder: 'Write a caption...'
		});
		/**
		 * Creates 'Add to Article' button on bottom right corner of image selector.
		 */
		const addToArticleButton = create('button', [this.CSS.addToArticleButton]);

		/**
		 * Creates bottom toolbar and appends the caption textbox and 'Add to Article' button.
		 */
		const bottomToolbar = create('div', [this.CSS.bottomToolbar], {}, [
			captionTextbox,
			addToArticleButton
		]);

		return bottomToolbar;
	}

	/**
	 * Creates and returns an image cell which is represented in the image selection grid and 
	 * selectedImagesQueue.
	 * 
	 * @param {string} imageSrc - src link fro image.
	 * 
	 * @returns {Element}
	 */
	createImageCell(imageSrc, caption) {
		const image = create('img', [], {
			src: imageSrc
		});

		const imageCaption = create('span', [this.CSS.imageCaption], {}, [
			document.createTextNode(caption)
		]);

		const imageCell = create('div', [this.CSS.imageCell], {}, [
			image,
			imageCaption
		]);

		return imageCell;
	}

	/**
	 * Adds all image cells created to the image selection grid.
	 * 
	 * @param {object} config 
	 */
	addAllImageCellsToSelectionGrid(config) {
		for (let i = 0; i < config.imageData.length; i++) {
			const { imageName, caption } = config.imageData[i];
			const imageSrc = config.cloudinaryBaseUrl + imageName;
			const imageCell = this.createImageCell(imageSrc, caption);
			this.nodes.imageSelectionGrid.appendChild(imageCell);
		}
	}

}