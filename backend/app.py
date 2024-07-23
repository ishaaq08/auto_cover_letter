# request > fetch the params
# jsonify > JSON conversion
from flask import Flask, request, jsonify
from flask_cors import CORS


# Import functions from separate Python file
from functions import *

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "This is my first API call!"

@app.route("/generate_cover_letter", methods=["POST"])
def testpost():
    # Store the JSON data sent in the body
    body = request.get_json(force=True)

    # Components of the body
    cv = body["cv"]
    cover_letter = body["cover_letter"]
    job_description = body["job_description"]

    # Extracting the job description
    # job_description = extract_job_description(job_link)

    # Using OpenAI to summarise the job description
    prompt = f"""
    You are a professional cover letter writer. You will create a cover letter based on the job description provided. A CV will be provided highlighting relevant technical
    and soft skills, use this to show how I align to the job description. Where there is not exact alignment between skills outline how I can utilise transferrable skills to adapt
    and grasp these novel concepts quickly. It is also important to explain that I am enthusiastic and keen to acquire new knowledge and challenge myself. Do not include the contact 
    details such as address etc, begin the cover letter my writing: Dear Hiring Manager

    I have also provided a template of a previous cover letter. Learn about my writing style, immitate and optimise it to make it sound more natural. If there are any additional skills
    in my cover letter that are not in my CV you can also use them. Moreover, follow a similar structure. Aswell as discussing alignment of skills and role suitability explain why
    I want to work for that particular company, make it unique discussing areas such as cultural fit etc. Feel free to obtain external data regarding the company or industry.   
    

    Below you will find the job description:
    {job_description}

    Below you will find my cv:
    {cv}

    Below you will find a previous cover letter:
    {cover_letter}

    Limit the cover letter so that the number of words is between 250 and 400.
    """
    generated_cover_letter = get_completion(prompt=prompt)

    if not cv:
        return jsonify({"message": "Error receiving CV"}), 200
    elif not cover_letter:
        return jsonify({"message": "Error receiving cover letter"}), 200
    elif not job_description:
        return jsonify({"message": "Error receiving job link"}), 200
    else:
        return jsonify({
            "generated_cover_letter": f"{generated_cover_letter}"}), \
            200

if __name__ == "__main__":
    app.run(debug=True)