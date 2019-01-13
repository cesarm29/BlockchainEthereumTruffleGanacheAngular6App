import { Component } from '@angular/core';
import { EthcontractService } from './ethcontract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Blockchain Truffle Ganache Angular 6 Pagos en ethereum';
  accounts: any;
  transferFrom = '0x0';
  balance = '0 ETH';
  transferTo = '';
  amount = 0;
  remarks = '';


  constructor(private ethcontractService: EthcontractService) {
    this.initAndDisplayAccount();
  }
  //funcion trae los datos de la cuenta
  initAndDisplayAccount = () => {
    let that = this;
    //servicio de datos de cuenta
    this.ethcontractService.getAccountInfo().then(function (acctInfo: any) {
      console.log(acctInfo);
      that.transferFrom = acctInfo.fromAccount;
      that.balance = acctInfo.balance;
    }).catch(function (error) {
      console.log(error);
    });

  };
  //transferencias
  transferEther(event) {
    let that = this;
    console.log(this.transferTo);
    //servicio que realiza el pago
    this.ethcontractService.transferEther(this.transferFrom, this.transferTo, this.amount, this.remarks).then(function (pago) {
      //validacion de realizacion pago
      console.log(pago);
      if (pago == true) {
        alert("pago realizado");
        that.initAndDisplayAccount();
      } else {
        console.log("Error en el pago");
      }
    }).catch(function (error) {
      console.log(error);
      that.initAndDisplayAccount();
    });
  }
}
