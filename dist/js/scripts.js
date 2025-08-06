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