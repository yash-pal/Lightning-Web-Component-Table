import { LightningElement, wire, track} from 'lwc';
import contactWrapper from "@salesforce/apex/contactController.contactWrapper";
import saveNote from '@salesforce/apex/contactController.saveNote';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import Accept from '@salesforce/apex/contactController.Accept';


const cols = [
    { label: 'Name', fieldName: 'Name', editable: true,type:'URL' },
    { label: 'Title', fieldName: 'Title' },
    { label: 'Accept', fieldName: 'Accept',
     type: "button",typeAttributes:{
        label:'Accept',
        name:'Accept',
        title:'Accept',
        value:'accept',
        disabled:{fieldName:'isActive'},
        iconPosition:'left',

     }},
    { label: 'Reject', fieldName: 'Reject',
        type: "button",typeAttributes:{
        label:'Reject',
        name:'Reject',
        title:'Reject',
        value:'Reject',
        disabled:{fieldName:'isActive'},
        iconPosition:'left',
    
    }},
    
];
export default class DatatableUpdateExample extends LightningElement {

    @track error;
    @track columns = cols;
    @track draftValues = [];
    @track bShowModal = false;
    @track openmodal;
    _title = 'Record Updated';
    message = 'Response Saved';
    variant = 'Success';
    

    @wire(contactWrapper)
    wrappers;
    /*@wire(saveNote)
    contact;*/

    handleSave(event) {

        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];

            // Display fresh data in the datatable
            return refreshApex(this.contact);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
       
    }
    handleRowAction(event) {
        const row = event.detail.row;
        this.record = row;
        this.bShowModal = true;
        

    }
 
    closeModal() {    
        // to close modal window set 'bShowModal' tarck value as false
        this.bShowModal = false;
    }
    saveMethod() {
        const result =this.template.querySelector('.inputText');
        this.result=result.value;
       /*eslint-disable no-console */
       console.log('value of input '+ this.result);
       /*eslint-disable no-console */
       console.log("this.recordId " + this.recordId);
       saveNote({ contactId: this.recordId,inputText:this.result })
            .then(() => {
                const evt = new ShowToastEvent({
                    title: "Record Updated",
                    variant: 'Success',

                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
                this.closeModal();

            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

    }


    approvalMethod(event) {
        this.recordId = event.target.value;
        /*eslint-disable no-console */
        console.log("this.recordId " + this.recordId + "Hello World");
        this.result = this.buttonValue;
        this.buttonValue = false;
        Accept({ contactId: this.recordId })

            .then(() => {
                const evnt = new ShowToastEvent({
                    title: "Request Approved",
                    variant: 'Success'
                });
                this.dispatchEvent(evnt);
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

    }


    
}