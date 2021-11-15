import { setSelects, setButtons, setUlListener } from './modules/setForm.mjs'

const productsURL = 'https://raw.githubusercontent.com/marcebollin/chemicals-json-products/main/products.json?token=APAMFQPPS2FV5FX7ME362LTBSPZKW' 

fetch(productsURL)
.then(response => response.json())
.then(products => {
  const totalOrder = []

  //Set form
  setSelects(products) 
  setButtons(totalOrder, products)
  setUlListener(totalOrder)
})
.catch(e => console.error(e))