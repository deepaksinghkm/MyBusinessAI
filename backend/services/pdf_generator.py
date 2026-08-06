from reportlab.platypus import SimpleDocTemplate
from reportlab.lib.units import inch
import os


def generate_catalog_pdf(products, category_name):
    os.makedirs("catalogs", exist_ok=True)

    file_path = f"catalogs/{category_name}.pdf"

    doc = SimpleDocTemplate(file_path)

    elements = []

    # अगले Step में Product Cards Add करेंगे

    doc.build(elements)

    return file_path
