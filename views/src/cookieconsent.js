function main(){
    const cookiebanner = $("#cookiebanner");
    const acceptBtn = $("#cookie-accept-button");
    const rejectBtn = $("#cookie-reject-button");
    const consent = localStorage.getItem("consent");

    if (consent !== null) {
        cookiebanner.parent().remove();
    }

    acceptBtn.on("click", ()=>{
        localStorage.setItem("consent", true);  
        setTimeout(()=>{
            cookiebanner.parent().remove();
        }, 200);
    });

    rejectBtn.on("click", ()=>{
        cookiebanner.html("Welp. If that is the case... I guess you don't wan't to be here then...")
        cookiebanner.parent().css("background-color", "#000000");
        cookiebanner.css("scale", "0.4");
        cookiebanner.css("opacity", "0");
        setTimeout(()=>{
            window.location.href = "https://www.youtube.com/watch?v=yWh9l8RSkPk"
        }, 5000);
    });
}
main();
