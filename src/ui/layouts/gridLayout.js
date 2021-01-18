import ImageBox from './../imageBlocks/imageBox';
import Caption from './../components/caption';
import { create } from './../utils';

/**
 * Grid Layput API class
 */
export default class GridLayout {
	/**
	 * @param {object} ui - image tool Ui module
	 * @param {Array[object]} ui.selectedImages - object - image name and caption
	 * @param {ImageConfig} ui.caption - caption for layout
	 */
	constructor({ cloudinaryBaseUrl, selectedImages, caption }) {
		this.cloudinaryBaseUrl = cloudinaryBaseUrl || '';
		this.selectedImages = selectedImages;
		this.caption = caption || '';

		/**
		 * Creates image box objects for all selected images.
		 */
		this.imageBoxObjects = this.createAllImageBoxObjects(this.cloudinaryBaseUrl, this.selectedImages);

		/**
		 * Creates grid layout from selected images.
		 */
		this.nodes = this.createGridLayout(this.imageBoxObjects, this.caption);
	}

	/**
	 * CSS classes
	 *
	 * @returns {object}
	 */
	get CSS() {
		return {
			wrapper: 'grid-layout-wrapper',
			gridLayout: 'grid-layout',
			gridCol: 'grid-col',
			caption: 'caption'
		};
	}

	/**
	 * Returns the main wrapper of the layout
	 */
	render() {
		return this.nodes.wrapper;
	}

	/**
	 * Creates and returns main grid layout
	 * 
	 * @param {Array[object]} imageBoxObjects - a list imageBox objects of all selected images.
	 * 
	 * @returns {object} nodes - all nodes related to grid layout 
	 */
	createGridLayout(imageBoxObjects, caption) {
		/**
		 * Creates the main grid layout.
		 */
		const gridLayout = create('div', [this.CSS.gridLayout]);

		/**
		 * Append all columns with image boxes to the layout.
		 */
		this.addColumnsToGridLayout(imageBoxObjects, gridLayout);

		/**
		 * Creates caption container for storing caption
		 */
		const captionWrapper = new Caption({ caption }).render();

		/**
		 * Appends all nodes to the wrapper.
		 */
		const wrapper = create('div', [this.CSS.wrapper], {}, [
			gridLayout,
			captionWrapper
		]);

		return {
			wrapper: wrapper,
			gridLayout: gridLayout,
			captionWrapper: captionWrapper
		};
	}


	/**
	 * Appends imageBoxes to the columns and these colums are appended to the layout.
	 * 
	 * @param {Array[object]} images - all selected images {name, caption} to reprsent in layout by order
	 * @param {Element} gridLayout - main grid layout
	 */
	addColumnsToGridLayout(imageBoxObjects, gridLayout) {
		/**
		 * Default number of columns to be create din the grid.
		 */
		const NUMBER_OF_COLS = 2;

		/**
		 * Appends the column node divs to the grid.
		 */
		for (let i = 0; i < NUMBER_OF_COLS; i++) {
			const gridCol = create('div', [this.CSS.gridCol]);
			gridLayout.appendChild(gridCol);
		}

		let currCol = 0;

		for (let i = 0; i < imageBoxObjects.length; i++) {
			gridLayout.children[currCol].appendChild(imageBoxObjects[i].render());

			/**
			 * Every new image box is appended in a new column eveytime
			 * This way the length of all the columns remain same.
			 */
			currCol = parseInt((currCol + 1) % NUMBER_OF_COLS);
		}
	}

	/**
	 * Creates all image boxes for selected images.
	 * 
	 * @returns {Array} imageBoxObjects - a list of all imageBox objects created from selected images.
	 */
	createAllImageBoxObjects(cloudinaryBaseUrl, images) {
		const imageBoxObjects = [];

		for (let i = 0; i < images.length; i++) {
			/**
			 * Creates image box for every image.
			 */
			const imageBoxObject = new ImageBox({
				cloudinaryBaseUrl: cloudinaryBaseUrl,
				name: images[i].name,
				caption: images[i].caption
			});

			/**
			 * Appends every imageBox object to an array.
			 */
			imageBoxObjects.push(imageBoxObject);
		}

		/**
		 * Returns an array of imageBox objects.
		 */
		return imageBoxObjects;
	}

	/**
	 * Returns all the images with updated captions.
	 * 
	 * @returns {Array} imagesOrder - all image objects.
	 */
	returnImagesOrder() {
		const imagesOrder = [];

		for (let i = 0; i < this.imageBoxObjects.length; i++) {
			const name = this.selectedImages[i].name;
			const caption = this.imageBoxObjects[i].nodes.captionContainer.firstChild.value;

			imagesOrder.push({ name, caption });
		}

		return imagesOrder;
	}
}
