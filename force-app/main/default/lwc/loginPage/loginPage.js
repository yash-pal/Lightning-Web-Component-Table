import { LightningElement, wire,track } from 'lwc';
import userLogin from '@salesforce/apex/loginpage.userLogin';
import createContact from '@salesforce/apex/loginpage.createContact';



export default class LoginPage extends LightningElement {
@track myVar;

   @wire(userLogin)
   Contacts;

   openlogin(event){
      this.myVar = event.target.value;
   }


   handleSignup(){
      createContact();
   }
}