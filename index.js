import { setSelects, setAddButton, setUlListener, setSubmitForm } from './modules/setForm.mjs'

const productsURL = 'https://raw.githubusercontent.com/marcebollin/chemicals-json-products/main/products.json?token=APAMFQPPS2FV5FX7ME362LTBSPZKW' 

fetch(productsURL)
.then(response => response.json())
.then(products => {
  const totalOrder = []
  const phoneNumber = '+584244044072'

  //Set form
  setSelects(products) 
  setAddButton(totalOrder, products)
  setUlListener(totalOrder)
  setSubmitForm(totalOrder, phoneNumber)
})
.catch(e => console.error(e))