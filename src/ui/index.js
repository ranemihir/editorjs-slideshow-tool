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
		 * Three primary node elements of image selector:
		 * 1. Image selection grid (top).
		 * 2. Selected images queue (middle).
		 * 3. Bottom toolbar (bottom).
		 */
		this.nodes = {
			imageSelectionWrapper: this.createImageSelectionWrapper(this.config),
			selectedImagesQueue: this.createSelectedImagesQueue(),
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
				this.nodes.imageSelectionWrapper,
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
		if (data == null || data == undefined || data == {}) {
			this.uiComponents.wrapper.appendChild(this.uiComponents.imageSelector);
		} else {
			if (data.layout == 'grid') {
				this.uiComponents.gridLayout = new GridLayout(data);
				this.uiComponents.wrapper.appendChild(this.uiComponents.gridLayout);
			} else {
				this.uiComponents.slideshowLayout = new SlideshowLayout(data);
				this.uiComponents.wrapper.appendChild(this.uiComponents.slideshowLayout);
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
			imageSelectionWrapper: 'image-selection-wrapper',
			imageSelectionGrid: 'image-selection-grid',
			selectedImage: 'selected-image',
			selectedImagesQueue: 'selected-images-queue',
			deletableImageCellWrapper: 'deletable-image-cell-wrapper',
			closeButton: 'close-button',
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
	createImageSelector(imageSelectionWrapper, selectedImagesQueue, bottomToolbar) {
		const imageSelector = create('div', [this.CSS.imageSelector], {}, [
			imageSelectionWrapper,
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
	createImageSelectionWrapper(config) {
		const imageSelectionGrid = create('div', [this.CSS.imageSelectionGrid]);

		for (let i = 0; i < config.imageData.length; i++) {
			const { name, caption } = config.imageData[i];
			const imageSrc = config.cloudinaryBaseUrl + name;
			const imageCell = this.createImageCell(imageSrc, caption);
			imageSelectionGrid.appendChild(imageCell);
		}

		const imageSelectionWrapper = create('div', [this.CSS.imageSelectionWrapper], {}, [
			imageSelectionGrid
		]);

		return imageSelectionWrapper;
	}

	/**
	 * Creates a queue which reprsentes all the selcted images by the user from the selection grid.
	 * 
	 * @returns {Element}
	 */
	createSelectedImagesQueue() {
		const selectedImagesQueue = create('div', [this.CSS.selectedImagesQueue], {
			style: 'display: none;'
		});

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
		const captionTextbox = create('input', [this.CSS.captionTextbox], {
			type: 'text',
			placeholder: 'Write a caption'
		});
		/**
		 * Creates 'Add to Article' button on bottom right corner of image selector.
		 */
		const addToArticleButton = create('button', [this.CSS.addToArticleButton], {}, [
			document.createTextNode('Add to Article')
		]);

		/**
		 * 'grid' or 'slideshow' layout are the 2 options.
		 */
		const DEFAULT_LAYOUT = 'grid';

		const classObject = this;
		/**
		 * Create the default layout by default on pressing 'Add to Article Button'.
		 */
		addToArticleButton.addEventListener('click', function () {
			const caption = captionTextbox.nodeValue || '';
			const selectedImages = Array.from(classObject.nodes.selectedImagesQueue.children);

			/**
			 * Removes image selector from the main plugin wrapper.
			 */
			classObject.uiComponents.wrapper.removeChild(classObject.uiComponents.wrapper.firstChild);

			if (DEFAULT_LAYOUT == 'grid') {
				/**
				 * Creates and appends grid layout to the main plugin wrapper.
				 */
				classObject.uiComponents.gridLayout = new GridLayout({
					selectedImages,
					caption
				});

				classObject.uiComponents.wrapper.appendChild(classObject.uiComponents.gridLayout);
			} else {
				/**
				 * Creates and appends slideshow layout to the main plugin wrapper.
				 */
				classObject.uiComponents.slideshowLayout = new SlideshowLayout({
					selectedImages,
					caption
				});

				classObject.uiComponents.wrapper.appendChild(classObject.uiComponents.slideshowLayout);
			}
		});

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
			src: imageSrc,
			alt: 'Image Cell'
		});

		/**
		 * Length of caption in image cell
		 */
		const CHAR_LIMIT_FOR_IMAGE_CELL = 10;

		if (caption.length > CHAR_LIMIT_FOR_IMAGE_CELL) {
			caption = caption.slice(0, CHAR_LIMIT_FOR_IMAGE_CELL) + '...';
		}

		const imageCaption = create('span', [this.CSS.imageCaption], {}, [
			document.createTextNode(caption)
		]);

		const imageCell = create('div', [this.CSS.imageCell], {}, [
			image,
			imageCaption
		]);

		const classObject = this;

		/**
		 * Adds image cells to selected images queue on click.
		 */
		imageCell.addEventListener('click', function () {
			if (this.classList.contains(classObject.CSS.selectedImage)) {
				return;
			}

			/**
			 * If this is the first image cell being added, display the selectedimagesQueue.
			 */
			if (classObject.nodes.selectedImagesQueue.style.display == 'none') {
				classObject.nodes.selectedImagesQueue.style.display = 'flex';
			}

			const imageCellIndex = Array.from(classObject.nodes.imageSelectionWrapper.children[0].children).indexOf(this);
			/**
			 * Clone the image cell which is to be appended in the selectedImagesQueue.
			 */
			const imageCellClone = this.cloneNode(true);

			/**
			 * Set cursor to default
			 */
			imageCellClone.style.cursor = 'default';

			/**
			 * Represent the image as selected in the image selection grid using a border.
			 * Also used to reference the selected image.
			 */
			this.classList.add(classObject.CSS.selectedImage);

			/**
			 * Create close button the top-right corner.
			 */
			const closeButton = create('div', [classObject.CSS.closeButton]);

			/**
			 * Remove selected image from the selectedImageQueue.
			 */
			closeButton.addEventListener('click', function () {
				/**
				 * Remove the selection from the image selection grid.
				 */
				imageCell.classList.remove(classObject.CSS.selectedImage);

				/**
				 * Remove the deletable image cell from the selectedImageQueue.
				 */
				classObject.nodes.selectedImagesQueue.removeChild(closeButton.parentNode);

				/**
				 * If no image cells are remaining in the selectedImagesQueue, set display to none.
				 */
				if (classObject.nodes.selectedImagesQueue.children.length == 0) {
					classObject.nodes.selectedImagesQueue.style.display = 'none';
				}
			});

			/**
			 * Create the image cell to be added in the selectedImagesQueue.
			 */
			const deletableImageCellWrapper = create('div', [classObject.CSS.deletableImageCellWrapper], {
				id: imageCellIndex
			}, [
				closeButton,
				imageCellClone
			]);

			/**
			 * Append the deletable image cell to the selectedImagesQueue.
			 */
			classObject.nodes.selectedImagesQueue.appendChild(deletableImageCellWrapper);
		});

		return imageCell;
	}

}