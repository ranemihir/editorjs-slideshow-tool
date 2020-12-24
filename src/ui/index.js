import CloseButtonIcon from './../assets/svg/closeButtonIcon.svg';
import SlideshowLayoutIcon from './../assets/svg/slideshowLayoutIcon.svg';
import GridLayoutIcon from './../assets/svg/gridLayoutIcon.svg';

import GridLayout from './layouts/gridLayout';
import SlideshowLayout from './layouts/slideshowLayout';
import Error from './components/error';
import { create } from './utils';

/**
 * Image selector class.
 * Also the main interface of the plugin.
 */
export default class UI {
	/**
	 * @param {object} ui - image tool Ui module
	 * @param {ImageConfig} ui.config - user config
	 * @param {data} ui.data - provided data
	 */
	constructor({ config, data }) {
		this.config = config;
		this.data = data;

		/**
		 * Creates selectedImageQueue wrapper.
		 */
		const selectedImagesQueueWrapper = this.createSelectedImagesQueue();

		/**
		 * Three primary node elements of image selector:
		 * 1. Image selection grid (top).
		 * 2. Selected images queue (middle).
		 * 3. Bottom toolbar (bottom).
		 */
		this.nodes = {
			imageSelectionWrapper: this.createImageSelectionWrapper(this.config),
			errorStack: create('div', [this.CSS.errorStack]),
			imageSelectorTitle: this.createImageSelectorTitle(),
			selectedImagesQueueWrapper: selectedImagesQueueWrapper,
			selectedImagesQueue: selectedImagesQueueWrapper.lastChild,
			bottomToolbar: this.createBottomToolbar(this.config)
		};

		/**
		 * The property stores the selected layout by user: 'slideshow' or 'grid'
		 * The default is 'slideshow'
		 */
		this.selectedLayout = 'slideshow';

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
				this.nodes.imageSelectorTitle,
				this.nodes.imageSelectionWrapper,
				this.nodes.errorStack,
				this.nodes.selectedImagesQueueWrapper,
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
		if (this.validateData(this.config, this.data)) {
			this.selectedLayout = this.data.layout;

			if (this.selectedLayout == 'grid') {
				this.uiComponents.gridLayout = new GridLayout({
					cloudinaryBaseUrl: this.config.cloudinaryBaseUrl,
					selectedImages: this.data.imagesOrder,
					caption: this.data.layoutCaption
				});

				this.uiComponents.wrapper.appendChild(this.uiComponents.gridLayout.render());
			} else {
				this.uiComponents.slideshowLayout = new SlideshowLayout({
					cloudinaryBaseUrl: this.config.cloudinaryBaseUrl,
					selectedImages: this.data.imagesOrder,
					caption: this.data.layoutCaption
				});

				this.uiComponents.wrapper.appendChild(this.uiComponents.slideshowLayout.render());
			}
		} else {
			this.uiComponents.wrapper.appendChild(this.uiComponents.imageSelector);
		}
	}

	validateData(config, data) {
		/**
		 * Validate data property itself.
		 */
		if (!data || data == null || Object.keys(data).length == 0) {
			return false;
		}

		/**
		 * Validate data.imagesOrder property
		 */
		if (!data.imagesOrder || data.imagesOrder == null || data.imagesOrder.length <= 1) {
			this.createAndAppendError('Minimum 2 images are required for any layout');
			return false;
		}

		/**
		 * Validate data.layout property.
		 */
		if (data.layout != 'slideshow' && data.layout != 'grid') {
			this.createAndAppendError('layout property can only contain \'slideshow\' or \'grid\'');
			return false;
		}

		/**
		 * Validate if all the names are present in the configuration.
		 */
		const allImageNames = new Set();

		for (let i = 0; i < config.imageData.length; i++) {
			allImageNames.add(config.imageData[i].name);
		}

		for (let i = 0; i < data.imagesOrder.length; i++) {
			if (!allImageNames.has(data.imagesOrder[i].name)) {
				this.createAndAppendError('Some of the names are not present in original configuration');
				return false;
			}
		}

		return true;
	}

	/**
	 * Creates and appends error UI to the error stack
	 * 
	 * @param {string} errorMessage 
	 */
	createAndAppendError(errorMessage) {
		const error = new Error({
			errorMessage
		}).render();

		this.nodes.errorStack.appendChild(error);
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
			imageSelectorTitle: 'image-selector-title',
			imageSelectionWrapper: 'image-selection-wrapper',
			errorStack: 'error-stack',
			imageSelectionGrid: 'image-selection-grid',
			selectedImage: 'selected-image',
			selectedImagesQueueWrapper: 'selected-images-queue-wrapper',
			selectedImagesQueueTitle: 'selected-images-queue-title',
			selectedImagesQueue: 'selected-images-queue',
			deletableImageCellWrapper: 'deletable-image-cell-wrapper',
			closeButton: 'close-button',
			bottomToolbar: 'bottom-toolbar',
			layoutSelector: 'layout-selector',
			layoutSelectorOption: 'layout-selector-option',
			selectedLayoutOption: 'selected-layout-option',
			unselectedLayoutOption: 'unselected-layout-option',
			layoutSelectorOptionText: 'layout-selector-option-text',
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
	 * Creates and returns image selector title - 'Select Pictures'.
	 */
	createImageSelectorTitle() {
		const imageSelectorTitle = create('div', [this.CSS.imageSelectorTitle], {}, [
			document.createTextNode('Select Pictures')
		]);

		return imageSelectorTitle;
	}

	/**
	 * Creates and returns image selctor component
	 * 
	 * @returns {Element}
	 */
	createImageSelector(imageSelectorTitle, imageSelectionWrapper, errorStack, selectedImagesQueueWrapper, bottomToolbar) {
		const imageSelector = create('div', [this.CSS.imageSelector], {}, [
			imageSelectorTitle,
			imageSelectionWrapper,
			errorStack,
			selectedImagesQueueWrapper,
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
		const selectedImagesQueueTitle = create('div', [this.CSS.selectedImagesQueueTitle], {}, [
			document.createTextNode('Edit Selection')
		]);

		const selectedImagesQueue = create('div', [this.CSS.selectedImagesQueue]);

		const selectedImagesQueueWrapper = create('div', [this.CSS.selectedImagesQueueWrapper], {
			style: 'display: none;'
		}, [
			selectedImagesQueueTitle,
			selectedImagesQueue
		]);

		return selectedImagesQueueWrapper;
	}

	/**
	 * Creates and returns the bottom toolbar.
	 * 
	 * @returns {Element}
	 */
	createBottomToolbar(config) {
		const classObject = this;

		/**
		 * Creates a container for slideshow option selector text
		 */
		const slideshowLayoutSelectorOptionText = create('div', [this.CSS.layoutSelectorOptionText], {}, [
			document.createTextNode('Slideshow')
		]);

		/**
		 * Creates slideshow layout selector
		 */
		const slideshowLayoutSelectorOption = create('div', [this.CSS.layoutSelectorOption], {}, [
			slideshowLayoutSelectorOptionText
		]);

		slideshowLayoutSelectorOption.style.borderRadius = '3px 0px 0px 3px';

		/**
		 * Appends slideshow layout icon.
		 */
		slideshowLayoutSelectorOption.innerHTML += SlideshowLayoutIcon;

		/**
		 * Toggle between 'slideshow'and 'grid' layout.
		 */
		slideshowLayoutSelectorOption.addEventListener('click', function () {
			classObject.selectedLayout = 'slideshow';

			this.classList.add(classObject.CSS.selectedLayoutOption);
			this.classList.remove(classObject.CSS.unselectedLayoutOption);

			gridLayoutSelectorOption.classList.remove(classObject.CSS.selectedLayoutOption);
			gridLayoutSelectorOption.classList.add(classObject.CSS.unselectedLayoutOption);
		});

		/**
		 * Creates grid layout selector
		 */
		const gridLayoutSelectorOptionText = create('div', [this.CSS.layoutSelectorOptionText], {}, [
			document.createTextNode('Grid')
		]);

		/**
			 * Creates grid layout selector
			 */
		const gridLayoutSelectorOption = create('div', [this.CSS.layoutSelectorOption], {}, [
			gridLayoutSelectorOptionText
		]);

		gridLayoutSelectorOption.style.borderRadius = '0px 3px 3px 0px';

		/**
		 * Appends grid layout icon.
		 */
		gridLayoutSelectorOption.innerHTML += GridLayoutIcon;

		gridLayoutSelectorOption.addEventListener('click', function () {
			classObject.selectedLayout = 'grid';

			this.classList.add(classObject.CSS.selectedLayoutOption);
			this.classList.remove(classObject.CSS.unselectedLayoutOption);

			slideshowLayoutSelectorOption.classList.remove(classObject.CSS.selectedLayoutOption);
			slideshowLayoutSelectorOption.classList.add(classObject.CSS.unselectedLayoutOption);
		});

		/**
		 * Default selected layout is slideshow.
		 */
		slideshowLayoutSelectorOption.classList.add(this.CSS.selectedLayoutOption);

		/**
		 * Creates a layout selector for selecting between grid and slideshow layout.
		 */
		const layoutSelector = create('div', [this.CSS.layoutSelector], {}, [
			slideshowLayoutSelectorOption,
			gridLayoutSelectorOption
		]);

		/**
		 * Creates 'Add to Article' button on bottom right corner of image selector.
		 */
		const addToArticleButton = create('button', [this.CSS.addToArticleButton], {}, [
			document.createTextNode('Add to Article')
		]);

		/**
		 * Creates the default layout by default on pressing 'Add to Article Button'.
		 */
		addToArticleButton.addEventListener('click', function () {
			if (classObject.nodes.selectedImagesQueue.children.length <= 1) {
				if (classObject.nodes.errorStack.children.length == 0) {
					classObject.createAndAppendError('Select 2 or more pictures inorder to add to article');
				}

				return;
			}

			const selectedImageCells = Array.from(classObject.nodes.selectedImagesQueue.children);

			const selectedImages = [];

			/**
			 * Adds {name, caption} object in selected images to be sent to layout class.
			 */
			selectedImageCells.forEach(function (node) {
				/**
				 * 'id' property represents the index of the image cell.
				 */
				const index = parseInt(node.id);
				const selectedImage = classObject.config.imageData[index];

				selectedImages.push(selectedImage);
			});

			/**
			 * Removes image selector from the main plugin wrapper.
			 */
			classObject.uiComponents.wrapper.removeChild(classObject.uiComponents.wrapper.firstChild);

			/**
			 * Creates layout based on selecte doption by user.
			 */
			if (classObject.selectedLayout == 'grid') {
				/**
				 * Creates and appends grid layout to the main plugin wrapper.
				 */
				classObject.uiComponents.gridLayout = new GridLayout({
					cloudinaryBaseUrl: config.cloudinaryBaseUrl,
					selectedImages
				});

				classObject.uiComponents.wrapper.appendChild(classObject.uiComponents.gridLayout.render());
			} else {
				/**
					 * Creates and appends slideshow layout to the main plugin wrapper.
					 */
				classObject.uiComponents.slideshowLayout = new SlideshowLayout({
					cloudinaryBaseUrl: config.cloudinaryBaseUrl,
					selectedImages
				});

				classObject.uiComponents.wrapper.appendChild(classObject.uiComponents.slideshowLayout.render());
			}
		});

		/**
		 * Creates bottom toolbar and appends the caption textbox and 'Add to Article' button.
		 */
		const bottomToolbar = create('div', [this.CSS.bottomToolbar], {}, [
			layoutSelector,
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
	 * @returns {Element} imageCell
	 */
	createImageCell(imageSrc, caption) {
		const image = create('img', [], {
			src: imageSrc,
			alt: 'Image Cell - ' + caption
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
			if (classObject.nodes.selectedImagesQueueWrapper.style.display == 'none') {
				classObject.nodes.selectedImagesQueueWrapper.style.display = 'flex';
			}

			/**
			 * Gets index of the image cel in selection grid
			 */
			const imageCellIndex = Array.from(classObject.nodes.imageSelectionWrapper.children[0].children).indexOf(this);

			/**
			 * Clones the image cell which is to be appended in the selectedImagesQueue.
			 */
			const imageCellClone = this.cloneNode(true);

			/**
			 * Sets cursor to default
			 */
			imageCellClone.style.cursor = 'default';

			/**
			 * Represents the image as selected in the image selection grid using a border.
			 * Also used to reference the selected image.
			 */
			this.classList.add(classObject.CSS.selectedImage);

			/**
			 * Creates close button the top-right corner.
			 */
			const closeButton = create('div', [classObject.CSS.closeButton]);
			closeButton.innerHTML += CloseButtonIcon;

			/**
			 * Removes selected image from the selectedImageQueue.
			 */
			closeButton.addEventListener('click', function () {
				/**
				 * Removes the selection from the image selection grid.
				 */
				imageCell.classList.remove(classObject.CSS.selectedImage);

				/**
				 * Removes the deletable image cell from the selectedImageQueue.
				 */
				classObject.nodes.selectedImagesQueue.removeChild(closeButton.parentNode);

				/**
				 * If no image cells are remaining in the selectedImagesQueue, set display to none.
				 */
				if (classObject.nodes.selectedImagesQueue.children.length == 0) {
					classObject.nodes.selectedImagesQueueWrapper.style.display = 'none';
				}
			});

			/**
			 * Creates the image cell to be added in the selectedImagesQueue.
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

			/**
			 * Scroll towards right to that image cell after adding it.
			 */
			deletableImageCellWrapper.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'end'
			});
		});

		return imageCell;
	}

}