import { setAddButton, setUlListener, setSubmitForm } from './modules/setForm.mjs'
import { DOM } from './modules/DOM.mjs'

const productsURL = 'https://raw.githubusercontent.com/corpchemicals/products-list/main/products.json' 

class Order {
   constructor() {
      this.productsURL = 'https://raw.githubusercontent.com/corpchemicals/products-list/main/products.json' 
      this.#init()
   }

   async #init() {
      const products = await this.#getProductsFromURL()
      this.#setSelects(products)
   }

   async #getProductsFromURL() {
      //return a promise
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
fetch(productsURL)
.then(response => response.json())
.then(products => {
   const totalOrder = []
   const phoneNumber = '+584244044072'

   const test = new Order()
   setAddButton(totalOrder, products)
   setUlListener(totalOrder)
   setSubmitForm(totalOrder, phoneNumber)
})
.catch(e => console.error(e))