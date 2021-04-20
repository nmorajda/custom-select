export default class Select {
  constructor(element) {
    this.element = element;
    this.options = getFormattedOptions(element.querySelectorAll('option'));
    this.customElement = document.createElement('div');
    this.labelElement = document.createElement('span');
    this.optionsCustomElement = document.createElement('ul');
    setupCustomElement(this);
    // Hide default select box
    element.style.display = 'none';

    element.after(this.customElement);
  }

  get selectedOption() {
    return this.options.find(option => option.selected);
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  selectOption(newSelectedOption) {
    // step 1 change selected option
    const prevSelectedOption = this.selectedOption;
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;
    this.labelElement.innerText = newSelectedOption.label;

    // step 2 toggle selected class in optionsCustomElement
    const optionIndex = this.selectedOptionIndex;

    // remove class from element
    this.optionsCustomElement
      .querySelector('.selected')
      .classList.remove('selected');

    // get element and add .selected class
    const newSelectedElement = this.optionsCustomElement.querySelectorAll('li')[
      optionIndex
    ];
    newSelectedElement.classList.add('selected');

    // step 3 scroll to selected option
    newSelectedElement.scrollIntoView({ block: 'nearest' });
  }
}

function setupCustomElement(select) {
  // container
  select.customElement.classList.add('custom-select-container');
  // add focus to container element
  select.customElement.tabIndex = 0;

  // selected element
  select.labelElement.classList.add('custom-select-value');
  select.labelElement.innerText = select.selectedOption.label;
  select.customElement.append(select.labelElement);

  // option items
  select.optionsCustomElement.classList.add('custom-select-options');
  select.options.forEach(option => {
    const optionElement = document.createElement('li');
    optionElement.classList.add('custom-select-option');
    optionElement.classList.toggle('selected', option.selected);
    optionElement.innerText = option.label;
    optionElement.dataset.value = option.value;

    // add event to click opion
    optionElement.addEventListener('click', () => {
      select.selectOption(option);
      select.optionsCustomElement.classList.remove('show');
    });

    select.optionsCustomElement.append(optionElement);
  });

  select.customElement.append(select.optionsCustomElement);

  select.labelElement.addEventListener('click', () => {
    select.optionsCustomElement.classList.toggle('show');
  });

  // Hide options list when focus lost
  select.customElement.addEventListener('blur', () => {
    select.optionsCustomElement.classList.remove('show');
  });

  // keyboard
  let debounceTimeout;
  let searchTerm = '';
  select.customElement.addEventListener('keydown', e => {
    switch (e.code) {
      case 'Space': {
        select.optionsCustomElement.classList.toggle('show');
        break;
      }
      case 'ArrowUp': {
        const prevOption = select.options[select.selectedOptionIndex - 1];
        if (prevOption) {
          select.selectOption(prevOption);
        }
        break;
      }
      case 'ArrowDown': {
        const nextOption = select.options[select.selectedOptionIndex + 1];
        if (nextOption) {
          select.selectOption(nextOption);
        }
        break;
      }
      case 'Enter':
      case 'Escape':
        select.optionsCustomElement.classList.remove('show');
        break;
      default: {
        clearTimeout(debounceTimeout);
        searchTerm += e.key;
        debounceTimeout = setTimeout(() => {
          searchTerm = '';
        }, 500);

        const searchedOption = select.options.find(option => {
          return option.label.toLowerCase().startsWith(searchTerm);
        });

        if (searchedOption) {
          select.selectOption(searchedOption);
        }
      }
    }
  });
}

function getFormattedOptions(optionElements) {
  return [...optionElements].map(optionElement => {
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement,
    };
  });
}
