import pdfplumber


def extract_pdf_text(file):

    try:

        text = ""

        # FIX: open Django uploaded file correctly
        with pdfplumber.open(file) as pdf:

            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return text

    except Exception as e:

        return f"Extraction error: {str(e)}"