import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

//path del contrato
let tokenAbi = require('../../../build/contracts/Payment.json');
declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class EthcontractService {
  private contracts: {};
  private web3Provider: null;
  
  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      //url ganache
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    window.web3 = new Web3(this.web3Provider);
  }
//obtenemos los datos de la cuenta
  getAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function(err, account) {
        //validamos si tiene error
        if(err === null) {
          window.web3.eth.getBalance(account, function(err, balance) {
            if(err === null) {
              //retorno de datos de cuenta
              return resolve({fromAccount: account, balance:(window.web3.fromWei(balance, "ether")).toNumber()});
            } else {
              //error
              return reject({fromAccount: "error", balance:0});
            }
          });
        }
      });
    });
  }
  //realizamos transferencias
  transferEther(_transferFrom,_transferTo,_amount,_remarks) {
    let that = this;
    return new Promise((resolve, reject) => {
      let paymentContract = TruffleContract(tokenAbi);
      paymentContract.setProvider(that.web3Provider);
      //metodo de transferencia
      paymentContract.deployed().then(function(instance) {
          return instance.transferFund(
            _transferTo,
            {
              from:_transferFrom,
              value:window.web3.toWei(_amount, "ether")
            });
        }).then(function(status) {
          if(status) {
            return resolve(true);
          }
        }).catch(function(error){
          console.log(error);
          //error
          return reject("Error en la transferencia del dinero");
        });
    });
  }
}
