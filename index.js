import { setSelects, setAddButton, setUlListener, setSubmitForm, setSellersSelector } from './modules/setForm.mjs'
import sellers from './data/sellers.mjs'

const productsURL = 'https://raw.githubusercontent.com/marcebollin/chemicals-json-products/main/products.json' 

fetch(productsURL)
.then(response => response.json())
.then(products => {
  const totalOrder = []
  const phoneNumber = '+584244044072'

  //Set form
  setSellersSelector(sellers)
  setSelects(products) 
  setAddButton(totalOrder, products)
  setUlListener(totalOrder)
  setSubmitForm(totalOrder, phoneNumber)
})
.catch(e => console.error(e))