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
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((res) => {
      movimentAccont(res.action)
    })
    .catch((err) => {
      console.log(err)
    })
}

async function movimentAccont(action) {
  switch (action) {
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
      console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"))
      exit()

    default:
      console.log(chalk.bgRed.white("Opção invalida. Tente novamente!"))
      break
  }
  operation()
}

async function createAccont() {
  console.log(chalk.bgGreen("Parabés por escolher nosso banco!"))
  console.log(chalk.green("Defina as opções da sua conta a seguir"))
  await inquirer
    .prompt({
      name: "nameAccount",
      message: "Digite um nome para a sua conta: ",
    })
    .then((res) => {
      const accountName = res.nameAccount

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts")
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        )
        return
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err)
        }
      )

      console.log(chalk.green("Parabéns, a sua conta foi criada!"))
    })
    .catch((err) => {
      console.log({ msg: err })
    })
}

async function checkBalance() {
  await inquirer
    .prompt({
      name: "nameAccount",
      message: "Qual o nome da sua conta: ",
    })
    .then((res) => {
      const accountName = res.nameAccount

      if (!checkAccount(accountName)) {
        return
      }

      let balanceAccount = getAccount(accountName).balance

      console.log(
        chalk.bgBlue.white(`O saldo da sua conta e R$ ${balanceAccount}`)
      )
    })
    .catch((err) => {
      console.log(err)
    })
}

async function deposit() {
  await inquirer
    .prompt([
      {
        name: "nameAccount",
        message: "Qual o nome da sua conta ?",
      },
      {
        name: "amount",
        message: "Qual valor você deseja depositar ?",
      },
    ])
    .then((res) => {
      const accountName = res.nameAccount

      // verify if account exists
      if (!checkAccount(accountName)) {
        return deposit()
      }

      const amount = res.amount

      // add an amount
      addAmount(accountName, amount)
    })
    .catch((err) => {
      console.log(err)
    })
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Esta conta não existe, escolha outro nome"))
    return false
  }

  return true
}

function addAmount(accountName, amout) {
  const accountData = getAccount(accountName)

  if (!amout) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    )
    return
  }

  accountData.balance = parseFloat(amout) + parseFloat(accountData.balance)
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    }
  )
  console.log(
    chalk.green(`Foi depositado o valor de R$ ${amout} na sua conta.`)
  )
}

function removeAmout(accountName, remove) {
  const accountData = getAccount(accountName)

  if (!remove) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    )
    return
  }

  if (parseFloat(accountData.balance) - parseFloat(remove) > 0) {
    accountData.balance = parseFloat(accountData.balance) - parseFloat(remove)
  } else {
    console.log(
      chalk.bgRed.black(
        "Você não tem saldo o suficiente para realizar essa operação!"
      )
    )
    return
  }

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    }
  )
  console.log(chalk.green(`Foi sacado o valor de R$ ${remove} na sua conta.`))
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  })

  return JSON.parse(accountJSON)
}

async function withdraw() {
  await inquirer
    .prompt([
      {
        name: "nameAccount",
        message: "Qual o nome da conta ?",
      },
      {
        name: "valor",
        message: "Qual valor você deseja sacar ?",
      },
    ])
    .then((res) => {
      const accountName = res.nameAccount
      const remove = res.valor

      if (!checkAccount(accountName)) {
        return
      }

      removeAmout(accountName, remove)
    })
    .catch((err) => {
      console.log(err)
    })
}