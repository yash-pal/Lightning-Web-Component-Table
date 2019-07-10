public with sharing class contactController {

    //Retrieve or Show data from the Org 
   @AuraEnabled(cacheable=true)
    public static List<Contact> getContact(String searchKey){
      String key = '%' + searchKey + '%';
      List<contact> contacts = [SELECT Id,Name,Email,FirstName,LastName,Title, Approval__C,LastModifiedDate,(SELECT ContactId,Contact.Name,Field,NewValue,OldValue FROM Histories  Where Field = 'Approval__c' ORDER BY CreatedDate DESC LIMIT 1) FROM contact WHERE Name LIKE :key limit 10];
      system.debug('contacts'+contacts);
        return contacts;
      

    }

    //  Save the Id and Text from the Modal window in a Custom Object in Org 

    @AuraEnabled 
    public static void saveNote(string contactId,String inputText){
       
       system.debug('ContactId value  '+ contactId);
       notes__c notes= new notes__c();
       notes.Name=contactId;
       notes.Title__c = 'Rejection Note';
       notes.Body__c = inputText;
        insert notes;    
    }

    // Update the Checkbox Field and Run the Workflow 

    @AuraEnabled
    public static void Accept(id contactId){
     Contact con =[select Id,FirstName,lastName,Approval__c from contact where id=:contactId ];  // Check the Id when it matches the id of the contact on click of  Button 
         con.Approval__c = True;
     update con;

    }

    @AuraEnabled
    public static Integer getCount(String searchString) {  
     String query = 'select count() from Contact ';  
     if (searchString != null && searchString != '') {  
       query += ' where name like \'%' + searchString + '%\' ';  
     }  
     return Database.countQuery(query);  
   } 

  
    @AuraEnabled(cacheable = true)  
     public static List<Contact> getContactList(Integer pagenumber, Integer numberOfRecords, Integer pageSize, String searchString) {  
     String searchKey = '%' + searchString + '%';  
     String query = 'select Id,Name from contact ';  
     if (searchString != null && searchString != '') {  
       query += ' where name like \'%' + searchString + '%\' ';  
     }  
     query += ' limit ' + pageSize + ' offset ' + (pageSize * (pagenumber - 1)); 
     List<contact> cons =  Database.query(query);
     return cons;
   }   
}