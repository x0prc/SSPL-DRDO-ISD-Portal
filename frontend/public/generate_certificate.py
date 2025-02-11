from fpdf import FPDF

def generate_certificate(name, roll_no, institute, branch, topic, duration):
    pdf = FPDF()
    pdf.add_page()
    
    pdf.image("certificate_template.jpeg", x=0, y=0, w=210, h=297)
    
    # Set font and add details
    pdf.set_font("Arial", size=12)
    
    pdf.set_xy(50, 100)
    pdf.cell(0, 10, f"This is to certify that Mr./Ms. {name}", ln=True)
    pdf.cell(0, 10, f"Student of {institute}, Roll No. {roll_no}", ln=True)
    pdf.cell(0, 10, f"Branch {branch}, has completed successfully Summer/Winter Internship", ln=True)
    pdf.cell(0, 10, f"For the topic '{topic}', Duration: {duration}.", ln=True)
    
    # Save PDF
    filename = f"{name.replace(' ', '_')}_certificate.pdf"
    pdf.output(filename)
    
# Example usage
generate_certificate(
    name="John Doe",
    roll_no="12345",
    institute="IIT Delhi",
    branch="Computer Science",
    topic="Machine Learning",
    duration="4 weeks"
)
