from PyPDFForm import PdfWrapper
import sqlite3

def generate_certificate(student_id):
    conn = sqlite3.connect('sit_portal.db')
    cursor = conn.cursor()
    
    # Fetch student details
    cursor.execute("SELECT name, roll_no, branch, internship_topic FROM students WHERE id = ?", (student_id,))
    student = cursor.fetchone()
    
    if not student:
        return "Student not found"
    
    name, roll_no, branch, internship_topic = student
    
    # Load the PDF template
    pdf = PdfWrapper("certificate_template.pdf")
    
    # Fill the PDF form
    filled_pdf = pdf.fill({
        "Mr./Ms.": name,
        "Roll No": roll_no,
        "Branch": branch,
        "from": "2025-01-01", 
        "to": "2025-02-28",    
        "Duration": "2 months", 
        "Topic of Internship was": internship_topic
    })
    
    # Save the filled PDF
    output_filename = f"certificate_{student_id}.pdf"
    with open(output_filename, "wb") as output_file:
        output_file.write(filled_pdf.read())
    
    conn.close()
    return output_filename

student_id = 123 
certificate_file = generate_certificate(student_id)
