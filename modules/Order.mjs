import { DOM } from './DOM.mjs'

export class Order {
   constructor() {
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