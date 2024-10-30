const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {abi, bytecode} = require('../compile');

let accounts;
let ticketsale;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  ticketsale = await new web3.eth.Contract(abi)
.deploy({
data: bytecode,
arguments: [10, 15],
})
.send({ from: accounts[0], gasPrice: 8000000000,
gas: 4700000});
});

describe("TicketSale ", () => {
  it("deploys a contract", () => {
   console.log(ticketsale);
  });
  
 it("gets ticket of person", async () => {
  	id = await ticketsale.methods.getTicketOf(accounts[1]).call();
  	assert.equal(id, 0);
 });
 it("buys ticket", async () => {
 	await ticketsale.methods.buyTicket(1).send({from:accounts[1],value: 20,gasPrice: 8000000000,gas: 4700000});
 	assert.equal(await ticketsale.methods.getTicketOf(accounts[1]).call(), 1);
 });
 it("offers ticket swap", async () => {
  	await ticketsale.methods.buyTicket(1).send({from:accounts[1],value: 20,gasPrice: 8000000000,gas: 4700000});
  	await ticketsale.methods.buyTicket(2).send({from:accounts[2],value: 20,gasPrice: 8000000000,gas: 4700000});
 	await ticketsale.methods.offerSwap(2).send({from:accounts[1],gasPrice: 8000000000,gas: 4700000});
 	const ticketSwapping=await ticketsale.methods.swapList(0).call();
 	assert.equal(ticketSwapping.id, 2);
 	assert.equal(ticketSwapping.owner, accounts[1]);
 });
  it("accepts ticket swap", async () => {
  	await ticketsale.methods.buyTicket(1).send({from:accounts[1],value: 20,gasPrice: 8000000000,gas: 4700000});
  	await ticketsale.methods.buyTicket(2).send({from:accounts[2],value: 20,gasPrice: 8000000000,gas: 4700000});
  	const oldTicketIdOne = await ticketsale.methods.getTicketOf(accounts[1]).call();
  	assert.equal(oldTicketIdOne, 1)
  	const oldTicketIdTwo = await ticketsale.methods.getTicketOf(accounts[2]).call();
  	assert.equal(oldTicketIdTwo, 2)
 	await ticketsale.methods.offerSwap(2).send({from:accounts[1],gasPrice: 8000000000,gas: 4700000});
 	await ticketsale.methods.acceptSwap(2).send({from:accounts[2],gasPrice: 8000000000,gas: 4700000});
 	assert.equal(oldTicketIdOne, await ticketsale.methods.getTicketOf(accounts[2]).call());
 	assert.equal(oldTicketIdTwo, await ticketsale.methods.getTicketOf(accounts[1]).call());
 });
 it("puts ticket up for reselling", async () => {
  	await ticketsale.methods.buyTicket(1).send({from:accounts[1],value: web3.utils.toWei("1","ether"),gasPrice: 8000000000,gas: 4700000});
 	await ticketsale.methods.resaleTicket(web3.utils.toWei("0.01","ether")).send({from:accounts[1],gasPrice: 8000000000,gas: 4700000});
 	const ticketReselling=await ticketsale.methods.resaleList(0).call();
 	assert.equal(ticketReselling.id, 1);
 	assert.equal(ticketReselling.owner, accounts[1]);
        assert(ticketReselling.price > web3.utils.toWei("0","ether"));
 });
  it("accepts ticket reselling", async () => {
  	await ticketsale.methods.buyTicket(1).send({from:accounts[1],value: web3.utils.toWei("1","ether"),gasPrice: 8000000000,gas: 4700000});
 	await ticketsale.methods.resaleTicket(web3.utils.toWei("0.01","ether")).send({from:accounts[1],gasPrice: 8000000000,gas: 4700000});
 	await ticketsale.methods.acceptResale(1).send({from:accounts[2],value: web3.utils.toWei("1","ether"),gasPrice: 8000000000,gas: 4700000});
        assert(await web3.eth.getBalance(accounts[0]) > web3.utils.toWei("0.0009","ether"));
        assert(await web3.eth.getBalance(accounts[1]) > web3.utils.toWei("0.0009","ether"));
 });
   it("checks resale", async () => {
  	await ticketsale.methods.buyTicket(1).send({from:accounts[1],value: 20,gasPrice: 8000000000,gas: 4700000});
 	await ticketsale.methods.resaleTicket(web3.utils.toWei("0.01","ether")).send({from:accounts[1],gasPrice: 8000000000,gas: 4700000});
 	const ticketReselling=await ticketsale.methods.resaleList(0).call();
 	assert.equal(ticketReselling.id, 1);
 	assert.equal(ticketReselling.owner, accounts[1]);
        assert(ticketReselling.price > web3.utils.toWei("0","ether"));
        await ticketsale.methods.checkResale();
   });
 
});
