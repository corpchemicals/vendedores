import { setSubmitForm } from './modules/setForm.mjs'
import { DOM } from './modules/DOM.mjs'
class Order {
   constructor() {
      this.sendPhone = '+584244044072'
      this.total = []
      this.price = 0
      this.#init()
   }

   #init() {
      this.#setListElementListener()
   }

   #updateTotalPriceElement() {
      const totalPriceElement = DOM.get("#total-price")
      totalPriceElement.innerText = this.price.toFixed(2) + "$"
   }

   #setListElementListener() {
         DOM.get("#total-order").addEventListener("click", ({target}) => {
            const isTargetTrashIcon = target.tagName == "IMG" //for icon
            if(isTargetTrashIcon == false) return;
            const productElement = target.parentElement

            const productIndex = 
               this.total.findIndex(product => product.keyName === productElement.dataset.keyName)
            
            const { uPrice, amount } = this.total[productIndex]            
            const priceToRemove = uPrice * amount
            this.price -= priceToRemove

            this.#updateTotalPriceElement()           
            this.total.splice(productIndex, 1)
            
            DOM.removeElement(productElement)
         })
      }
   
   addProducts(products, amount) {
      products.forEach((product) => {
         const productIndex = this.total.findIndex(element => element.keyName === product.keyName)
         const productExist = (productIndex > -1)
         
         if(productExist) this.total[productIndex].amount += amount
         else {
            product.amount = amount
            this.total.push(product)
         }
         
         this.#printProduct(product)

         const { uPrice } = product
         this.price += uPrice * amount
         this.#updateTotalPriceElement()
      }) 
   }

   #printProduct(product) {
      const listElement = DOM.get("#total-order")
      const listChildren = [...listElement.children]
      const listChildIndex = listChildren.findIndex(child => child.dataset.keyName === product.keyName)
      
      const listChild = listChildren[listChildIndex] ?? DOM.create("li")
      this.#fillProductListElement(listChild, product)
      
      if(listChildIndex === -1) {
         listChild.dataset.keyName = product.keyName
         listElement.appendChild(listChild)
      }
   }

   #fillProductListElement(container, product) {
      const { name, keyName, amount, uPrice } = product
      const productPrice = amount * uPrice
      
      // if product list was already included into dom
      const existentPrice = container.querySelector(".product-price")
      if(existentPrice) {
         const existentAmount = container.querySelector(".product-amount")
         existentAmount.innerText = `: ${amount} unds. `
         existentPrice.innerText = productPrice.toFixed(2) + "$"
         return
      }
      
      // abbr keyName tag
      const abbr = DOM.create("abbr")
      abbr.classList.add('listed-product')
      abbr.title = name
      abbr.tabIndex = 0
      abbr.innerText = keyName
      container.append(abbr)
      
      //  p container for amount and price span tags
      const p = DOM.create("p")
      p.classList.add("order-product-info")

         // span amount tag
      const spanAmount = DOM.create("span")
      spanAmount.classList.add("product-amount")
      spanAmount.innerText = `: ${amount} unds. `
      p.append(spanAmount)

         // span price tag
      const spanPrice = DOM.create("span")
      spanPrice.classList.add("product-price")
      spanPrice.innerText = productPrice.toFixed(2) + "$"
      p.append(spanPrice)

      container.append(p)

      // img trash icon tag 
      const img = DOM.create("img")
      img.classList.add("trash-icon")
      img.src = "./assets/trash-icon.svg"
      img.alt = "Eliminar pedido"
      container.append(img)
   }

   
}
class Session {
    constructor() {
         this.productsURL = 'https://raw.githubusercontent.com/corpchemicals/products-list/main/products.json' 
         this.#init()
         this.order = new Order()
      }
      
      async #init() {
         const products = await this.#getProductsFromURL()
         this.#setSelects(products)
         this.#setAddButton(products)
    }

    async #getProductsFromURL() {
         const response = await fetch(this.productsURL)
         return response.json()
    }

    #setSelects(products) {
         const categorySelect = DOM.get("select#category")
         const fromNumberSelect = DOM.get("select#from-number")
         const toNumberSelect = DOM.get("select#to-number")

         //fill categorySelect
         this.#fillSelects({
             select: categorySelect, 
             data: products, 
             isCategory: true
         })

         //Event listener when category is changing
         categorySelect.addEventListener("change", ({target}) => {
             DOM.removeAllChilds(fromNumberSelect)
             DOM.removeAllChilds(toNumberSelect)

             const category = target.value

             this.#fillSelects({
                  select: fromNumberSelect, 
                  data: products[category]
             })

             this.#fillSelects({
                  select: toNumberSelect, 
                  data: products[category]
             })
         })

         //Event listener when fromNumber is changing
         fromNumberSelect.addEventListener("change", ({target}) => {
             DOM.removeAllChilds(toNumberSelect)

             const category = categorySelect.value
             const fromNumber = +target.value
             const productsRemaining = products[category].slice(fromNumber)

             this.#fillSelects({
                  select: toNumberSelect, 
                  data: productsRemaining, 
                  index: fromNumber
             })

             toNumberSelect.value = fromNumber
         })
    }

    #fillSelects({select, data, isCategory = false, index = 0}) {
         const selectOptions = []
         
         if(isCategory) {
             for(const category in data) {
                  const option = DOM.createOption(category, category.toUpperCase())
                  selectOptions.push(option)
             } 
         } else {
             for(const { number, name } of data) {
                  const option = DOM.createOption(index, `${number}: ${name}`)
                  selectOptions.push(option)
                  index++
             }
         }

         select.append(...selectOptions)
    }

    #setAddButton(products) {
         DOM.get("button#add-order").addEventListener("click", () => {
            const amount = Number(DOM.get("input#amount").value)
            if(amount <= 0) return;
            
            const category = DOM.get("select#category").value
            const from = Number(DOM.get("select#from-number").value)
            const to = Number(DOM.get("select#to-number").value)
            
            const currentOrder = products[category].slice(from, to + 1)
            this.order.addProducts(currentOrder, amount)
         })
      }
}


//Set form
const checkClientExistence = DOM.get("#toggle-client-existence")
const newClientFields = document.querySelectorAll(".new-client-field")

checkClientExistence.addEventListener("change", ({target}) => {
    const container = target.parentElement
    container.classList.toggle("off-color")
    container.classList.toggle("on-color")

    newClientFields.forEach(field => {
         const inputs = field.querySelectorAll("input")
         
         inputs.forEach(input => {
             const wasntRemoved = input.hasAttribute("required")
             if(wasntRemoved) input.removeAttribute("required")
             else input.required = true
         })

         field.classList.toggle("displayNone")
    })
})

const session = new Session()