public with sharing class wrappController {
    @AuraEnabled
    public contact con;
    @AuraEnabled
    public boolean selected = false;

    public wrappController(boolean selected,Contact con) {

        this.con = con ;
        if(con.UpdateField__c == 'Approve' || con.UpdateField__c == 'Reject'){
         selected = true;   
         this.selected = selected;
        }
        else{
            System.debug('Field Not Updated');
        }
    }

}