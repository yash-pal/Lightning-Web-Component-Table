trigger UpdateAccount on Contact (after insert) {

set<Id> ids = new set<Id>();
    for(Contact con : Trigger.new){
        if(String.isNotBlank(con.email)){
            ids.add(con.AccountId);
        }
    }
    List<String> conEmail = new List<String>();
    List<Account> aclist = new List<Account>();
    for(Account acobj : [SELECT id,Custom_Email__c,(Select Id,AccountId, email from contacts) from Account Where Id IN : ids]){
        for(Contact conObj : acobj.contacts){
            if(acobj.id == conObj.AccountId){
                if(String.isNotBlank(acobj.Custom_Email__c)){
                    acobj.Custom_Email__c = acobj.Custom_Email__c+' ; '+conObj.Email;
                }
                else{
                    acobj.Custom_Email__c = conObj.Email;
                }
                
            } 
        }
        aclist.add(acobj);
    }
    if(aclist.size() > 0){
       update aclist; 
    }
    
}