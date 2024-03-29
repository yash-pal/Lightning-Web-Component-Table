import { LightningElement, wire, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import saveNote from "@salesforce/apex/contactController.saveNote";
import Accept from "@salesforce/apex/contactController.Accept";
import getContactList from "@salesforce/apex/contactController.getContactList";
import { NavigationMixin } from "lightning/navigation";
import contactWrapper from "@salesforce/apex/contactController.contactWrapper";
import { refreshApex } from '@salesforce/apex';

export default class LwcAssignment extends NavigationMixin(LightningElement) {
  @api error;
  @api bShowModal = false;
  @api openmodal;
  @api recordId;
  @track searchKey = "" ;
  @api currentpage;
  @api result;
  @api buttonValue = false;
  @api contacts = [];
  @api resultValue;
  @api showSpinner = false;

  @wire(contactWrapper, { searchKey: "$searchKey" })
  wrappers;

  @wire(getContactList, { pageNumber: "$pageNumber" })
  contacts;

  openModal(event) {
    this.recordId = event.target.value;
    /*eslint-disable no-console */

    // to open modal window set 'bShowModal' tarck value as true
    this.bShowModal = true;
    console.log("this.recordId " + this.recordId);
    this.buttonValue = true;
  }

  closeModal() {
    /*eslint-disable no-console */
    console.log("hello");
    // to close modal window set 'bShowModal' track value as false
    this.bShowModal = false;
  }

  saveMethod() {

    const result = this.template.querySelector(".inputText");
    this.result = result.value;
    this.resultValue = this.result.replace(/\s/g,'').length;

    if(this.resultValue!==0)
    {
    /*eslint-disable no-console */
    console.log("this.recordId " + this.resultValue);
   
    saveNote({ contactId: this.recordId, inputText: this.result })
      .then(() => {
        
        const evt = new ShowToastEvent({
          title: "Record Updated",
          variant: "Success",

          mode: "dismissable"
        });
        /*eslint-disable*/
        this.dispatchEvent(evt);
        
        this.closeModal();
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
      this.showSpinner = true;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.ready = true;
      this.dispatchEvent(new CustomEvent('recordChange'));
      return refreshApex(this.wrappers); 
    }, 3000);
  }
  else{
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error creating record",
        message: 'Field should not be empty',
        variant: "error"
      })
    );
  }
  }

  approvalMethod(event) {
    this.recordId = event.target.value;

    Accept({ contactId: this.recordId })
      .then(() => {
        const evnt = new ShowToastEvent({
          title: "Request Approved",
          variant: "Success"
        });
        this.dispatchEvent(evnt);
        
       
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
      this.showSpinner = true;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.ready = true;
      this.dispatchEvent(new CustomEvent('recordChange'));
      return refreshApex(this.wrappers); 
    }, 3000);
    
  }

  handleKeyChange(event) {
    if (this.searchKey !== event.target.value) {
      const searchKey = event.target.value;
      this.searchKey = searchKey;
      this.currentpage = 1;
    }
  }

  handleContactView(event) {
    // Navigate to contact record page
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.target.value,
        url:
          "https://zakuda001-dev-ed.lightning.force.com/lightning/r/Contact/ " +
          this.recordId,
        objectApiName: "Contact",
        actionName: "view"
      }
    });
  }

 

  changeValue() {
    const result = this.template.querySelector(".inputText");
    this.result = result.value;
    
    if (this.result != null) {
      this.buttonValue = false;
    }
    if (this.result === "" || this.result === undefined) {
      this.buttonValue = true;
    }

  }

  handlePreviousPage() {
    this.pageNumber = this.pageNumber - 1;
  }

  handleNextPage() {
    this.pageNumber = this.pageNumber - 1;
    console.log("page size " + this.pageNumber);
  }
}