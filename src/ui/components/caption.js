import { create } from './../utils';
import EditButtonIcon from './../../assets/svg/editButtonIcon.svg';

/**
 * Caption API class
 */
export default class Caption {
	constructor({ caption }) {
		this.caption = caption || '';
		/**
		 * Creates and returns caption nodes.
		 */
		this.nodes = this.createCaption(this.caption);
	}

	/**
	 * CSS classes
	 *
	 * @returns {object}
	 */
	get CSS() {
		return {
			captionWrapper: 'caption-wrapper',
			captionInput: 'caption-input',
			captionInputEditable: 'caption-input-editable',
			editButton: 'edit-button',
			doneButton: 'done-button'
		};
	}

	/**
	 * Returns caption wrapper
	 */
	render() {
		return this.nodes.wrapper;
	}

	/**
	 * Creates and returns caption UI
	 * 
	 * @param {string} errorMessage 
	 * 
	 * @returns {object} nodes - all nodes related caption.
	 */
	createCaption(caption) {
		const classObject = this;

		/**
		 * Creates caption input for taking user input.
		 */
		const captionInput = create('input', [this.CSS.captionInput], {
			type: 'text',
			/**
			 * Input is readonly by default
			 */
			readonly: true,
			placeholder: 'Write a caption',
			maxlength: '50',
			value: caption
		});

		/**
		 * Resizes the width of the input container based on the number of characters inside it.
		 */
		const captionInputResize = function () {
			if (this.value) {
				this.style.width = ((this.value.length + 1) * 8) + 'px';
			} else {
				/**
				 * Default width fro placeholder.
				 */
				this.style.width = '100px';
			}
		};

		/**
		 * Resizes the input on any change.
		 */
		captionInput.addEventListener('keydown', captionInputResize);
		captionInput.addEventListener('keypress', captionInputResize);
		captionInput.addEventListener('keyup', captionInputResize);

		/**
		 * Creates edit button which lets users edit the caption.
		 */
		const editButton = create('div', [this.CSS.editButton]);

		/**
		 * Adds the edit icon.
		 */
		editButton.innerHTML += EditButtonIcon;

		/**
		 * Disable readOnly and allow editing of caption on pressing on editButton.
		 */
		editButton.addEventListener('click', function () {
			this.style.display = 'none';
			classObject.nodes.doneButton.style.display = 'block';

			classObject.nodes.captionInput.classList.add(classObject.CSS.captionInputEditable);
			classObject.nodes.captionInput.readOnly = false;
		});

		/**
		 * Creates the done button.
		 */
		const doneButton = create('div', [this.CSS.doneButton], {}, [
			document.createTextNode('Done')
		]);

		doneButton.style.display = 'none';

		/**
		 * On pressing done, the edited caption is saved and readOnly is enabled.
		 */
		doneButton.addEventListener('click', function () {
			this.style.display = 'none';
			classObject.nodes.editButton.style.display = 'block';

			classObject.nodes.captionInput.classList.remove(classObject.CSS.captionInputEditable);
			classObject.nodes.captionInput.readOnly = true;
		});

		/**
		 * Creates caption wrapper for storing all the nodes.
		 */
		const captionWrapper = create('div', [this.CSS.captionWrapper], {}, [
			captionInput,
			editButton,
			doneButton
		]);

		return {
			wrapper: captionWrapper,
			captionInput: captionInput,
			editButton: editButton,
			doneButton: doneButton,
		};
	}
}