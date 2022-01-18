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
  const totalOrderUl = DOM.get("#total-order")
  
  totalOrderUl.addEventListener("click", ({target}) => {
    const isTargetTrashIcon = target.tagName == "IMG" //for icon
    if(isTargetTrashIcon == false) return;
    const productElement = target.parentElement
    console.log(productElement);
    const productIndex = 
      totalOrder.findIndex(product => product.keyName === productElement.dataset.keyName)
    
    const { uPrice, amount } = totalOrder[productIndex]
    const priceToRemove = uPrice * amount
    const totalPriceElement = DOM.get("#total-price")
    const newTotalPrice = +totalPriceElement.dataset.totalPrice - priceToRemove 
    totalPriceElement.dataset.totalPrice = newTotalPrice
    totalPriceElement.innerText = newTotalPrice.toFixed(2) + "$"

    totalOrder.splice(productIndex, 1)

    DOM.removeElement(productElement)
  })
}

export function setAddButton(totalOrder, products) {
  const addOrderBtt = DOM.get("button#add-order")
  
  //print product on ul
  function printProduct(product, ul = DOM.get("#total-order")) {
    const { name, keyName, amount, uPrice } = product
    const ulChildren = [...ul.children]
    const liIndex = ulChildren.findIndex(li => li.dataset.keyName === keyName)
    const orderPrice = amount * uPrice
    
    const li = ulChildren[liIndex] ?? DOM.create("li")
    const innerHTML = 
    ` <abbr class="listed-product" title="${name}" tabindex="0">${keyName}</abbr>
    : ${amount} unds. <span class="order-price">${orderPrice.toFixed(2)}$</span>
    <img class="trash-icon" src="../assets/trash-icon.svg" alt="ícono de basura">`
    li.innerHTML = innerHTML
    
    if(liIndex === -1) {
      li.dataset.keyName = keyName
      ul.appendChild(li)
    }
    
    return orderPrice
  }
  
  addOrderBtt.addEventListener("click", () => {
    let totalPrice = 0
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

      totalPrice += printProduct(product)
    }) 

    const totalPriceElement = document.querySelector("#total-price")
    totalPriceElement.dataset.totalPrice = totalPrice 
    totalPriceElement.innerText = totalPrice.toFixed(2) + "$"
  })
}

export function setSubmitForm(totalOrder, phoneNumber) {
  const form = document.querySelector("form#send-order-form")
  
  form.addEventListener("submit", (ev) => {
    if(totalOrder.length < 1)  {
      ev.preventDefault();
      return; 
    }

    // Replace for sweetAlert
    alert("Seguro que quieres enviar el pedido?")

    const seller = DOM.get("#seller").value

    const client = {
      name: DOM.get("#client-name").value, 
      phone: DOM.get("#phone-area-code").value +  "-" + DOM.get("#client-phone").value,
      id: DOM.get("#identification-type").value + "-" + DOM.get("#client-identification").value,
      address: DOM.get("#client-address").value
    }

    let message = 
    `Vendedor: ${seller} \nCliente: ${client.name} \nTeléfono: ${client.phone} \nIdentificación: ${client.id} \nDirección: ${client.address}\nPedido: \n\n`
    
    let orderPrice = 0
    
    for(const order of totalOrder) {
      const { keyName, amount, uPrice} = order
      const text = `-${keyName.toUpperCase()}: ${amount} unds. \n`
      message += text
      orderPrice += amount * uPrice
    }

    const priceMessage = `Precio Total: ${orderPrice.toFixed(2)}$`
    message += `\n${priceMessage}`

    const encodedMessage = encodeURI(message)
    const startedLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=`
    const url = `${startedLink}${encodedMessage}`

    window.open(url, '_blank')
  })
}