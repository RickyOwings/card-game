function createJoinButton(id){
    const button = document.createElement("button");
    const td = document.createElement("td");
    button.className = "interact";
    button.id = `button${id}`;
    assignButtonJoin(button, id);

    td.appendChild(button);
    return td;
}

function createLeaveButton(id){
    const button = document.createElement("button");
    const td = document.createElement("td");
    button.className = "interact";
    button.id = `button${id}`;
    assignButtonLeave(button, id);

    td.appendChild(button);
    return td;
}

function assignButtonJoin(button, id){
    button.innerHTML = "Join";
    button.onclick = () => {
        setTimeout(()=>{
            loadLobbies();
        }, 100);
        $.post("/joinlobby", {id: id}
        );
    }
}

function assignButtonLeave(button, id){
    button.innerHTML = "Leave";

    button.onclick = () => {
        console.log(`id:${id} try leave`);
    }
}

var lastRowIDs = [];
function loadLobbies(){
    const lobbies = $(".lobbies")[0];
    if (!lobbies) { // make sure that lobbies element exists
        console.log("Could not retrieve lobbies html element");
        return;
    }
    const rows = $(lobbies).find("tr");
    
    

    // go through and delete all of the rows minus the first one
    
    $.ajax({
        url: "/getlobbies",
        contentType: "text/json",
        success: (data)=>{
            const username = document.getElementById("username")?.innerHTML;
            if (typeof data !== 'object') return;
            let newRowIDs = [];
            try {
                for (let i = 0; i < data.length; i++){
                    const id = data[i]?.id;
                    newRowIDs.push(id);
                    const users = data[i]?.users;
                    const findRow = document.getElementById(id);
                    const rowClass = (users.includes(username)) ? "green-hilight" : "";
                    let usersString = "";
                    users.forEach((user, index) => {
                        usersString += (index) ? ` | ${user}` : user;
                    });

                    if (findRow) { // row already exists
                        const idHTML = findRow.getElementsByClassName("id-data")[0];
                        const usersHTML = findRow.getElementsByClassName("users-data")[0];
                        let button = document.getElementById(`button${id}`);
                        if (rowClass.length) {
                            console.log("assign leave");
                            assignButtonLeave(button, id);
                        } else {
                            console.log("assign join");
                            assignButtonJoin(button, id);
                        }
                        findRow.className = rowClass;

                        idHTML.innerHTML = id;
                        usersHTML.innerHTML = usersString;

                    } else { // need to create a new row
                        const row = document.createElement("tr");
                        row.id = id;
                        row.className = rowClass;
                        const idHTML = document.createElement("td");

                        idHTML.innerHTML = id;
                        idHTML.className = "id-data"

                        const usersHTML = document.createElement("td");

                        const button = (rowClass.length) ? createLeaveButton(id) : createJoinButton(id);
                        usersHTML.innerHTML = usersString;
                        usersHTML.className = "users-data";

                        row.appendChild(idHTML);
                        row.appendChild(usersHTML);
                        row.appendChild(button);
                        lobbies.appendChild(row); 
                    }
                }

                lastRowIDs.forEach((id)=>{ // culling removed lobbies
                    if (newRowIDs.includes(id)) return;
                    document.getElementById(id).remove();
                })
                lastRowIDs = newRowIDs;

            } catch (err) {
                console.log(err);
            }
        }
    })


}
loadLobbies();

setInterval(loadLobbies, 2000);



$("#createlobby").on("submit", (event)=>{
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
        url: "/lobbies",
        type: "post",
        data: formData,
        success: (data) => {
            if (data === "In System") alert("You are in a lobby already!")
        }
    });
})


