
import docx from "docx";
const {Document, Packer, Paragraph, TextRun} = docx;

// Get elements
let cv_upload = document.getElementById("cv");
let cover_letter_upload = document.getElementById("cover_letter")
let generate_cover_letter_btn = document.getElementById("generate")
let job_link = document.getElementById("job-link")
let api_response = document.getElementById("api-response")

let text_area = document.getElementById("my_word_doc")

// Global variables
let cv;
let cover_letter;

// Create word document
function create_word_doc() {
    // ONLY FOR DEV
    let text = text_area.value

    // Instance
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun(`${text}`),
                        ],
                    }),
                ],
            },
        ],
    });

    // The following function saves our file from the browser
    Packer.toBlob(doc).then((blob) => {
        // saveAs from FileSaver will download the file
        saveAs(blob, "cover-letter.docx");
    });
}

async function fetchData() {

    // Variables to store the input data
    let job_link_text = job_link.value;

    // Before making any requests ensure that the user has provided all 3: cv, cover letter and a job link 
    if (!cv || !cover_letter || !job_link_text) {
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
            job_link: job_link_text
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

        // Print the output
        api_response.textContent = "Check console for JD"

        // Store the response from OpenAI
        let gen_cover_letter = data["generated_cover_letter"]

        // Create the word document
        create_word_document(gen_cover_letter)

        console.log(data["generated_cover_letter"]);

    } catch (error) {
        // Handle any errors that occur during fetch or JSON parsing 
        console.error("There was an error!", error);
    }
};

// Event listener
    // change > Detect when the user is selecting a file. Allows the script to start processing the file
    // load > FileReader emits a load event once it has finished reading a file

cv_upload.addEventListener("change", () => {
    const fr = new FileReader();

    // fr.readAsText(file.files[0]);
    fr.readAsArrayBuffer(cv_upload.files[0])

    fr.addEventListener("load", () => {

        const arrayBuffer = fr.result;
        
        extractRawText({arrayBuffer: arrayBuffer})
            .then(result => {
                // Extract the text from the docx
                cv = result.value

                // Also log the text to the console
                console.log(cv);
            })
            .catch(err => {
                console.error("Error extracting from .docx file: ", err);
            });

    });
});

cover_letter_upload.addEventListener("change", () => {
    const fr = new FileReader();

    // fr.readAsText(file.files[0]);
    fr.readAsArrayBuffer(cover_letter_upload.files[0])

    fr.addEventListener("load", () => {

        const arrayBuffer = fr.result;
        
        extractRawText({arrayBuffer: arrayBuffer})
            .then(result => {
                // Extract the text from the docx
                cover_letter = result.value

                // Also log the text to the console
                console.log(cover_letter);
            })
            .catch(err => {
                console.error("Error extracting from .docx file: ", err);
            });

    });
});

document.getElementById("make-a-word-doc").addEventListener("click", create_word_doc);
document.getElementById("generate").addEventListener("click", fetchData);