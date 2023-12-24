const cartItemsContainer = document.querySelector(
  ".cart-items-section-container"
);
const missingItemsContainer = document.querySelector(
  ".missing-items-container"
);
const cartSummary = document.querySelector(".cart-summary");
const expandCartButton = document.getElementById("expand-cart");
const expandMissingButton = document.getElementById("expand-missing");

const heartIcons = document.querySelectorAll(".heart-icon");
heartIcons.forEach((heartIcon) =>
  heartIcon.addEventListener("click", (event) => {
    const target = event.target;
    if (target.dataset.checked) {
      target.dataset.checked = "";
      target.classList.remove("heart-icon-checked");
    } else {
      target.dataset.checked = "no";
      target.classList.add("heart-icon-checked");
    }
  })
);

const productMissingAmmountElement = document.querySelector(
  ".missing-header-text"
);
const deleteIcons = document.querySelectorAll(".delete-icon");
const deleteIconsMissing = document.querySelectorAll(".delete-icon-missing");
deleteIcons.forEach((deleteIcon) =>
  deleteIcon.addEventListener("click", (event) => {
    event.target.closest(".product-container").remove();
    calculateCart();
  })
);
deleteIconsMissing.forEach((deleteIconMissing) =>
  deleteIconMissing.addEventListener("click", (event) => {
    event.target.closest(".product-container").remove();
    const missingQuantity = document.querySelectorAll(".missing-item").length;
    productMissingAmmountElement.innerHTML = `Отсутствуют · ${missingQuantity} товара`;
  })
);

let cartPriceTotal = 0;
const cartQuantityElement = document.querySelector(".product-quantity-all");
const cartPriceTotalElement = document.querySelector(".product-price-total");
const cartPriceElement = document.querySelector(".product-price-all");
const cartDiscountElement = document.querySelector(".product-discount-all");
const payImmediatelyElement = document.querySelector(".checkbox-total");
const paymenButtonElement = document.querySelector(".btn-payment");
const cartQuantityBadge = document.querySelector(".nav-cart-container");
const calculateCart = () => {
  let cartQuantity = 0;
  let cartPrice = 0;
  let cartDiscount = 0;
  [...cartItemsContainer.querySelectorAll(".item-flex-container")]
    .filter((product) => product.dataset.inCart === "true")
    .forEach((product) => {
      cartQuantity += Number.parseInt(product.dataset.quantity);
      cartPrice +=
        Number.parseInt(product.dataset.quantity) * product.dataset.price;
      cartDiscount +=
        Number.parseInt(product.dataset.quantity) *
        product.dataset.price *
        0.65;
    });
  cartPrice = Math.ceil(cartPrice);
  cartDiscount = Math.floor(cartDiscount);
  cartPriceTotal = (cartPrice - cartDiscount).toLocaleString();
  cartQuantityElement.innerHTML = `${cartQuantity} товаров`;
  if (cartQuantity > 0) {
    cartQuantityBadge.dataset.quantity = cartQuantity;
    cartQuantityBadge.style.display = "block";
  } else {
    cartQuantityBadge.style.display = "none";
  }
  cartPriceElement.innerHTML = `${cartPrice.toLocaleString()} сом`;
  cartDiscountElement.innerHTML = `− ${cartDiscount.toLocaleString()} сом`;
  cartPriceTotalElement.innerHTML = `${cartPriceTotal} сом`;
  if (payImmediatelyElement.querySelector(".checkbox").checked) {
    paymenButtonElement.innerHTML = `Оплатить ${cartPriceTotal} сом`;
  }
};
calculateCart();

const calculateProductPrice = (product) => {
  product.querySelectorAll(".h3-price").forEach((price) => {
    price.innerHTML = Math.ceil(
      product.dataset.quantity * product.dataset.price * 0.35
    ).toLocaleString();
  });
  product.querySelectorAll(".text-discount").forEach((discount) => {
    discount.innerHTML = `${
      Math.ceil(
        product.dataset.quantity * product.dataset.price
      ).toLocaleString() + " сом"
    }
    <div class="tooltip-discount">
      <div class="tooltip-column">
       <span class="discount-grey-text">
        Скидка 55%
       </span>
        <span class="discount-grey-text">
          Скидка покупателя 10%
        </span>
      </div>
      <div class="tooltip-column">
        <span class="discount-text">
         −${Math.floor(
           product.dataset.quantity * product.dataset.price * 0.55
         )} сом
        </span>
        <span class="discount-text">
         −${Math.floor(
           product.dataset.quantity * product.dataset.price * 0.1
         )} сом
        </span>
      </div>
    </div>
    `;
  });
};

const caseAdditionalElement = document.getElementById("case-additional");
const deliveryProducts = document.querySelectorAll(".delivery-product-img");
const syncProductQuantity = (id, quantity) => {
  const deliveryProduct = [...deliveryProducts].find(
    (product) => product.dataset.id === id
  );
  const badge = deliveryProduct.querySelector(".badge");
  if (id === "case") {
    if (quantity > 184) {
      badge.dataset.quantity = 184;
      const caseBadge = caseAdditionalElement.querySelector(".badge");
      caseBadge.dataset.quantity = quantity - 184;
      caseBadge.style.display = "block";
      caseAdditionalElement.style.display = "flex";
    } else {
      badge.dataset.quantity = quantity;
      if (quantity > 1) {
        badge.style.display = "block";
      } else {
        badge.style.display = "none";
      }
      caseAdditionalElement.style.display = "none";
    }
  } else {
    if (quantity > 1) {
      badge.style.display = "block";
    } else {
      badge.style.display = "none";
    }
  }
};

const minusProductButtons = document.querySelectorAll(".minus-product-btn");
minusProductButtons.forEach((mpb) =>
  mpb.addEventListener("click", (event) => {
    const target = event.target;
    const product = target.closest(".item-flex-container");
    let quantity = Number.parseInt(product.dataset.quantity);
    quantity--;
    product.dataset.quantity = quantity;
    product.querySelector(".counter-text-container").innerHTML = quantity;
    calculateProductPrice(product);
    if (quantity === 1) {
      target.disabled = true;
      target.classList.add("btn-inactive");
    }
    const plusButton = product.querySelector(".plus-product-btn");

    if (plusButton.disabled && product.dataset.remaining - quantity > 0) {
      plusButton.disabled = false;
      plusButton.classList.remove("btn-inactive");
    }
    calculateCart();
    syncProductQuantity(product.dataset.id, product.dataset.quantity);
  })
);

const plusProductButtons = document.querySelectorAll(".plus-product-btn");
plusProductButtons.forEach((ppb) =>
  ppb.addEventListener("click", (event) => {
    const target = event.target;
    const product = target.closest(".item-flex-container");
    let quantity = Number.parseInt(product.dataset.quantity);
    quantity++;
    product.dataset.quantity = quantity;
    product.querySelector(".counter-text-container").innerHTML = quantity;
    calculateProductPrice(product);
    if (product.dataset.remaining == quantity) {
      target.disabled = true;
      target.classList.add("btn-inactive");
    }
    const minusButton = product.querySelector(".minus-product-btn");

    if (minusButton.disabled && quantity > 0) {
      minusButton.disabled = false;
      minusButton.classList.remove("btn-inactive");
    }
    calculateCart();
    syncProductQuantity(product.dataset.id, product.dataset.quantity);
  })
);

const checkAllCheckbox = document.querySelector(".check-all-checkbox");
const checkboxes = document.querySelectorAll(".product-checkbox");
checkboxes.forEach((checkbox) =>
  checkbox.addEventListener("click", (event) => {
    if (event.target.checked) {
      checkbox.checked = true;
      checkbox.closest(".item-flex-container").dataset.inCart = "true";
    } else {
      checkbox.checked = false;
      checkbox.closest(".item-flex-container").dataset.inCart = "false";
    }
    calculateCart();
  })
);
document.getElementById("check-all").addEventListener("click", (event) => {
  if (event.target.checked) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
      checkbox.closest(".item-flex-container").dataset.inCart = "true";
    });
  } else {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.closest(".item-flex-container").dataset.inCart = "false";
    });
  }
  calculateCart();
});

cartItemsContainer.dataset.expanded = "true";
missingItemsContainer.dataset.expanded = "true";

expandCartButton.addEventListener("click", () => {
  const isExpanded = cartItemsContainer.dataset.expanded;
  if (isExpanded) {
    cartItemsContainer.classList.add("expand-hidden");
    expandCartButton.classList.add("arrow-rotated");
    checkAllCheckbox.classList.add("hide-checkbox");
    cartItemsContainer.dataset.expanded = "";
    cartSummary.innerHTML = `bebra`;
  } else {
    cartItemsContainer.classList.remove("expand-hidden");
    expandCartButton.classList.remove("arrow-rotated");
    checkAllCheckbox.classList.remove("hide-checkbox");
    cartItemsContainer.dataset.expanded = "true";
    cartSummary.innerHTML = ``;
  }
});

expandMissingButton.addEventListener("click", () => {
  const isExpanded = missingItemsContainer.dataset.expanded;
  if (isExpanded) {
    missingItemsContainer.classList.add("expand-hidden");
    expandMissingButton.classList.add("arrow-rotated");
    missingItemsContainer.dataset.expanded = "";
  } else {
    missingItemsContainer.classList.remove("expand-hidden");
    expandMissingButton.classList.remove("arrow-rotated");
    missingItemsContainer.dataset.expanded = "true";
  }
});

payImmediatelyElement.addEventListener("click", (event) => {
  if (event.target.checked) {
    paymenButtonElement.innerHTML = `Оплатить ${cartPriceTotal} сом`;
  } else {
    paymenButtonElement.innerHTML = `Заказать`;
  }
  calculateCart();
});

const deliveryModalButton = document.querySelectorAll(".delivery-modal-button");
const deliveryModal = document.getElementById("modal-delivery");
const paymentModalButton = document.querySelectorAll(".payment-modal-button");
const paymentModal = document.getElementById("modal-payment");
const closeModalButtons = document.querySelectorAll(".close-icon");
const cartPaymentCardElements = document.querySelectorAll(".payment-info");
const deliveryAddressElements = document.querySelectorAll(".delivery-address");
const chooseCardButton = document.querySelector(".choose-card-button");
const chooseAddressButton = document.querySelector(".choose-address-button");
const modalAddressCourier = document.querySelector(".modal-address-courier");
const modalAddressPickup = document.querySelector(".modal-address-pickup");
const buttonPickup = document.querySelector(".button-pickup");
const buttonCourier = document.querySelector(".button-courier");
const deliveryTypeElement1 = document.querySelector(".delivery-type-1");
const deliveryTypeElement2 = document.querySelector(".delivery-type-2");
const deliveryRatingElement = document.querySelector(".address-rating");
const radioInputs = paymentModal.querySelectorAll(".radio");

deliveryModalButton.forEach((dmb) => {
  dmb.addEventListener("click", () => {
    deliveryModal.style.display = "flex";
  });
});

paymentModalButton.forEach((pmb) => {
  pmb.addEventListener("click", () => {
    paymentModal.style.display = "flex";
  });
});

closeModalButtons.forEach((cmb) => {
  cmb.addEventListener("click", () => {
    cmb.closest(".app-modal").style.display = "none";
    radioInputs.forEach((input) => {
      input.checked = false;
    });
  });
});

const checkRadio = (container, radio) => {
  container
    .querySelectorAll(".radio")
    .forEach((radio) => (radio.checked = false));
  radio.checked = true;
  return radio.value;
};

let creditCard = "images/mir.svg,1234 12•• •••• 1234";
paymentModal.querySelectorAll(".radio-container").forEach((paymentRadio) => {
  paymentRadio.addEventListener("click", () => {
    const radioInput = paymentRadio.querySelector(".radio");
    if (!radioInput.checked) {
      creditCard = checkRadio(paymentModal, radioInput).split(",");
    }
  });
});

paymentModal.querySelectorAll("label").forEach((label) => {
  label.addEventListener("click", () => {
    radioInputs.forEach((input) => {
      if (input.id !== label.getAttribute("for")) {
        input.checked = false;
      } else {
        input.checked = true;
        creditCard = checkRadio(paymentModal, input).split(",");
      }
    });
  });
});

chooseCardButton.addEventListener("click", () => {
  cartPaymentCardElements.forEach(
    (el) =>
      (el.innerHTML = `
  <img src="${creditCard[0]}" alt="mir card logo" />
  <span class="card-number pickup-text">
  ${creditCard[1]}
  </span>
`)
  );
  paymentModal.style.display = "none";
});

let address = "Бишкек, улица Ахматбека Суюмбаева, 12/1";
deliveryModal.querySelectorAll(".radio-container").forEach((deliveryRadio) => {
  deliveryRadio.addEventListener("click", () => {
    const radioInput = deliveryRadio.querySelector(".radio");
    if (!radioInput.checked) {
      address = checkRadio(deliveryModal, radioInput).split("$");
    }
  });
});

chooseAddressButton.addEventListener("click", () => {
  console.log(address);
  deliveryAddressElements.forEach((dae) => {
    dae.innerHTML = address[0];
  });
  deliveryTypeElement1.innerHTML = `Доставка ${address[1]}`;
  deliveryTypeElement2.innerHTML =
    address[1].charAt(0).toUpperCase() + address[1].slice(1);
  if (address[1] === "курьером") {
    deliveryRatingElement.style.display = "none";
  } else {
    deliveryRatingElement.style.display = "flex";
  }
  deliveryModal.style.display = "none";
});

buttonPickup.addEventListener("click", () => {
  buttonPickup.classList.add("btn-active");
  buttonCourier.classList.remove("btn-active");
  modalAddressCourier.style.display = "none";
  modalAddressPickup.style.display = "flex";
});

buttonCourier.addEventListener("click", () => {
  buttonCourier.classList.add("btn-active");
  buttonPickup.classList.remove("btn-active");
  modalAddressPickup.style.display = "none";
  modalAddressCourier.style.display = "flex";
});

document.querySelectorAll(".delete-icon-modal").forEach((dim) => {
  dim.addEventListener("click", () => {
    dim.closest(".address-container").remove();
  });
});

document.querySelectorAll(".input-info").forEach((ic) => {
  const input = ic.querySelector(".input");
  input.addEventListener("input", (event) => {
    const label = ic.querySelector(".input-label");
    if (event.target.value.length > 0) {
      label.style.display = "block";
    } else {
      label.style.display = "none";
    }
  });
});

const nameInput = document.getElementById("name");
nameInput.querySelector(".input").addEventListener("input", (event) => {
  if (
    event.target.value.length &&
    !/^[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/.test(
      event.target.value
    )
  ) {
    nameInput.querySelector(".input-error").style.display = "block";
  } else {
    nameInput.querySelector(".input-error").style.display = "none";
  }
});
const surnameInput = document.getElementById("surname");
surnameInput.querySelector(".input").addEventListener("input", (event) => {
  if (
    event.target.value.length &&
    !/^[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/.test(
      event.target.value
    )
  ) {
    surnameInput.querySelector(".input-error").style.display = "block";
  } else {
    surnameInput.querySelector(".input-error").style.display = "none";
  }
});
