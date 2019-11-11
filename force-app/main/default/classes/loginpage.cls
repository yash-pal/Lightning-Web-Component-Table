public with sharing class loginpage {

    @AuraEnabled(cacheable=true)
    public static List<Contact> userLogin(String Username,String Password){
        return [select id,FirstName,LastName,Email,Username__c,Password__c from Contact where Username__c =:Username AND Password__C =: Password ];  
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> createContact(String Username,String Password,String FirstName,String LastName, String Email, String Phone){

        Contact Con = new Contact();
        Con.FirstName = FirstName;
        Con.LastName = LastName;
        Con.Username__c = Username;
        Con.Password__c = Password;
        Con.Email = Email;
        con.Phone = Phone;
        List<Contact> conList = new List<Contact>();
        conList.add(con);
        insert conList;
        return conList;
    }
}