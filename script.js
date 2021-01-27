function submit_key() {
    var name = document.getElementById("keyID").value;
    postUsers(name);
}

async function postUsers(api_key) {
    //Posts users individually to Iterable API, returns number of users uploaded
    //Load csv file and split into rows
    const response = await fetch("data.csv");
    const data = await response.text();
    const table = data.split('\n');

    //Create an array to hold JSON result, parse into JSON
    var result = [];
    const titles = table[0].split(',');
    for(var x=1; x<table.length; x++){
        var user = {};
        var row = table[x].split(',');
        for(var y=0; y<titles.length; y++){
           user[titles[y]] = row[y];
        }
        result.push(user);
    }
    //Goes through each JSON object in the result array and uploads to Iterable
    var userCount = 0;
    var bulkUsers = [];
    var chunkNum = 0;
    var userLength = result.length;
    for (var y=0; y<userLength; y+=50){
        var bulkUsersChunk = [];
        for (var i=0; i<50; i++){
            if (i<(userLength-(chunkNum*50))){
            bulkUsersChunk.push({"email": result[i+(chunkNum*50)].email, "datafields": result[i+(chunkNum*50)]});
            userCount++;
            }
        }
        chunkNum++;
        bulkUsers.push(bulkUsersChunk);
    }
    bulkUsers.forEach( chunk => {
        fetch('https://api.iterable.com/api/users/bulkUpdate',
        {
            method:'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                users: chunk
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'API_Key': api_key
            }
        })

    })
    alert("Success! " + userCount + " Users Updated, " + chunkNum + " Calls Made, API KEY: "+api_key);
    }
