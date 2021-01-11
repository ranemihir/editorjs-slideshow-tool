import { create } from './../utils';
import Caption from './../components/caption';

/**
 * Image box main class
 */
export default class ImageBox {
	/**
	 * @param {string} name - name of the image
	 * @param {string} caption - caption for the image
	 */
	constructor({ cloudinaryBaseUrl, name, caption }) {
		/**
		 * Creates image boxes to be represented in layouts.
		 */
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
			captionContainer: 'caption-container',
			editButtonInImageBox: 'edit-button-in-image-box',
			textColor: '#FAFAFA'
		};
	}

	/**
	 * Returns the main wrapper of the image box.
	 */
	render() {
		return this.nodes.wrapper;
	}

	/**
	 * Creates Image Box.
	 * 
	 * @param {string} cloudinaryBaseUrl 
	 * @param {string} name 
	 * @param {string} caption 
	 * 
	 * @returns nodes - all nodes of image box.
	 */
	createImageBox(cloudinaryBaseUrl, name, caption) {
		const imageSrc = cloudinaryBaseUrl + name;

		const image = create('img', [], {
			src: imageSrc,
			alt: 'Image box - ' + caption
		});

		/**
		 * Black half transparent faded background container.
		 */
		const fadedBackground = create('div', [this.CSS.fadedBackground]);

		/**
		 * Creates the editable caption container.
		 */
		const captionContainer = this.createCaptionContainer(caption);

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

	/**
	 * Creates and returns editable caption holder for image box.
	 * 
	 * @param {string} caption - image caption
	 * @returns
	 */
	createCaptionContainer(caption) {
		/**
		 * Creates caption component
		 */
		const captionContainer = new Caption({ caption }).render();

		/**
		 * Adds necessary styles specific to image box.
		 */
		captionContainer.classList.add(this.CSS.captionContainer);

		captionContainer.children[0].style.color = this.CSS.textColor;

		captionContainer.children[1].style.color = this.CSS.textColor;
		captionContainer.children[1].classList.remove('edit-button');
		captionContainer.children[1].classList.add(this.CSS.editButtonInImageBox);

		/**
		 * Returns caption container component.
		 */
		return captionContainer;
	}

}