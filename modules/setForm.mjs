import DOM from './DOM.mjs'

export function setSelects(products) {
  const categorySelect = DOM.get("select#category")
  const fromNumberSelect = DOM.get("select#from-number")
  const toNumberSelect = DOM.get("select#to-number")

  //fill number selects
  function fillSelect(select, data, index = 0) {
    const selectOptions = []
    for(const { number, name } of data) {
      const option = DOM.createOption(index, `${number}: ${name}`)
      selectOptions.push(option)
      index++
    }
    select.append(...selectOptions)
  }

  const categoryOptions = []

  //fill category select
  for(const category in products) {
    const option = DOM.createOption(category, category.toUpperCase())
    categoryOptions.push(option)
  } 

  categorySelect.append(...categoryOptions)

  //Event listener when category is changing
  categorySelect.addEventListener("change", ({target}) => {
    DOM.removeAllChilds(fromNumberSelect)
    DOM.removeAllChilds(toNumberSelect)

    const category = target.value
    fillSelect(fromNumberSelect, products[category])
    fillSelect(toNumberSelect, products[category])
  })

  //Event listener when fromNumber is changing
  fromNumberSelect.addEventListener("change", ({target}) => {
    DOM.removeAllChilds(toNumberSelect)

    const category = categorySelect.value
    const fromNumber = +target.value
    const productsRemaining = products[category].slice(fromNumber)

    fillSelect(toNumberSelect, productsRemaining, fromNumber)
  
    toNumberSelect.value = fromNumber
  })
}

export function setButtons(totalOrder, products) {
  const addOrderBtt = DOM.get("button#add-order")

  //print product on ul
  function printProduct(product, ul = DOM.get("#total-order")) {
    const { name, key, amount } = product
    const ulChildren = [...ul.children]
    const liIndex = ulChildren.findIndex(li => li.dataset.key === key)
    
    const li = ulChildren[liIndex] ?? DOM.create("li")
    const innerText = `${name}: ${amount}`
    li.innerText = innerText

    if(liIndex === -1) {
      li.dataset.key = key
      ul.appendChild(li)
    }
  }
  
  addOrderBtt.addEventListener("click", () => {
    const amount = Number(DOM.get("input#amount").value)
    if(amount <= 0) return;
    
    const category = DOM.get("select#category").value
    const from = Number(DOM.get("select#from-number").value)
    const to = Number(DOM.get("select#to-number").value)
    
    const currentOrder = products[category].slice(from, to + 1)
    
    currentOrder.forEach((product) => {
      const productExist = totalOrder.some(element => element.keyName === product.keyName)
      
      (productExist) 
        ? product.amount += amount
        : product.amount = amount;

      totalOrder.push(product)
      printProduct(product)
    }) 
  })
}

export function setUlListener(totalOrder) {
  const totalOrderUl = DOM.get("ul#total-order")
  totalOrderUl.addEventListener("click", ({target}) => {
    const isTargetLi = target.tagName == "LI"
    if(isTargetLi == false) return;
    
    

    DOM.removeElement(target)
  })
}