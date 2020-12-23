import { create } from './../utils';
import EditButtonIcon from './../../assets/svg/editButtonIcon.svg';

/**
 * Caption API class
 */
export default class Caption {
	constructor() {
		this.nodes = this.createCaption();
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
	 * @returns {Element}
	 */
	createCaption() {
		const classObject = this;

		const captionInput = create('input', [this.CSS.captionInput], {
			type: 'text',
			readonly: true,
			placeholder: 'Write a caption',
			maxlength: '50'
		});

		const captionInputResize = function () {
			if (this.value) {
				this.style.width = ((this.value.length + 1) * 8) + 'px';
			} else {
				this.style.width = '100px';
			}
		};

		captionInput.addEventListener('keydown', captionInputResize);
		captionInput.addEventListener('keypress', captionInputResize);
		captionInput.addEventListener('keyup', captionInputResize);

		const editButton = create('div', [this.CSS.editButton]);
		editButton.innerHTML += EditButtonIcon;

		editButton.addEventListener('click', function () {
			this.style.display = 'none';
			classObject.nodes.doneButton.style.display = 'block';

			classObject.nodes.captionInput.classList.add(classObject.CSS.captionInputEditable);
			classObject.nodes.captionInput.readOnly = false;
		});

		const doneButton = create('div', [this.CSS.doneButton], {}, [
			document.createTextNode('Done')
		]);

		doneButton.style.display = 'none';

		doneButton.addEventListener('click', function () {
			this.style.display = 'none';
			classObject.nodes.editButton.style.display = 'block';

			classObject.nodes.captionInput.classList.remove(classObject.CSS.captionInputEditable);
			classObject.nodes.captionInput.readOnly = true;
		});

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