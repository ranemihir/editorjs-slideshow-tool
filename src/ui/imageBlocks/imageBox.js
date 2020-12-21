import { create } from './../utils';

/**
 * Image box main class
 */
export default class ImageBox {
	/**
	 * @param {string} name - name of the image
	 * @param {string} caption - caption for the image
	 */
	constructor({ cloudinaryBaseUrl, name, caption }) {
		this.nodes = this.createImageBox(cloudinaryBaseUrl, name, caption);
	}

	/**
	 * CSS classes
	 *
	 * @returns {object}
	 */
	get CSS() {
		return {
			wrapper: 'image-box-wrapper',
			fadedBackground: 'faded-background',
			captionContainer: 'caption-container'
		};
	}

	/**
	 * Returns the main wrapper of the image box.
	 */
	render() {
		return this.nodes.wrapper;
	}

	/**
	 * Creates and returns all nodes of imageBox.
	 */
	createImageBox(cloudinaryBaseUrl, name, caption) {
		const imageSrc = cloudinaryBaseUrl + name;

		const image = create('img', [], {
			src: imageSrc,
			alt: 'Image box - ' + caption
		});

		const fadedBackground = create('div', [this.CSS.fadedBackground]);

		const captionContainer = create('div', [this.CSS.captionContainer], {}, [
			document.createTextNode(caption)
		]);

		const wrapper = create('div', [this.CSS.wrapper], {}, [
			image,
			fadedBackground,
			captionContainer
		]);

		return {
			wrapper,
			fadedBackground,
			captionContainer
		};
	}
}