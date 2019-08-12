public with sharing class loginpage {

    @AuraEnabled(cacheable=true)
    public static List<contact> userLogin(){
        return [select id,Name,Username__c,Password__c from Contact Where Id =: contactId];
        
    }
}
