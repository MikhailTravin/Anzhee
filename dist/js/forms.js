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