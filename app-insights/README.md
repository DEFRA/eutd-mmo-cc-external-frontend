# How many transactions succeeded first time or failed to succeed

1) This relies on the documentNumber being recorded with every page view and event.  
2) It uses the document number to segment into processing statements, storage docs and catch certificates.
3) A journey is deemed to have started when the add-exporter-details page is visited
4) A journey is deemed to have completed when the the pdf download page is viewed
5) A complete-first-time event is fired, if the journey is completed in one go.


### Processing statement [Kusto](https://docs.microsoft.com/en-us/azure/kusto)
```
let allDocuments=
pageViews
| where tostring(customDimensions.documentNumber) matches regex ".*-PS-.*"
| where url=="/create-processing-statement/add-exporter-details"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc;

let completedFirstTimeDocuments=
customEvents
| where tostring(customDimensions.documentNumber) matches regex ".*-PS-.*"
| where name=="complete-first-time"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc, complete=true, completeFirstTime=true;


let completedDocuments=
pageViews
| where tostring(customDimensions.documentNumber) matches regex ".*-PS-.*"
| where url=="/create-processing-statement/processing-statement-created"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc, complete=true;

let data=
allDocuments 
| project doc 
| join kind = leftouter ( completedDocuments 
| project doc, complete ) on doc
| project doc, complete
| join kind = leftouter( completedFirstTimeDocuments 
| project doc, complete, completeFirstTime ) on doc
| project doc, complete=iff(complete==true, true, false), completedFirstTime=iff(completeFirstTime==true, true, false);

let completed= 
data
| summarize r=countif( complete == true)
| project type="completed", count=r;

let completedFirstTime= 
data
| summarize r=countif( completedFirstTime == true)
| project type="completedFirstTime", count=r;

let started= 
data
| summarize r=countif(true)
| project type="started", count=r;

started
| union completed, completedFirstTime;  


``` 

### Storage Docs [Kusto](https://docs.microsoft.com/en-us/azure/kusto)

```
let allDocuments=
pageViews
| where tostring(customDimensions.documentNumber) matches regex ".*-SD-.*"
| where url=="/create-storage-document/add-exporter-details"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc;

let completedFirstTimeDocuments=
customEvents
| where tostring(customDimensions.documentNumber) matches regex ".*-SD-.*"
| where name=="complete-first-time"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc, complete=true, completeFirstTime=true;


let completedDocuments=
pageViews
| where tostring(customDimensions.documentNumber) matches regex ".*-SD-.*"
| where url=="/create-storage-document/storage-document-created"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc, complete=true;

let data=
allDocuments 
| project doc 
| join kind = leftouter ( completedDocuments 
| project doc, complete ) on doc
| project doc, complete
| join kind = leftouter( completedFirstTimeDocuments 
| project doc, complete, completeFirstTime ) on doc
| project doc, complete=iff(complete==true, true, false), completedFirstTime=iff(completeFirstTime==true, true, false);

let completed= 
data
| summarize r=countif( complete == true)
| project type="completed", count=r;

let completedFirstTime= 
data
| summarize r=countif( completedFirstTime == true)
| project type="completedFirstTime", count=r;

let started= 
data
| summarize r=countif(true)
| project type="started", count=r;

started
| union completed, completedFirstTime;  

```


### Catch certificates [Kusto](https://docs.microsoft.com/en-us/azure/kusto)
```
let allDocuments=
pageViews
| where tostring(customDimensions.documentNumber) matches regex ".*-CC-.*"
| where url=="/create-catch-certificate/add-exporter-details"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc;

let completedFirstTimeDocuments=
customEvents
| where tostring(customDimensions.documentNumber) matches regex ".*-CC-.*"
| where name=="complete-first-time"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc, complete=true, completeFirstTime=true;


let completedDocuments=
pageViews
| where tostring(customDimensions.documentNumber) matches regex ".*-CC-.*"
| where url=="/create-catch-certificate/catch-certificate-created"
| summarize by doc=tostring(customDimensions.documentNumber)
| project doc, complete=true;

let data=
allDocuments 
| project doc 
| join kind = leftouter ( completedDocuments 
| project doc, complete ) on doc
| project doc, complete
| join kind = leftouter( completedFirstTimeDocuments 
| project doc, complete, completeFirstTime ) on doc
| project doc, complete=iff(complete==true, true, false), completedFirstTime=iff(completeFirstTime==true, true, false);

let completed= 
data
| summarize r=countif( complete == true)
| project type="completed", count=r;

let completedFirstTime= 
data
| summarize r=countif( completedFirstTime == true)
| project type="completedFirstTime", count=r;

let started= 
data
| summarize r=countif(true)
| project type="started", count=r;

started
| union completed, completedFirstTime;  

```
