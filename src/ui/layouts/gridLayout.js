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
	constructor({ cloudinaryBaseUrl, selectedImages }) {
		this.cloudinaryBaseUrl = cloudinaryBaseUrl || '';
		this.selectedImages = selectedImages;

		/**
		 * Creates grid layout from selected images.
		 */
		this.nodes = this.createGridLayout(this.cloudinaryBaseUrl, this.selectedImages);
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
	 * @param {Array[object]} images - all selected images {name, caption} to reprsent in layout by order
	 * 
	 * @returns {object} nodes - all nodes related to grid layout 
	 */
	createGridLayout(cloudinaryBaseUrl, images) {
		/**
		 * Creates the main grid layout.
		 */
		const gridLayout = create('div', [this.CSS.gridLayout]);

		/**
		 * Append all columns with image boxes to the layout.
		 */
		this.addColumnsToGridLayout(cloudinaryBaseUrl, images, gridLayout);

		/**
		 * Creates caption container for storing caption
		 */
		const captionWrapper = new Caption().render();

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
	addColumnsToGridLayout(cloudinaryBaseUrl, images, gridLayout) {
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

		for (let i = 0; i < images.length; i++) {
			const { name, caption } = images[i];

			/**
			 * Creates and appends imageBox for all images in the array
			 */
			const imageBox = new ImageBox({
				cloudinaryBaseUrl,
				name,
				caption
			}).render();

			gridLayout.children[currCol].appendChild(imageBox);

			/**
			 * Every new image box is appended in a new column eveytime
			 * This way the length of all the columns remain same.
			 */
			currCol = parseInt((currCol + 1) % NUMBER_OF_COLS);
		}
	}
}
