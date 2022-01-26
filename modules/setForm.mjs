import { DOM } from './DOM.mjs'

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