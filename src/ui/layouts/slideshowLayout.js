import ImageBox from './../imageBlocks/imageBox';
import Caption from './../components/caption';
import { create } from './../utils';

/**
 * Slideshow Layout API class
 */
export default class SlideshowLayout {
	/**
	 * @param {Array[object]} selectedImages - object - image name and caption
	 */
	constructor({ cloudinaryBaseUrl, selectedImages }) {
		this.cloudinaryBaseUrl = cloudinaryBaseUrl || '';
		this.selectedImages = selectedImages;

		this.nodes = this.createSlideshowLayout(this.cloudinaryBaseUrl, this.selectedImages, this.caption);
	}

	/**
	 * CSS classes
	 *
	 * @returns {object}
	 */
	get CSS() {
		return {
			wrapper: 'slideshow-layout-wrapper',
			slideshowLayout: 'slideshow-layout',
			captionWrapper: 'caption-wrapper',
			captionEdit: 'caption-edit',
			captionInout: 'caption-input'
		};
	}

	/**
	 * Returns the main wrapper of the layout
	 */
	render() {
		return this.nodes.wrapper;
	}

	/**
	 * Creates and returns main slideshow layout
	 * 
	 * @param {Array[object]} images - all selected images {name, caption} to reprsent in layout by order
	 * @param {string} caption - caption for layout
	 * 
	 * @returns {Element} 
	 */
	createSlideshowLayout(cloudinaryBaseUrl, images) {
		/**
		 * Creates the main slideshow layout.
		 */
		const slideshowLayout = create('div', [this.CSS.slideshowLayout]);

		/**
		 * Append all columns with image boxes to the layout.
		 */
		this.addImageBoxesToSlideshowLayout(cloudinaryBaseUrl, images, slideshowLayout);

		/**
		 * Creates caption wrapper for storing and editing caption
		 */
		const captionWrapper = new Caption().render();

		/**
		 * Appends all nodes to the wrapper.
		 */
		const wrapper = create('div', [this.CSS.wrapper], {}, [
			slideshowLayout,
			captionWrapper
		]);

		return {
			wrapper: wrapper,
			slideshowLayout: slideshowLayout,
			captionWrapper: captionWrapper
		};
	}

	/**
	 * Appends imageBoxes to the layout.
	 * 
	 * @param {Array[object]} images - all selected images {name, caption} to reprsent in layout by order
	 * @param {Element} slideshowLayout - main slideshow layout
	 */
	addImageBoxesToSlideshowLayout(cloudinaryBaseUrl, images, slideshowLayout) {
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

			slideshowLayout.appendChild(imageBox);
		}
	}
}