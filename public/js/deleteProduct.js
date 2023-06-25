
document.getElementById("link").addEventListener("click", function(event) {
    event.preventDefault();

    var checkbox = document.getElementById("cBox");

    if (checkbox.checked) {
        console.log("Checkbox is checked.");
    } else {
        console.log("Checkbox is not checked.");
    }
});