import { LightningElement, track } from 'lwc';

import getAccountList from '@salesforce/apex/AccountController.getAccountList'
import { NavigationMixin } from 'lightning/navigation'
import { updateRecord  } from 'lightning/uiRecordApi';

const COLS =[
    
    {label:'Name', fieldName:'Name'},
    {label:'OwnerId', fieldName:'OwnerId'},
    {label:'Phone', fieldName:'Phone', editable:true},
    {label:'Website', fieldName:'Website', type:'url', editable:true},
    {label:'AnnualRevenue', fieldName:'AnnualRevenue', editable:true},
    {
        type: 'action',
        typeAttributes: {  rowActions: actions }
    }
]
export default class FinancialServicesDatatable extends NavigationMixin(LightningElement) {
    @track columns = COLS
    @track accounts = []
    @track filteredData=[]
 
    searchKey=''
    draftValues=[]
    sortedBy = 'Name'
    sortDirection='asc'
    timer

    searchHandler(event){
        window.clearTimeout(this.timer)
        this.searchKey = event.target.value
        this.timer = setTimeout(()=>{
            this.callApex()
        }, 1000)
    }

    callApex(){
        getAccountList({searchKey:this.searchKey})
        .then(result=>{
            this.accounts = result
            this.accounts = [...this.sortBy(data)]
           
        }).catch(error=>{
            console.error(error)
        })
    }

    handleSave(event){
        console.log(JSON.stringify(event.detail.draftValues))
        const recordInputs=event.detail.draftValues.map(draft=>{
            const fields={...draft};
            return { fields:fields };
        })
        const promises = recordInputs.map(recordInput=>updateRecord(recordInput))
        Promise.all(promises).then(()=>{      
            this.draftValues=[]
        }).catch(error=>{
            console.error("Error updating the record", error)
        })
        
    }

    get sortByOptions(){
        return [        
            {label:'Name', value:'Name'},
            {label:'OwnerId', value:'OwnerId'}        
        ]
    }

    sortHandler(event){
        this.sortedBy = event.target.value
        this.accounts = [...this.sortBy(this.accounts)]
    }

    sortBy(data){
        const cloneData = [...data]
        cloneData.sort((a,b)=>{
            if(a[this.sortedBy] === b[this.sortedBy]){
                return 0
            }
            return this.sortDirection === 'desc' ? 
            a[this.sortedBy] > b[this.sortedBy] ? -1:1 :
            a[this.sortedBy] < b[this.sortedBy] ? -1:1
        })
        return cloneData
    }

    // handleRowAction(event){  
    //     this[NavigationMixin.Navigate]({ 
    //         type:'standard__recordPage',
    //         attributes:{ 
    //             recordId: event.detail.row.Id,
    //             objectApiName:'Account',
    //             actionName:'view'
    //         }
    //     })
    // }
}