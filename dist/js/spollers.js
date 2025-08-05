function spollers() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {
        const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        }));
        if (spollersRegular.length) initSpollers(spollersRegular);

        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach((spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add("_spoller-init");
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove("_spoller-init");
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            }));
        }

        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
            if (spollerTitles.length) {
                spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                spollerTitles.forEach((spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerTitle.classList.contains("_spoller-active")) {
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            // Инициализируем showmore при открытом спойлере
                            setTimeout(() => initShowMoreInSpoller(spollerTitle.nextElementSibling), 10);
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
        }

        function initShowMoreInSpoller(spollerBody) {
            const showMoreBlocks = spollerBody.querySelectorAll('[data-showmore]');

            showMoreBlocks.forEach(showMoreBlock => {
                const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
                const showMoreButton = showMoreBlock.querySelector('[data-showmore-button]');
                const items = showMoreContent.children;
                const limit = 6; // Показываем 6 элементов

                if (items.length > limit) {
                    // 1. Сначала сбросим ограничения, чтобы измерить реальные размеры
                    showMoreContent.style.maxHeight = '';
                    showMoreContent.style.overflow = '';

                    // 2. Ждем следующего фрейма для применения стилей
                    setTimeout(() => {
                        // 3. Рассчитываем высоту для 6 элементов
                        let height = 0;
                        const itemHeight = [];

                        // Измеряем высоту каждого из первых 6 элементов
                        for (let i = 0; i < limit; i++) {
                            const item = items[i];
                            const styles = getComputedStyle(item);
                            const marginTop = parseFloat(styles.marginTop) || 0;
                            const marginBottom = parseFloat(styles.marginBottom) || 0;
                            itemHeight.push(item.offsetHeight + marginTop + marginBottom);
                        }

                        // Учитываем промежутки (gap) между элементами
                        const gap = parseFloat(getComputedStyle(showMoreContent).gap) || 0;
                        height = itemHeight.reduce((sum, h) => sum + h, 0) + (gap * (limit - 1));

                        // 4. Применяем рассчитанную высоту
                        showMoreContent.style.maxHeight = `${height}px`;
                        showMoreContent.style.overflow = 'hidden';
                        showMoreButton.hidden = false;

                        // 5. Настройка кнопки "Показать еще"
                        showMoreButton.addEventListener('click', function (e) {
                            e.preventDefault();
                            const isExpanded = showMoreContent.style.maxHeight !== `${height}px`;

                            if (!isExpanded) {
                                showMoreContent.style.maxHeight = `${showMoreContent.scrollHeight}px`;
                                showMoreButton.querySelector('span:first-child').hidden = true;
                                showMoreButton.querySelector('span:last-child').hidden = false;
                            } else {
                                showMoreContent.style.maxHeight = `${height}px`;
                                showMoreButton.querySelector('span:first-child').hidden = false;
                                showMoreButton.querySelector('span:last-child').hidden = true;
                            }
                        });
                    }, 50); // Небольшая задержка для гарантии применения стилей
                } else {
                    showMoreButton.hidden = true;
                }
            });
        }

        function setSpollerAction(e) {
            const el = e.target;
            if (el.closest("[data-spoller]")) {
                const spollerTitle = el.closest("[data-spoller]");
                const spollerItem = spollerTitle.closest(".spollers__item");
                const spollersBlock = spollerTitle.closest("[data-spollers]");
                const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

                if (!spollersBlock.querySelectorAll("._slide").length) {
                    if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
                        hideSpollersBody(spollersBlock);
                    }

                    spollerTitle.classList.toggle("_spoller-active");
                    if (spollerItem) spollerItem.classList.toggle("_spoller-active");

                    const contentBlock = spollerTitle.nextElementSibling;
                    _slideToggle(contentBlock, spollerSpeed, () => {
                        // Инициализируем showonly при открытии спойлера
                        if (spollerTitle.classList.contains("_spoller-active")) {
                            setTimeout(() => initShowMoreInSpoller(contentBlock), 10);
                        }
                    });

                    e.preventDefault();
                }
            }
        }

        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                spollerActiveTitle.classList.remove("_spoller-active");
                _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
            }
        }

        const spollersClose = document.querySelectorAll("[data-spoller-close]");
        if (spollersClose.length) {
            document.addEventListener("click", (function (e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) {
                    spollersClose.forEach((spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }));
                }
            }));
        }
    }
}
spollers();