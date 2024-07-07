// Get elements
let cv_upload = document.getElementById("cv");
let cover_letter_upload = document.getElementById("cover_letter")
let generate_cover_letter_btn = document.getElementById("generate")
let job_description_text_area = document.getElementById("job-description")
let cover_letter_text_area = document.getElementById("generated-cover-letter")

// Global variables
let cv;
let cover_letter;

async function fetchData() {

    // Variables to store the input data
    let job_description = job_description_text_area.value;

    // Before making any requests ensure that the user has provided all 3: cv, cover letter and a job link 
    if (!cv || !cover_letter || !job_description) {
        alert("A CV, cover letter and job letter must be provided!");
        return;
    }

    // Define endpoint
    let endpoint = "http://127.0.0.1:5000/generate_cover_letter";
    
    // Define params for API call
    let params = {
        method: "POST",
        body: JSON.stringify({
            cv: cv,
            cover_letter: cover_letter,
            job_description: job_description
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }

    // Fetch request
    try {
        // Make the request to the API
        let response = await fetch(endpoint, params);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // If the response is okay store the results
        let data = await response.json();

        // Store the response from OpenAI
        let gen_cover_letter = data["generated_cover_letter"]

        // Check to see the contents of the generated cover letter
        console.log(data["generated_cover_letter"]);

        // Output the generated cover letter to the text area
        cover_letter_text_area.value = gen_cover_letter

    } catch (error) {
        // Handle any errors that occur during fetch or JSON parsing 
        console.error("There was an error!", error);
    }
};


async function extractRawText({ arrayBuffer }) {
    try {
        let result = await mammoth.extractRawText({ arrayBuffer });
        return result;
    } catch (err) {
        console.error("Error extracting from .docx file: ", err);
        throw err;
    }
}

cv_upload.addEventListener("change", () => {
    const fr = new FileReader();

    fr.readAsArrayBuffer(cv_upload.files[0])

    fr.addEventListener("load", async () => {
        try {
            const arrayBuffer = fr.result;
            let result = await extractRawText({ arrayBuffer });
            cv = result.value;
            console.log(cv);
        } catch (err) {
            console.error("Error extracting from .docx file: ", err);
        }
    });
});

cover_letter_upload.addEventListener("change", () => {
    const fr = new FileReader();

    fr.readAsArrayBuffer(cover_letter_upload.files[0])

    fr.addEventListener("load", async () => {
        try {
            const arrayBuffer = fr.result;
            let result = await extractRawText({ arrayBuffer });
            cover_letter = result.value;
            console.log(cover_letter);
        } catch (err) {
            console.error("Error extracting from .docx file: ", err);
        }
    });
});

generate_cover_letter_btn.addEventListener("click", fetchData)
// document.getElementById("generate").addEventListener("click", fetchData);