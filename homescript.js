function redirectToLink() {
    let questionType = document.getElementById("questionType").value;
    let exerciseType = document.getElementById("exerciseType").value;
    let questionPattern = document.getElementById("questionPattern").value;

    // Define a lookup table for URLs
    const urlMap = {
        "letter-number": { 
            "practice": { "MCQ": "lnp.html", "InputAnswer": "qlnp.html" },
            "test": { "MCQ": "lnt.html", "InputAnswer": "qlnt.html" }
        },
        "letter-letter": { 
            "practice": { "MCQ": "llp.html", "InputAnswer": "qllp.html" },
            "test": { "MCQ": "llt.html", "InputAnswer": "qllt.html" }
        },
        "letter-or-number": { 
            "practice": { "MCQ": "lop.html", "InputAnswer": "qlop.html" },
            "test": { "MCQ": "lot.html", "InputAnswer": "qlot.html" }
        }
    };

    // Validate and retrieve the URL
    let url = urlMap[questionType]?.[exerciseType]?.[questionPattern];

    if (url) {
        window.location.href = url;
    } else {
        alert("Invalid selection. Please try again.");
    }
}
