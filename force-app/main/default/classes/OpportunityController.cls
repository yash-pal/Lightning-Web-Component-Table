public class OpportunityController{
    @AuraEnabled
    public static List<Opportunity> fetchAccounts(Id opportunityId) {
        //Qyery 10 accounts
        List<Opportunity> accList = [SELECT Id, Name, Amount,Account.Name,GST__c FROM Opportunity where Id=:opportunityId Limit 10];
        system.debug('accList='+accList);
        //return list of accounts
        return accList;
    }
    @AuraEnabled
    public static List<OpportunityLineItem> showOpportunities(){
        List<OpportunityLineItem> showOpp = [Select Id,OpportunityId, ListPrice, Product2Id, TotalPrice from OpportunityLineItem Limit 10];
        return showOpp;
    }
}