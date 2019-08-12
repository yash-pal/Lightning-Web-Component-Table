public with sharing class LoginController {
    public contact reg { set; get;}
    public List<contact> user{get; set;} 
    public String passcode{get; set;}
    public Boolean Match{get; set;}
    public Boolean NoMatch{get; set;}


    public LoginController() {
        reg = new contact();
    }
}
