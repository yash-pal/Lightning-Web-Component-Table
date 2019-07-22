@isTest
public with sharing class TestContactTabel {

    @isTest static void contactWrapper(){
        Test.startTest();
        List<wrappController> wrapConts = contactController.contactWrapper();
        Test.stopTest();
        System.assertEquals(wrapConts.size(), 10);
    }
}
