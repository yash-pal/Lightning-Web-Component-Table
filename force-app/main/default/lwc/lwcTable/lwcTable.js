import { LightningElement, wire, api, track } from "lwc";
//import getContact from "@salesforce/apex/contactController.getContact";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import saveNote from "@salesforce/apex/contactController.saveNote";
import Accept from "@salesforce/apex/contactController.Accept";
import getCount from "@salesforce/apex/contactController.getCount";
import getContactList from "@salesforce/apex/contactController.getContactList";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import contactWrapper from "@salesforce/apex/contactController.contactWrapper";

const PAGE_SIZE = 10;

export default class LwcAssignment extends NavigationMixin(LightningElement) {
  @api error;
  @api bShowModal = false;
  @api openmodal;
  @api recordId;
  @api ParentId;
  @track searchKey;
  @api currentpage;
  isSearchChangeExecuted = false;
  localCurrentPage = null;
  @api result;
  @api buttonValue = false;
  @track searchKey = "";
  @api contacts = [];
  @api button;

  @api showSpinner = false;

  @wire(contactWrapper, { searchKey: "$searchKey" })
  wrappers;

  /*eslint-disable no-console */

  openModal(event) {
    this.recordId = event.target.value;
    /*eslint-disable no-console */

    // to open modal window set 'bShowModal' tarck value as true
    this.bShowModal = true;
    console.log("this.recordId " + this.recordId);
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

    /*eslint-disable no-console */
    console.log("value of input " + this.result);

    /*eslint-disable no-console */
    console.log("this.recordId " + this.recordId);
    saveNote({ contactId: this.recordId, inputText: this.result })
      .then(() => {
        const evt = new ShowToastEvent({
          title: "Record Updated",
          variant: "Success",

          mode: "dismissable"
        });
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
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.ready = true;
      location.reload(true);
    }, 3000);
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
        return refreshApex(this.contacts);
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
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.ready = true;
      location.reload(true);
    }, 3000);
  }

  handleKeyChange(event) {
    if (this.searchKey !== event.target.value) {
      const searchKey = event.target.value;
      //this.isSearchChangeExecuted = false;
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

  renderedCallback() {
    // This line added to avoid duplicate/multiple executions of this code.
    if (
      this.isSearchChangeExecuted &&
      this.localCurrentPage === this.currentpage
    ) {
      return;
    }
    this.isSearchChangeExecuted = true;
    this.localCurrentPage = this.currentpage;
    getCount({ searchString: this.searchKey })
      .then(recordsCount => {
        this.totalrecords = recordsCount;
        if (recordsCount !== 0 && !isNaN(recordsCount)) {
          this.totalpages = Math.ceil(recordsCount / this.pagesize);
          getContactList({
            pagenumber: this.currentpage,
            numberOfRecords: recordsCount,
            pageSize: this.pagesize,
            searchString: this.searchKey
          })
            .then(accountList => {
              this.accounts = accountList;
              this.error = undefined;
            })
            .catch(error => {
              this.error = error;
              this.accounts = undefined;
            });
        } else {
          this.accounts = [];
          this.totalpages = 1;
          this.totalrecords = 0;
        }
        const event = new CustomEvent("recordsload", {
          detail: recordsCount
        });
        this.dispatchEvent(event);
      })
      .catch(error => {
        this.error = error;
        this.totalrecords = undefined;
      });
  }

  lastpage = false;
  firstpage = false;
  // getter
  get showFirstButton() {
    if (this.currentpage === 1) {
      return true;
    }
    return false;
  }
  // getter
  get showLastButton() {
    if (Math.ceil(this.totalrecords / this.pagesize) === this.currentpage) {
      return true;
    }
    return false;
  }

  @api _pagesize = PAGE_SIZE;
  get pagesize() {
    return this._pagesize;
  }
  set pagesize(value) {
    this._pagesize = value;
  }
  handlePrevious() {
    if (this.page > 1) {
      this.page = this.page - 1;
      this.dispatchEvent(new CustomEvent("previous"));
    }
  }
  handleNext() {
    if (this.page < this.totalPages) this.page = this.page + 1;
    this.dispatchEvent(new CustomEvent("next"));
    console.log("page" + this.page);
  }
  handleFirst() {
    this.page = 1;
    this.dispatchEvent(new CustomEvent("first"));
  }
  handleLast() {
    this.page = this.totalPages;
    this.dispatchEvent(new CustomEvent("last"));
  }
  handleRecordsLoad(event) {
    this.totalrecords = event.detail;
    this.totalPages = Math.ceil(this.totalrecords / this.pagesize);
  }
  handlePageChange(event) {
    this.page = event.detail;
  }
}
