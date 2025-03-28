function redirectToLink() {
    let questionType = document.getElementById("questionType").value;
    let exerciseType = document.getElementById("exerciseType").value;
    let url = "";

    if (questionType === "letter-number" && exerciseType === "practice") {
        url = "lnp.html";
    } else if (questionType === "letter-number" && exerciseType === "test") {
        url = "lnt.html";
    } else if (questionType === "letter-letter" && exerciseType === "practice") {
        url = "llp.html";
    } else if (questionType === "letter-letter" && exerciseType === "test") {
        url = "llt.html";
    } else if (questionType === "letter-or-number" && exerciseType === "practice") {
        url = "lop.html";
    } else if (questionType === "letter-or-number" && exerciseType === "test") {
        url = "lot.html";
    }

    if (url) {
        window.location.href = url;
    } else {
        alert("Invalid selection. Please try again.");
    }
}
