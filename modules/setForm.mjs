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

export function setUlListener(totalOrder) {
  const totalOrderUl = DOM.get("ul#total-order")
  
  totalOrderUl.addEventListener("click", ({target}) => {
    const isTargetLi = target.tagName == "LI"
    if(isTargetLi == false) return;
    
    const productIndex = totalOrder.findIndex(product => product.keyName === target.dataset.keyName)
    totalOrder.splice(productIndex, 1)
    
    DOM.removeElement(target)
  })
}

export function setAddButton(totalOrder, products) {
  const addOrderBtt = DOM.get("button#add-order")

  //print product on ul
  function printProduct(product, ul = DOM.get("#total-order")) {
    const { name, keyName, amount } = product
    const ulChildren = [...ul.children]
    const liIndex = ulChildren.findIndex(li => li.dataset.keyName === keyName)
    
    const li = ulChildren[liIndex] ?? DOM.create("li")
    const innerText = `${name}: ${amount}`
    li.innerText = innerText

    if(liIndex === -1) {
      li.dataset.keyName = keyName
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
      const productIndex = totalOrder.findIndex(element => element.keyName === product.keyName)
      const productExist = (productIndex > -1)

      if(productExist) totalOrder[productIndex].amount += amount
      else {
        product.amount = amount
        totalOrder.push(product)
      }

      printProduct(product)
    }) 
  })
}

export function setSubmitForm(totalOrder, phoneNumber) {
  const form = document.querySelector("form#send-order-form")
  
  form.addEventListener("submit", ({target}) => {
    let message = 
      `Cliente: Marcelo Temporal \nVendedor: 5 \nPedido: \n\n`

    for(const order of totalOrder) {
      const { keyName, amount} = order
      const text = `${keyName.toUpperCase()}: ${amount} unds. \n`
      message += text
    }
 
    const encodedMessage = encodeURI(message)
    const startedLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=`
    const url = `${startedLink}${encodedMessage}`

    window.open(url, '_blank')
  })
}