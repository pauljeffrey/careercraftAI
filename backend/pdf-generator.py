from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import os
import tempfile

async def generate_resume_pdf(content: str, structure: dict = None) -> str:
    """
    Generate a PDF file from the optimized resume content,
    attempting to maintain the original structure if provided.
    """
    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, "optimized_resume.pdf")
    
    # Create a PDF document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Define styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Heading1',
        parent=styles['Heading1'],
        fontSize=14,
        spaceAfter=12
    ))
    styles.add(ParagraphStyle(
        name='Normal_Justified',
        parent=styles['Normal'],
        alignment=4,  # 4 is for justified
        spaceBefore=6,
        spaceAfter=6
    ))
    
    # Create the content
    story = []
    
    if structure:
        # Try to maintain the original structure
        for section, lines in structure.items():
            # Add section header
            if section != "header":  # Assume "header" is not a visible section title
                p = Paragraph(section, styles['Heading1'])
                story.append(p)
                story.append(Spacer(1, 0.1 * inch))
            
            # Add section content
            for line in lines:
                p = Paragraph(line, styles['Normal_Justified'])
                story.append(p)
            
            story.append(Spacer(1, 0.2 * inch))
    else:
        # Just format the content as-is
        paragraphs = content.split('\n\n')
        for para in paragraphs:
            if para.strip():
                p = Paragraph(para.replace('\n', '<br/>'), styles['Normal_Justified'])
                story.append(p)
                story.append(Spacer(1, 0.2 * inch))
    
    # Build the PDF
    doc.build(story)
    
    return output_path

async def generate_cover_letter_pdf(content: str) -> str:
    """
    Generate a PDF file from the cover letter content.
    """
    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, "cover_letter.pdf")
    
    # Create a PDF document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Define styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Normal_Justified',
        parent=styles['Normal'],
        alignment=4,  # 4 is for justified
        spaceBefore=6,
        spaceAfter=6
    ))
    
    # Create the content
    story = []
    
    # Split the content into paragraphs
    paragraphs = content.split('\n\n')
    for para in paragraphs:
        if para.strip():
            p = Paragraph(para.replace('\n', '<br/>'), styles['Normal_Justified'])
            story.append(p)
            story.append(Spacer(1, 0.2 * inch))
    
    # Build the PDF
    doc.build(story)
    
    return output_path

