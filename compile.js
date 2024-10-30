const path = require('path');
const fs = require('fs');
const solc = require('solc');





const eComPath = path.resolve(__dirname, 'contracts', 'TicketSale.sol');
const source = fs.readFileSync(eComPath, 'utf8');

if (!fs.existsSync(eComPath)) {
  console.error("Error: File ticketsales.sol not found at path:", tickPath);
  process.exit(1);
}
console.log("Source code loaded:", source);

let input = {
  language: "Solidity",
  sources: {
    "TicketSale.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const stringInput=JSON.stringify(input);

const compiledCode=solc.compile(stringInput);

const output =JSON.parse(compiledCode);

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
}


const contractOutput=output.contracts;

const eComOutput=contractOutput["TicketSale.sol"];

const eComABI=eComOutput.TicketSale.abi;
console.log(eComABI);
const eComBytecode=eComOutput.TicketSale.evm.bytecode;
//console.log(eComBytecode);
module.exports= {"abi":eComABI,"bytecode":eComBytecode.object};