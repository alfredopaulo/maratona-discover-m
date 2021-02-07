const Modal = {
    open(){
      document.querySelector('.modal-overlay').classList.add('active')
    },

    close(){
      document.querySelector('.modal-overlay').classList.remove('active')
    }
  }

  const Storage = {
    get() {
      return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  
    }, 
    set(transactions){
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
  }
  



  const Transaction = {
      all: Storage.get(),

      add(transaction){
        Transaction.all.push(transaction)
        App.reload()
      },  
    
      remove(index){
        Transaction.all.splice(index,1)
        App.reload()
      },
      incomes(){
          let income = 0;

          Transaction.all.forEach(transaction =>{
              if(transaction.amount > 0){
                  income+= transaction.amount
              }
          })
        //somar as entradas
        return income;
      },
      expenses(){
        let expense = 0;

        Transaction.all.forEach(transaction =>{
            if(transaction.amount < 0){
                expense+= transaction.amount
            }
        })
        // somar as saídas
        return expense
      },

      total (){
        return Transaction.incomes() + Transaction.expenses()

      }
  }

  

  const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction , index){
       // console.log(transaction)
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        //console.log(tr.innerHTML)
        DOM.transactionsContainer.appendChild(tr)
    },

      innerHTMLTransaction(transaction, index){

        const CSSclass = transaction.amount > 0 ? "income": "expense"
        const amount = Utils.formatCurrency(transaction.amount) 
        
          const html =  `
          
          <td class= "description">${transaction.description}</td>
          <td class="${CSSclass}">${amount}</td>
          <td class="date">${transaction.date}</td>
          <td>
            <img onclick = "Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
          </td>
      `
        return html

      },

      updateBalance(){
          document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency( Transaction.incomes())
          document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency( Transaction.expenses())
          document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency( Transaction.total())
      },
      clearTrasactions(){
        DOM.transactionsContainer.innerHTML = ""
      }



  }

  
  const Utils = {

    

    formatAmount(value){

      value = Number(value.replace(/\,\./g,"")) * 100
      

      return value
      
    },

    formatDate(date){
      const splittedDate = date.split("-")

      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },



    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")


        value = Number(value)/100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        //console.log( signal + value)

        return signal + value
    }
}



const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  formatData(){
    console.log("Formatar os dados")
  },
  validateFields(){
    const {description, amount, date} = Form.getValues()
    if(description.trim() === "" || amount.trim() ==="" || date.trim()=== ""){
      throw new Error("Por favor , preencha todos os campos")
    }
  },
  formatValues(){
    let {description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  


  },

  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },


  submit(event){
    event.preventDefault()

    try{
      Form.validateFields()
      const transaction =   Form.formatValues()
      Transaction.add(transaction)

      Form.clearFields()
      Modal.close()


    } catch (error){
      alert(error.message)
    } 
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)
  
      DOM.updateBalance()

      Storage.set(Transaction.all)
  
    },


  reload(){
    DOM.clearTrasactions()
    App.init()
  },
}








App.init()


// testee







const html = document.querySelector("html")
const checkbox = document.querySelector("input[name=theme]")


checkbox.addEventListener("change", ({target}) => {
  if(target.checked){
    document.getElementById('dracula').src = './assets/draculaVerde.png'
  }else{
    document.getElementById('dracula').src = './assets/draculaff.png'
  }
})


const getStyle = (element, style) => 
    window
        .getComputedStyle(element)
        .getPropertyValue(style)


const initialColors = {
  
    darkBlue: getStyle(html, "--dark-blue"),
    green: getStyle(html, "--green"),
    lightGreen: getStyle(html, "--light-green"),
    darkClaro: getStyle(html, " --dark-claro"),
}

const darkMode = {
    green: "#49AA26",
    lightGreen: "#2D4A22",
    darkClaro: "#f0f2f5"
}

const transformKey = key => 
    "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()


const changeColors = (colors) => {
    Object.keys(colors).map(key => 
        html.style.setProperty(transformKey(key), colors[key]) 
    )
}


checkbox.addEventListener("change", ({target}) => {
    target.checked ? changeColors(darkMode) : changeColors(initialColors)
})

const isExistLocalStorage = (key) => 
  localStorage.getItem(key) != null

const createOrEditLocalStorage = (key, value) => 
  localStorage.setItem(key, JSON.stringify(value))

const getValeuLocalStorage = (key) =>
  JSON.parse(localStorage.getItem(key))

checkbox.addEventListener("change", ({target}) => {
  if (target.checked) {
    changeColors(darkMode) 
    createOrEditLocalStorage('modo','darkMode')
  } else {
    changeColors(initialColors)
    createOrEditLocalStorage('modo','initialColors')
  }
})

if(!isExistLocalStorage('modo'))
  createOrEditLocalStorage('modo', 'initialColors')


if (getValeuLocalStorage('modo') === "initialColors") {
  checkbox.removeAttribute('checked')
  changeColors(initialColors);
} else {
  checkbox.setAttribute('checked', "")
  changeColors(darkMode);
}





