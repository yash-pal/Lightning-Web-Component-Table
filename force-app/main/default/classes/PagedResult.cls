public  class PagedResult {  

        @AuraEnabled  
        public Integer pageSize { get;set; }  
        @AuraEnabled  
        public Integer pageNumber { get;set; }  
        @AuraEnabled  
        public Integer totalItemCount { get;set; }  
        @AuraEnabled  
        public List<contact> records { get;set; }  
    

}