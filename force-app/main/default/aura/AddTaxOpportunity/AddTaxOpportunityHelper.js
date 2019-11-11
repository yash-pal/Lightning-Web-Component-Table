({
    fetchAccHelper : function(component, event, helper) {
        component.set('v.mycolumns', [
            {label: 'Opportunity Name' , fieldName:'Name' , type:'text'},
            {label: 'Amount', fieldName:'Amount', type:'currency'},
            {label: 'Account Name', fieldName:'AccountName',type:'text'},
            {label: 'Tax', fieldName:'GST__c', type:'currency'}
        ]);
        var action = component.get("c.fetchAccounts");
        var OppId = event.getSource().getLocalId();
        console.log(OppId);
        component.set("v.OppId", OppId);
        
        action.setParams({
            
            "opportunityId": component.get("v.recordId")
            //console.log(" recorfId" + opportunityId );
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('sucess',response.getReturnValue());
            console.log('sucess',state);
            if (state === "SUCCESS") {
                var rows = response.getReturnValue();
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.Account) row.AccountName = row.Account.Name;
                }
                component.set('v.acctList',rows);
            }
        });
        $A.enqueueAction(action);
    },
    
    
    showAllOpp : function(component, event, helper) {
        component.set('v.mycolumns', [
            {label: 'Opportunity Name' , fieldName:'OpportunityId' , type:'Product2'},
            {label: 'List Price', fieldName:'ListPrice', type:'currency'},
   			{label: 'Product', fieldName:'Product2Id',type:'Product2'},
            {label: 'Total Price', fieldName:'TotalPrice', type:'Currency'}
        ]);
        var action = component.get("c.showOpportunities");
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('sucess',response.getReturnValue());
            console.log('sucess',state);
            if (state === "SUCCESS") {
                var rows = response.getReturnValue();
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.Account) row.AccountName = row.Account.Name;
                }
                component.set('v.acctList',rows);
            }
        });
        $A.enqueueAction(action);
    }
    
})