export default class SaveManager{  
    constructor(){
        this.SPREADSHEET_Id = "196wRwil5ZkMnZXJBABEGpWZPlucxMLnMsFSpppo_t4Q"
        this.API_KEY = "AIzaSyBW632T2eLsd5lq08fyUxD8ckiMAhTkNvY"
        this.CLIENT_ID = "897599399091-7me7n9lrrkekatuuup18v8bikvudl307.apps.googleusercontent.com"
        this.CLIENT_SECRETCODE = "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"
        this.SCOPE = "https://www.googleapis.com/auth/spreadsheets";
        this.DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
        
        this.request = null;
        this.initClient();
    }

    initClient(){
        this.request = gapi.client.init({
            'apiKey': this.API_KEY,
            'clientId': this.CLIENT_ID,
            'discoveryDocs': this.DISCOVERY_DOCS,
            'scope': this.SCOPE
        }).then(function() {
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);
            this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        }, function(error) {
            console.log(error)
        });
    }
    
    sendToGoogleSheets(rowData){
        const params = {
            spreadsheetid: this.SPREADSHEET_Id,
            range: 'Results',
            valueInputOption: 'RAW',
            insertInputOption: 'INSERT_ROWS',
        };

        const valueRangeBody = {
            'majorDimension': 'ROWS',
            'values': rowData,
        }

        /*this.response = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        this.request.then(function(response) {
            console.log(response.result);
        }, function (error){
            console.log(error);
        });*/
    }
}