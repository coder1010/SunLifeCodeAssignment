public with sharing class AccountController {
    
    @AuraEnabled(cacheable = true)
    public static List<Account> getAccountList(String searchKey) {
        String key = '%' + searchKey + '%';
        return [SELECT Id, Name, OwnerId, Phone, Website, AnnualRevenue FROM Account WHERE Industry = 'Financial Services' AND Name LIKE :key ];
    }
}
