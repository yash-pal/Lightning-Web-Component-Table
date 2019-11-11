trigger updateAccountEmails on Contact (after Update){
    set<Id> conId = new set<Id>();
     Map<Id,Account> emailMap = new Map<Id, Account>();
    List<Account> accs = [select Id,Custom_Email__c from Account where Id IN: conId];
   
    for(contact con : Trigger.new){
        
    }
}