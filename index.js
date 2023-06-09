const DOM = {
  content: document.querySelector("#content"),
  controllers: document.querySelector("#controllers"),
};
const DEFAULT_NUMBER_OF_PRODUCTS = 5;

function init() {
  const limitsOptionsArray = [
    { value: 5, text: 5 },
    { value: 10, text: 10, selected: true },
    { value: 15, text: 15 },
    { value: 20, text: 20 },
  ];
  const selectOption = getSelect(limitsOptionsArray, (value) => {
    getProductsHandler(value);
  });

  const skipOptionsArray = [
    { value: 0, text: 0 , selected: true },
    { value: 5, text: 5 },
    { value: 10, text: 10 },
    { value: 15, text: 15 },
    { value: 20, text: 20 },
  ];
  const selectSkipOption = getSelect(skipOptionsArray, (value) => {
    getProductsHandler(selectOption.value, value);
  });

  const defaultValue = limitsOptionsArray.find((item) => item.selected);
  const defaultSkipValue = skipOptionsArray.find((item) => item.selected);

  let currentSkip = 0

  const skipBack = document.createElement("button");
  skipBack.innerText = "Back"
  skipBack.addEventListener("click", () => {
    if (currentSkip > 0) {
      currentSkip -= parseInt(selectOption.value);
      getProductsHandler(selectOption.value, currentSkip);
    }
  })

  const skipNext = document.createElement("button");
  skipNext.innerText = "Next"
  skipNext.addEventListener("click", () => {
    currentSkip > 0
      currentSkip += parseInt(selectOption.value)
     getProductsHandler(selectOption.value, currentSkip);
  })
 

  DOM.controllers.append(selectOption, selectSkipOption, skipBack, skipNext);

  getProductsHandler(defaultValue?.value || DEFAULT_NUMBER_OF_PRODUCTS, defaultSkipValue.value);
}
init();
async function getProductsHandler(limit, skip) {
  try {
    showLoader();
    const result = await getProducts(limit, skip);
    const products = result.products;
    if (!Array.isArray(products)) throw new Error("Api error");
    draw(products);
  } catch (error) {
    swal({
      title: "Something went wrong!",
      text: "Contact admin",
      icon: "error",
    });
  } finally {
    removeLoader();
  }
}

function draw(result) {
  DOM.content.innerHTML = "";
  if (Array.isArray(result)) {
    for (let index = 0; index < result.length; index++) {
      drawProduct(result[index]);
    }
  } else {
    drawProduct(result);
  }
}
function drawProduct(product) {
  const div = document.createElement("div");
  const img = getImg(product?.thumbnail);
  const h2 = document.createElement("h2");
  h2.innerText = `${product?.price} $`;
  const h1 = document.createElement("h1");
  h1.innerText = product.title;

  div.classList.add("cardi");
  div.append(h1, h2, img);
  DOM.content.append(div);
}

async function getProducts(limit = 10, skip = 10) {
  const result = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  const json = await result.json();
  return json;
}
{

}
function showLoader() {
  DOM.content.innerHTML = "";
  const loader = document.createElement("div");
  loader.id = "searchLoader";
  loader.classList.add("spinner-border");
  DOM.content.append(loader);
}

function removeLoader() {
  const loader = document.querySelector("#searchLoader");
  if (loader) {
    loader.remove();
  }
}