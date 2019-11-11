trigger EmailDuplicacy on Lead (before insert,before update) {
    
    Map<String,Lead> emailMap = new Map<String,Lead>();
   for(Lead leads: Trigger.new){
       if((leads.Email != null) && (Trigger.isInsert || (leads.Email != Trigger.oldMap.get(leads.Id).Email))){
           if(emailMap.containsKey(leads.Email))
           {
               leads.Email.addError('Another new lead has the ' + 'same email address.');
           }
            else{
                emailMap.put(leads.Email, leads);
            }
       } 
   } 
   for(Lead leads:[select Email from Lead where Email IN:emailMap.keySet()]){
       Lead newLead = emailMap.get(leads.Email);
       newLead.Email.addError('A lead with this email ' + 'address already exists');

   }
    
}