public with sharing class contactController {

  //Retrieve or Show data from the Org 
  @AuraEnabled(cacheable=true)
    public static List<wrappController> contactWrapper(String searchKey){
      List<wrappController> wrapperList = new List<wrappController>();
      String key = '%' + searchKey + '%';
      //system.debug('contacts'+contacts);
      for(contact con : [SELECT Id,Name,Email,UpdateField__c,LastModifiedDate,(SELECT ContactId,Contact.Name,Field,NewValue,OldValue FROM Histories  Where Field = 'UpdateField__c' ORDER BY CreatedDate DESC LIMIT 1) FROM contact WHERE Name LIKE :key limit 10 ])
      {
        wrappController obj = new wrappController(true,con);
        wrapperList.add(obj);
        system.debug('Wrapper List' + wrapperList);
      }
        return wrapperList;
    }

    //  Save the Id and Text from the Modal window in a Custom Object in Org 

    @AuraEnabled 
    public static List<wrappController> saveNote(string contactId,String inputText){
      List<wrappController> wrapperSave = new List<wrappController>();
       Contact con = [select Id,Name,UpdateField__c from contact where id=:contactId  ];
        con.UpdateField__c = 'Reject';

       system.debug('ContactId value  '+ contactId);
       notes__c notes= new notes__c();
       notes.Name=contactId;
       notes.Title__c = 'Rejection Note';
       notes.Body__c = inputText;
      insert notes;  

      update con;
      wrappController obj = new wrappController(false,con);
      return wrapperSave;
    }

    // Update the Checkbox Field and Run the Workflow 

    @AuraEnabled
    public static List<wrappController>  Accept(id contactId){
       List<wrappController> wrapperAccept = new List<wrappController>();
     Contact con =[select Id,FirstName,lastName,UpdateField__c from contact where id=:contactId ]; 
      // Check the Id when it matches the id of the contact on click of  Button 
         con.UpdateField__c = 'Approve';
     update con;
    wrappController obj = new wrappController(false,con);
    wrapperAccept.add(obj);
    return wrapperAccept;
    }

    @AuraEnabled(cacheable=true)
    public static PagedResult getContactList(Integer pageNumber)
    {
     Integer pageSize = 10;
     Integer offset = (pageNumber -1) * pageSize;
     PagedResult result = new PagedResult();
     result.pageSize = pageSize;
     result.pageNumber = pageNumber;
     result.totalItemCount = Database.countQuery('Select count() from contact');
     result.records = Database.query('Select Id,Name,Email,UpdateField__c,LastModifiedDate from contact' + 'LIMIT :pageSize OFFSET: offset');
     return result;
   }

}