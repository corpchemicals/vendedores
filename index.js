import { setSelects, setAddButton, setUlListener, setSubmitForm } from './modules/setForm.mjs'
import { DOM } from './modules/DOM.mjs'

const productsURL = 'https://raw.githubusercontent.com/marcebollin/chemicals-json-products/main/products.json' 

fetch(productsURL)
.then(response => response.json())
.then(products => {
  const totalOrder = []
  const phoneNumber = '+584244044072'

  //Set form
  const checkClientExistence = DOM.get("#toggle-client-existence")
  const newClientFields = document.querySelectorAll(".new-client-field")

  checkClientExistence.addEventListener("change", ({target}) => {
    const container = target.parentElement
    container.classList.toggle("off-color")
    container.classList.toggle("on-color")

    newClientFields.forEach(field => field.classList.toggle("displayNone"))
  })
  setSelects(products) 
  setAddButton(totalOrder, products)
  setUlListener(totalOrder)
  setSubmitForm(totalOrder, phoneNumber)
})
.catch(e => console.error(e))