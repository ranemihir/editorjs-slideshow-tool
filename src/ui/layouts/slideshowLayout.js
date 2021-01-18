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
	constructor({ cloudinaryBaseUrl, selectedImages, caption }) {
		this.cloudinaryBaseUrl = cloudinaryBaseUrl || '';
		this.selectedImages = selectedImages;
		this.caption = caption || '';

		/**
		 * Creates image box objects for all selected images.
		 */
		this.imageBoxObjects = this.createAllImageBoxObjects(this.cloudinaryBaseUrl, this.selectedImages);

		/**
		 * Creates slideshow layout from selected images.
		 */
		this.nodes = this.createSlideshowLayout(this.imageBoxObjects, this.caption);
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
	 * @returns {object} nodes - all nodes related to slideshow layout 
	 */
	createSlideshowLayout(imageBoxObjects, caption) {
		/**
		 * Creates the main slideshow layout.
		 */
		const slideshowLayout = create('div', [this.CSS.slideshowLayout]);

		/**
		 * Append all columns with image boxes to the layout.
		 */
		this.addImageBoxesToSlideshowLayout(imageBoxObjects, slideshowLayout);

		/**
		 * Creates caption wrapper for storing and editing caption
		 */
		const captionWrapper = new Caption({ caption }).render();

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
	 * @param {Array[object]} imageBoxObjects - all selected images {name, caption} to reprsent in layout by order
	 * @param {Element} slideshowLayout - main slideshow layout
	 */
	addImageBoxesToSlideshowLayout(imageBoxObjects, slideshowLayout) {
		for (let i = 0; i < imageBoxObjects.length; i++) {
			slideshowLayout.appendChild(imageBoxObjects[i].render());
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