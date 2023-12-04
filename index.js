// modulos externos
import chalk from "chalk"
import inquirer from "inquirer"

// modulos internos
import fs from "fs"
import { exit } from "process"

// clientes
let clientes = []

// Operações
operation()

function operation() {

  inquirer.prompt([
    {
      type: "list",
      name: 'action',
      message: "O que você deseja fazer?",
      choices: [
        'Criar conta',
        'Consultar saldo',
        'Depositar',
        'Sacar',
        'Sair'
      ]
    }
  ]).then(res => {
    movimentAccont(res.action)
  }).catch(err => {
    console.log(err)
  })
}

async function movimentAccont(action) {
  switch(action) {
    case "Criar conta":
      await createAccont()
      break

    case "Consultar saldo":
      await checkBalance()
      break

    case "Depositar":
      await deposit()
      break

    case "Sacar":
      await withdraw()
      break

    case "Sair":
      exit()

    default:
      console.log(chalk.bgRed.white("Opção invalida. Tente novamente!"))
      break
  }
  operation()
}

class User {
  constructor(nome) {
    this.nome = nome
    this.saldo = 0
  }
}

async function createAccont() {
  console.log(chalk.bgGreen("Parabés por escolher nosso banco!"))
  console.log(chalk.green("Defina as opções da sua conta a seguir"))
  await inquirer.prompt({
    name: "nameAccount",
    message: "Digite um nome para a sua conta: "
  }).then(res => {
    const user = new User(res.nameAccount)
    clientes.push(user)
    console.log(chalk.green(`Olá ${user.nome} sua conta foi criada!`))
  }).catch(err => {
    console.log({msg: err})
  })
}

async function checkBalance() {
  let check = false
  while (!check) {
    await inquirer.prompt({
      name: "nameAccount",
      message: "Qual o nome da sua conta: "
    }).then(res => {
      clientes.map(cliente => {
        if(cliente.nome == res.nameAccount) {
          console.log(chalk.bgBlue(`Olá ${cliente.nome} o seu saldo e R$ ${cliente.saldo}`))
          check = true
        }
      })
      if(!check) {
        console.log(chalk.bgRed.white("Essa conta não existe. Tente novamente!"))
      }
  
    }).catch(err => {
      console.log(err)
    })
  }
}

async function deposit() {
  let check = false
  while(!check) {

    await inquirer.prompt([
      {
        name: "nameAccount",
        message: "Qual o nome da sua conta ?"
      },
      {
        name: "valor",
        message: "Quando você deseja depositar ?"
      }
    ]).then(res => {
      clientes.map(cliente => {
        if (cliente.nome == res.nameAccount) {
          cliente.saldo += parseFloat(res.valor)
          console.log(chalk.green(`Foi depositado R$ ${res.valor} na sua conta.`))
          check = true
        }
      })

      if(!check) {
        console.log(chalk.bgRed.white("Essa conta não foi encontrada. Tente novamente!"))
      }
    })
  }
}

async function withdraw() {
  let check = 0
  while (check < 2) {
    check = 0
    await inquirer.prompt([
      {
        name: "nameAccount",
        message: "Qual o nome da conta ?"
      },
      {
        name: "valor",
        message: "Qual valor você deseja sacar ?"
      }
    ]).then(res => {
      clientes.map(cliente => {
        if(res.nameAccount == cliente.nome) {
          if(cliente.saldo - res.valor > 0) {
            cliente.saldo -= res.valor
            console.log(chalk.bgBlue(`Saque de R$ ${res.valor} realizado com sucesso`))
            check = 2
          } else {
            console.log(chalk.bgRed.white("Não foi possivél realizar o saque pois o saldo e insuficiente. Tente novamente!"))
            check = 1
          }
        }

      })

      if(check == 0) {
        console.log(chalk.bgRed.white("Essa conta não foi encontrada. Tente novamente!"))
      }

    }).catch(err => {
      console.log(err)
    })
  }
}