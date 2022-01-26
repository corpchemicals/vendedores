import { DOM } from './DOM.mjs'

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
    <img class="trash-icon" src="./assets/trash-icon.svg" alt="Eliminar pedido">`
    li.innerHTML = innerHTML
    
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

    let totalPrice = totalOrder.reduce((acc, obj) => {
      const {amount, uPrice} = obj
      return acc + (amount * uPrice)
    }, 0);

    const totalPriceElement = document.querySelector("#total-price")
    totalPriceElement.dataset.totalPrice = totalPrice 
    totalPriceElement.innerText = totalPrice.toFixed(2) + "$"
  })
}

export function setSubmitForm(totalOrder, phoneNumber) {
  const form = document.querySelector("form#send-order-form")
  
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if(totalOrder.length < 1)  {
      return; 
    }

    Swal.fire({
      title: '¿Seguro que quieres enviar el pedido?',
      text: "No podrás realizar cambios después",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const seller = DOM.get("#seller").value

        const client = {
          name: DOM.get("#client-name").value, 
          phone: DOM.get("#phone-area-code").value +  "-" + DOM.get("#client-phone").value || "----",
          id: DOM.get("#identification-type").value + "-" + DOM.get("#client-identification").value || "----",
          address: DOM.get("#client-address").value || "----"
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
      }
    })
  })
}