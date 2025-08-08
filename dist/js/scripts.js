const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

// Добавляем класс 'loaded' после полной загрузки страницы
window.addEventListener('load', function () {
  setTimeout(function () {
    document.documentElement.classList.add('loaded');
  }, 900);
});

//========================================================================================================================================================

//Выбор языка

let langHeaderButton = document.querySelector('.lang-header__button');
if (langHeaderButton) {
  let langHeader = document.querySelector('.lang-header');
  langHeaderButton.addEventListener('click', function () {
    langHeader.classList.toggle('_active');
  });
}

//========================================================================================================================================================

//Главное меню
let mainMenuButton = document.querySelector('.main-menu__button');
let mainMenuContainer = document.querySelector('.main-menu');

if (mainMenuButton) {
  mainMenuButton.addEventListener('click', function (e) {
    e.stopPropagation();
    document.documentElement.classList.toggle('menu-open');
  });

  document.addEventListener('click', function (e) {
    if (e.target !== mainMenuButton && !mainMenuContainer.contains(e.target)) {
      document.documentElement.classList.remove('menu-open');
    }
  });
}

//========================================================================================================================================================

//Меню каталог
const menuCatalogButton = document.querySelector('.menu-catalog__button');
if (menuCatalogButton) {
  function toggleMenuState() {
    document.documentElement.classList.toggle('catalog-open');
  }

  menuCatalogButton.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMenuState();
  });

  document.addEventListener('click', function (e) {
    const isClickInsideMenu = e.target.closest('.menu-catalog__button') ||
      e.target.closest('.main-menu') ||
      e.target.closest('.menu-catalog__body');

    if (!isClickInsideMenu) {
      document.documentElement.classList.remove('catalog-open');
    }
  });
}

const menuTitles = document.querySelectorAll('.menu-catalog__title');
const contentTabs = document.querySelectorAll('.center-menu-catalog__content');
if (menuTitles) {
  menuTitles.forEach(title => {
    title.addEventListener('mouseenter', function (e) {

      const tabName = this.getAttribute('data-tabs');

      menuTitles.forEach(item => {
        item.classList.remove('_tab-active');
      });

      this.classList.add('_tab-active');

      contentTabs.forEach(tab => {
        tab.classList.remove('_tab-active');
      });

      const activeTab = document.querySelector(`.center-menu-catalog__content[data-tabs="${tabName}"]`);
      if (activeTab) {
        activeTab.classList.add('_tab-active');
      }
    });
  });
}

const contentBlocks = document.querySelectorAll('.center-menu-catalog__content');
if (contentBlocks) {
  contentBlocks.forEach(block => {
    const navLinks = block.querySelectorAll('.center-menu-catalog__link');
    const productLists = block.querySelectorAll('.center-menu-catalog__product-list');
    const productLinks = block.querySelectorAll('.center-menu-catalog__product-link');
    const products = block.querySelectorAll('.center-menu-catalog__product');

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', function (e) {

        const productsValue = this.getAttribute('data-products');

        navLinks.forEach(l => l.classList.remove('_active'));
        this.classList.add('_active');

        productLists.forEach(list => list.classList.remove('_active'));
        const targetList = block.querySelector(`.center-menu-catalog__product-list[data-products="${productsValue}"]`);
        if (targetList) targetList.classList.add('_active');

        const firstProductLink = targetList ? targetList.querySelector('.center-menu-catalog__product-link') : null;
        const firstProductId = firstProductLink ? firstProductLink.getAttribute('data-product') : null;

        productLinks.forEach(link => link.classList.remove('_active'));
        products.forEach(p => p.classList.remove('_active'));

        if (firstProductLink) {
          firstProductLink.classList.add('_active');
          const targetProduct = block.querySelector(`.center-menu-catalog__product[data-product="${firstProductId}"]`);
          if (targetProduct) targetProduct.classList.add('_active');
        }
      });
    });

    block.addEventListener('mouseover', function (e) {
      const productLink = e.target.closest('.center-menu-catalog__product-link');
      if (!productLink) return;

      const productId = productLink.getAttribute('data-product');
      const productList = productLink.closest('.center-menu-catalog__product-list');
      const productsValue = productList ? productList.getAttribute('data-products') : null;

      productLinks.forEach(link => link.classList.remove('_active'));
      productLink.classList.add('_active');

      products.forEach(p => p.classList.remove('_active'));
      const targetProduct = block.querySelector(`.center-menu-catalog__product[data-product="${productId}"]`);
      if (targetProduct) targetProduct.classList.add('_active');

      if (productsValue) {
        navLinks.forEach(l => l.classList.remove('_active'));
        const targetNavLink = block.querySelector(`.center-menu-catalog__link[data-products="${productsValue}"]`);
        if (targetNavLink) targetNavLink.classList.add('_active');
      }
    });
  });
}

//========================================================================================================================================================

//Поиск
const searchHeader = document.querySelector('.search-header');
const searchButtons = document.querySelectorAll('.search-header__button, .search-header__close');
const searchInput = document.querySelector('.search-header__input input');

if (searchButtons) {
  searchButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      document.documentElement.classList.toggle('search-open');
    });
  });

  document.addEventListener('click', function (e) {
    if (!searchHeader.contains(e.target)) {
      document.documentElement.classList.remove('search-open');
    }
  });

  searchHeader.addEventListener('click', function (e) {
    if (e.target !== searchHeader && !Array.from(searchButtons).includes(e.target)) {
      e.stopPropagation();
    }
  });
}

//========================================================================================================================================================

//Куки
let cookiesLink = document.querySelector('.cookies__link');

if (cookiesLink) {
  let cookiesBlock = cookiesLink.closest('.cookies');

  cookiesLink.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (cookiesBlock) {
      cookiesBlock.style.display = 'none';
    }
  });
}

//========================================================================================================================================================

//Количество
function formQuantity() {
  document.addEventListener("click", function (e) {
    let targetElement = e.target;
    if (targetElement.closest('[data-quantity-plus]') || targetElement.closest('[data-quantity-minus]')) {
      const valueElement = targetElement.closest('[data-quantity]').querySelector('[data-quantity-value]');
      let value = parseInt(valueElement.value);
      if (targetElement.hasAttribute('data-quantity-plus')) {
        value++;
        if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) {
          value = valueElement.dataset.quantityMax;
        }
      } else {
        --value;
        if (+valueElement.dataset.quantityMin) {
          if (+valueElement.dataset.quantityMin > value) {
            value = valueElement.dataset.quantityMin;
          }
        } else if (value < 1) {
          value = 1;
        }
      }
      targetElement.closest('[data-quantity]').querySelector('[data-quantity-value]').value = value;
    }
  });
}
formQuantity();

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: false, autoHeight: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
      if (targetElement.hasAttribute('data-validate')) {
        formValidate.removeError(targetElement);
      }
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      if (targetElement.hasAttribute('data-validate')) {
        formValidate.validateInput(targetElement);
      }
    }
  });
  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('[class*="__viewpass"]')) {
        const input = targetElement.parentElement.querySelector('input');
        const inputType = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', inputType);
        targetElement.classList.toggle('_viewpass-active');
      }
    });
  }
  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min')
          ? Number(textarea.dataset.autoheightMin)
          : textarea.offsetHeight;
        const maxHeight = textarea.hasAttribute('data-autoheight-max')
          ? Number(textarea.dataset.autoheightMax)
          : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight));
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = 'auto';
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }
}
formFieldsInit({
  viewPass: true,
  autoHeight: false
});
let formValidate = {
  getErrors(form) {
    let error = 0;
    const formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;
    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(/\s/g, "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }
    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    const inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    const inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) {
      formRequiredItem.parentElement.removeChild(inputError);
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      const inputs = form.querySelectorAll('input,textarea');
      inputs.forEach(el => {
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');
        formValidate.removeError(el);
      });
      const checkboxes = form.querySelectorAll('.checkbox__input');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      if (flsModules.select) {
        const selects = form.querySelectorAll('div.select');
        selects.forEach(selectBlock => {
          const select = selectBlock.querySelector('select');
          flsModules.select.selectBuild(select);
        });
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};
function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', e => formSubmitAction(form, e));
      form.addEventListener('reset', e => formValidate.formClean(form));
    }
  }

  async function formSubmitAction(form, e) {
    const error = form.hasAttribute('data-no-validate') ? 0 : formValidate.getErrors(form);
    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');
      if (ajax) {
        e.preventDefault();
        const action = form.getAttribute('action')?.trim() || '#';
        const method = form.getAttribute('method')?.trim() || 'GET';
        const formData = new FormData(form);
        form.classList.add('_sending');
        try {
          const response = await fetch(action, { method, body: formData });
          if (response.ok) {
            const result = await response.json();
            form.classList.remove('_sending');
            formSent(form, result);
          } else {
            alert('Ошибка');
            form.classList.remove('_sending');
          }
        } catch {
          alert('Ошибка подключения');
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
        const gotoErrorClass = form.dataset.gotoError || '._form-error';
        gotoBlock(gotoErrorClass, true, 1000);
      }
    }
  }

  function formSent(form, responseResult = '') {
    document.dispatchEvent(new CustomEvent("formSent", { detail: { form } }));
    setTimeout(() => {
      if (flsModules.popup && form.dataset.popupMessage) {
        flsModules.popup.open(form.dataset.popupMessage);
      }
    }, 0);
    formValidate.formClean(form);
    console.log('[Формы]: Форма отправлена!');
  }
}
formSubmit()

//========================================================================================================================================================

//Слайдеры
if (document.querySelector(".block-intro__slider")) {
  produceSlider = new Swiper(".block-intro__slider", {
    observer: true,
    observeParents: true,
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 0,

    pagination: {
      el: '.block-intro__pagination-bullets',
      type: 'custom',
      renderCustom: function (swiper, current, total) {
        // Обновляем фракцию
        document.querySelector('.swiper-pagination-current').textContent = current;
        document.querySelector('.swiper-pagination-total').textContent = total;

        // Генерируем буллеты (максимум 6 видимых)
        let bullets = '';
        const maxVisible = 6;
        let start = 1;
        let end = Math.min(total, maxVisible);

        // Если слайдов больше 6, центрируем активный буллет
        if (total > maxVisible) {
          start = Math.max(1, current - Math.floor(maxVisible / 2));
          start = Math.min(start, total - maxVisible + 1);
          end = start + maxVisible - 1;
        }

        // Генерируем буллеты
        for (let i = start; i <= end; i++) {
          bullets += `<span class="swiper-pagination-bullet ${current === i ? 'swiper-pagination-bullet-active' : ''}" data-index="${i}"></span>`;
        }

        return bullets;
      }
    },

    navigation: {
      prevEl: ".block-intro__arrow-prev",
      nextEl: ".block-intro__arrow-next"
    },

  });
}