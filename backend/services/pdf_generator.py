from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    KeepTogether,
)
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.units import mm

import os
from datetime import datetime


# =========================================================
# FILE PATH
# =========================================================

def resolve_file_path(file_path):
    """
    Convert stored upload path into an actual
    filesystem path.
    """

    if not file_path:
        return None

    file_path = str(file_path).strip()

    if not file_path:
        return None

    candidates = []

    candidates.append(file_path)

    if file_path.startswith("/"):
        candidates.append(
            file_path[1:]
        )

    backend_dir = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    if file_path.startswith("uploads/"):
        candidates.append(
            os.path.join(
                backend_dir,
                file_path,
            )
        )

    if file_path.startswith("/uploads/"):
        candidates.append(
            os.path.join(
                backend_dir,
                file_path[1:],
            )
        )

    if file_path.startswith("backend/"):
        candidates.append(
            os.path.join(
                backend_dir,
                "..",
                file_path,
            )
        )

    if os.path.isabs(file_path):
        candidates.append(
            file_path
        )

    for path in candidates:

        if path and os.path.exists(path):
            return os.path.abspath(path)

    return None


# =========================================================
# COMPANY LOGO
# =========================================================

def create_company_logo(image_path):
    """
    Small company logo for PDF header.

    Important:
    Company logo gets a small area.
    It does NOT use the large product-image box.
    """

    resolved_path = resolve_file_path(
        image_path
    )

    if not resolved_path:
        return None

    try:

        img = Image(
            resolved_path
        )

        original_width = float(
            img.imageWidth
        )

        original_height = float(
            img.imageHeight
        )

        if (
            original_width <= 0
            or original_height <= 0
        ):
            return None

        # ---------------------------------------------
        # COMPANY LOGO MAX SIZE
        # ---------------------------------------------

        max_width = 28 * mm
        max_height = 16 * mm

        scale = min(
            max_width / original_width,
            max_height / original_height,
        )

        img.drawWidth = (
            original_width * scale
        )

        img.drawHeight = (
            original_height * scale
        )

        return img

    except Exception as error:

        print(
            f"Company logo error: {error}"
        )

        return None


# =========================================================
# PRODUCT IMAGE
# =========================================================

def create_product_image(
    image_path,
    max_width=91 * mm,
    max_height=110 * mm,
):
    """
    Large product image.

    Product image is intentionally much larger
    than company logo.

    Aspect ratio is maintained.
    Image will not be stretched.
    """

    resolved_path = resolve_file_path(
        image_path
    )

    if not resolved_path:

        return Table(
            [
                [
                    Paragraph(
                        "No Product Image",
                        ParagraphStyle(
                            "NoImage",
                            fontSize=10,
                            textColor=colors.HexColor(
                                "#64748b"
                            ),
                            alignment=TA_CENTER,
                        ),
                    )
                ]
            ],
            colWidths=[
                91 * mm
            ],
            rowHeights=[
                110 * mm
            ],
            style=[
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.4,
                    colors.HexColor(
                        "#e2e8f0"
                    ),
                ),
            ],
        )

    try:

        img = Image(
            resolved_path
        )

        original_width = float(
            img.imageWidth
        )

        original_height = float(
            img.imageHeight
        )

        if (
            original_width <= 0
            or original_height <= 0
        ):

            raise ValueError(
                "Invalid image dimensions"
            )

        width_ratio = (
            max_width /
            original_width
        )

        height_ratio = (
            max_height /
            original_height
        )

        scale = min(
            width_ratio,
            height_ratio,
        )

        final_width = (
            original_width *
            scale
        )

        final_height = (
            original_height *
            scale
        )

        img.drawWidth = final_width
        img.drawHeight = final_height

        image_box = Table(
            [
                [img]
            ],
            colWidths=[
                91 * mm
            ],
            rowHeights=[
                110 * mm
            ],
        )

        image_box.setStyle(
            TableStyle(
                [
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                    (
                        "ALIGN",
                        (0, 0),
                        (-1, -1),
                        "CENTER",
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.4,
                        colors.HexColor(
                            "#e2e8f0"
                        ),
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        2,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        2,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        2,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        2,
                    ),
                ]
            )
        )

        return image_box

    except Exception as error:

        print(
            f"Product image error: {error}"
        )

        return Table(
            [
                [
                    Paragraph(
                        "Image unavailable",
                        ParagraphStyle(
                            "ImageError",
                            fontSize=10,
                            textColor=colors.HexColor(
                                "#64748b"
                            ),
                            alignment=TA_CENTER,
                        ),
                    )
                ]
            ],
            colWidths=[
                91 * mm
            ],
            rowHeights=[
                110 * mm
            ],
            style=[
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.4,
                    colors.HexColor(
                        "#e2e8f0"
                    ),
                ),
            ],
        )


# =========================================================
# PAGE FOOTER
# =========================================================

def draw_page(
    canvas,
    doc,
):

    canvas.saveState()

    page_width, page_height = A4

    # Footer line
    canvas.setStrokeColor(
        colors.HexColor(
            "#d9e1ea"
        )
    )

    canvas.line(
        12 * mm,
        12 * mm,
        page_width - 12 * mm,
        12 * mm,
    )

    canvas.setFont(
        "Helvetica",
        8,
    )

    canvas.setFillColor(
        colors.HexColor(
            "#64748b"
        )
    )

    canvas.drawRightString(
        page_width - 12 * mm,
        7 * mm,
        f"Page {doc.page}",
    )

    canvas.restoreState()


# =========================================================
# MAIN PDF GENERATOR
# =========================================================

def generate_catalog_pdf(
    products,
    category_name="All Products",
    company=None,
    filtered_variants=None,
    stock_limit=None,
):
    """
    Generate Product Catalog PDF.

    Company logo:
        Small

    Product image:
        Large

    Product details:
        Right side

    Stock:
        Uses filtered_variants.
    """

    # -----------------------------------------------------
    # CATALOG DIRECTORY
    # -----------------------------------------------------

    os.makedirs(
        "catalogs",
        exist_ok=True,
    )

    # -----------------------------------------------------
    # COMPANY NAME
    # -----------------------------------------------------

    if company:

        company_name = (
            company.company_name
            or company.legal_name
            or company.brand_name
            or "Company"
        )

    else:

        company_name = "Company"

    # -----------------------------------------------------
    # SAFE FILE NAME
    # -----------------------------------------------------

    safe_category = (
        str(category_name)
        .replace(
            "/",
            "_",
        )
        .replace(
            "\\",
            "_",
        )
        .replace(
            " ",
            "_",
        )
        .replace(
            ":",
            "_",
        )
        .replace(
            "<",
            "",
        )
        .replace(
            ">",
            "",
        )
    )

    file_path = (
        f"catalogs/"
        f"{safe_category}_catalog.pdf"
    )

    # -----------------------------------------------------
    # DOCUMENT
    # -----------------------------------------------------

    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,

        rightMargin=10 * mm,
        leftMargin=10 * mm,

        topMargin=9 * mm,
        bottomMargin=18 * mm,

        title=(
            f"{company_name} "
            f"Product Catalog"
        ),

        author=company_name,
    )

    # =====================================================
    # STYLES
    # =====================================================

    styles = getSampleStyleSheet()

    company_style = ParagraphStyle(
        "CompanyName",
        parent=styles["Normal"],

        fontSize=15,
        leading=18,

        textColor=colors.HexColor(
            "#173b68"
        ),

        fontName="Helvetica-Bold",

        alignment=TA_LEFT,
    )

    catalog_style = ParagraphStyle(
        "CatalogTitle",
        parent=styles["Normal"],

        fontSize=17,
        leading=20,

        textColor=colors.HexColor(
            "#173b68"
        ),

        fontName="Helvetica-Bold",

        alignment=TA_CENTER,
    )

    category_style = ParagraphStyle(
        "CategoryTitle",
        parent=styles["Normal"],

        fontSize=9,
        leading=12,

        textColor=colors.HexColor(
            "#475569"
        ),

        alignment=TA_CENTER,
    )

    date_style = ParagraphStyle(
        "DateStyle",
        parent=styles["Normal"],

        fontSize=8,

        textColor=colors.HexColor(
            "#64748b"
        ),

        alignment=TA_LEFT,
    )

    product_name_style = ParagraphStyle(
        "ProductName",
        parent=styles["Normal"],

        fontSize=19,
        leading=22,

        textColor=colors.HexColor(
            "#173b68"
        ),

        fontName="Helvetica-Bold",

        alignment=TA_LEFT,

        spaceAfter=7,
    )

    detail_label_style = ParagraphStyle(
        "DetailLabel",
        parent=styles["Normal"],

        fontSize=9,
        leading=12,

        fontName="Helvetica-Bold",

        textColor=colors.HexColor(
            "#111827"
        ),
    )

    detail_value_style = ParagraphStyle(
        "DetailValue",
        parent=styles["Normal"],

        fontSize=9,
        leading=12,

        textColor=colors.HexColor(
            "#334155"
        ),
    )

    variant_heading_style = ParagraphStyle(
        "VariantHeading",
        parent=styles["Normal"],

        fontSize=10,
        leading=13,

        textColor=colors.HexColor(
            "#173b68"
        ),

        fontName="Helvetica-Bold",

        spaceBefore=7,
        spaceAfter=5,
    )

    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],

        fontSize=8,
        leading=10,
    )

    # =====================================================
    # ELEMENTS
    # =====================================================

    elements = []

    # =====================================================
    # COMPANY HEADER
    # =====================================================

    company_logo = None

    if company and company.logo:

        company_logo = (
            create_company_logo(
                company.logo
            )
        )

    # -----------------------------------------------------
    # LEFT COMPANY BLOCK
    # -----------------------------------------------------

    company_block = []

    if company_logo:

        company_block.append(
            company_logo
        )

        company_block.append(
            Spacer(
                1,
                1.5 * mm,
            )
        )

    company_block.append(
        Paragraph(
            company_name,
            company_style,
        )
    )

    # -----------------------------------------------------
    # CENTER
    # -----------------------------------------------------

    center_block = [

        Paragraph(
            "PRODUCT CATALOG",
            catalog_style,
        ),

        Spacer(
            1,
            1 * mm,
        ),

        Paragraph(
            f"Category: "
            f"{category_name}",
            category_style,
        ),
    ]

    # -----------------------------------------------------
    # RIGHT
    # -----------------------------------------------------

    right_block = [

        Paragraph(
            datetime.now().strftime(
                "%d %b %Y"
            ),
            date_style,
        ),

        Spacer(
            1,
            1 * mm,
        ),

        Paragraph(
            f"Products: "
            f"{len(products)}",
            date_style,
        ),
    ]

    if stock_limit is not None:

        right_block.append(
            Spacer(
                1,
                1 * mm,
            )
        )

        right_block.append(
            Paragraph(
                f"Stock ≤ "
                f"{stock_limit}",
                date_style,
            )
        )

    # =====================================================
    # HEADER TABLE
    # =====================================================

    header_table = Table(
        [
            [
                company_block,
                center_block,
                right_block,
            ]
        ],

        colWidths=[
            58 * mm,
            82 * mm,
            45 * mm,
        ],
    )

    header_table.setStyle(
        TableStyle(
            [
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),

                (
                    "ALIGN",
                    (1, 0),
                    (1, 0),
                    "CENTER",
                ),

                (
                    "ALIGN",
                    (2, 0),
                    (2, 0),
                    "RIGHT",
                ),

                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),

                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),

                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),

                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),
            ]
        )
    )

    elements.append(
        header_table
    )

    elements.append(
        Spacer(
            1,
            3 * mm,
        )
    )

    # =====================================================
    # HEADER LINE
    # =====================================================

    line_table = Table(
        [[""]],
        colWidths=[
            185 * mm
        ],
        rowHeights=[
            1.2 * mm
        ],
    )

    line_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor(
                        "#173b68"
                    ),
                ),
            ]
        )
    )

    elements.append(
        line_table
    )

    elements.append(
        Spacer(
            1,
            5 * mm,
        )
    )

    # =====================================================
    # PRODUCT LOOP
    # =====================================================

    for product in products:

        # -------------------------------------------------
        # PRODUCT IMAGE
        # -------------------------------------------------

        product_image = (
            create_product_image(
                product.image,

                max_width=91 * mm,

                max_height=110 * mm,
            )
        )

        # -------------------------------------------------
        # BRAND
        # -------------------------------------------------

        brand_name = "-"

        if product.brand:

            brand_name = (
                product.brand.name
            )

        # -------------------------------------------------
        # CATEGORY
        # -------------------------------------------------

        product_category = "-"

        if product.category:

            product_category = (
                product.category.name
            )

        # -------------------------------------------------
        # DETAILS
        # -------------------------------------------------

        details = []

        details.append(
            Paragraph(
                product.name or "-",
                product_name_style,
            )
        )

        detail_rows = [

            [
                Paragraph(
                    "SKU",
                    detail_label_style,
                ),

                Paragraph(
                    str(
                        product.sku or "-"
                    ),
                    detail_value_style,
                ),
            ],

            [
                Paragraph(
                    "Brand",
                    detail_label_style,
                ),

                Paragraph(
                    str(
                        brand_name
                    ),
                    detail_value_style,
                ),
            ],

            [
                Paragraph(
                    "Category",
                    detail_label_style,
                ),

                Paragraph(
                    str(
                        product_category
                    ),
                    detail_value_style,
                ),
            ],

            [
                Paragraph(
                    "MRP",
                    detail_label_style,
                ),

                Paragraph(
                    f"₹{product.mrp}",
                    detail_value_style,
                ),
            ],

            [
                Paragraph(
                    "Packing",
                    detail_label_style,
                ),

                Paragraph(
                    f"{product.packing_qty or 0} "
                    f"{product.packing_type or ''}",
                    detail_value_style,
                ),
            ],
        ]

        # -------------------------------------------------
        # DESCRIPTION
        # -------------------------------------------------

        if product.description:

            detail_rows.append(

                [
                    Paragraph(
                        "Description",
                        detail_label_style,
                    ),

                    Paragraph(
                        str(
                            product.description
                        ),
                        detail_value_style,
                    ),
                ]

            )

        details_table = Table(
            detail_rows,

            colWidths=[
                30 * mm,
                58 * mm,
            ],
        )

        details_table.setStyle(
            TableStyle(
                [
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "TOP",
                    ),

                    (
                        "LINEBELOW",
                        (0, 0),
                        (-1, -1),
                        0.3,
                        colors.HexColor(
                            "#d9e1ea"
                        ),
                    ),

                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        2,
                    ),

                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        2,
                    ),

                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),

                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),
                ]
            )
        )

        details.append(
            details_table
        )

        # =================================================
        # FILTERED VARIANTS
        # =================================================

        variants = []

        if filtered_variants is not None:

            variants = (
                filtered_variants.get(
                    product.id,
                    []
                )
            )

        else:

            variants = (
                getattr(
                    product,
                    "variants",
                    []
                )
                or []
            )

        # =================================================
        # VARIANT TABLE
        # =================================================

        if variants:

            details.append(
                Paragraph(
                    "STOCK",
                    variant_heading_style,
                )
            )

            variant_rows = [

                [
                    Paragraph(
                        "<b>COLOR</b>",
                        small_style,
                    ),

                    Paragraph(
                        "<b>SIZE</b>",
                        small_style,
                    ),

                    Paragraph(
                        "<b>QTY</b>",
                        small_style,
                    ),
                ]

            ]

            for variant in variants:

                color_name = "-"

                if getattr(
                    variant,
                    "color",
                    None,
                ):

                    color_name = (
                        variant.color.name
                    )

                size_name = "-"

                if getattr(
                    variant,
                    "size",
                    None,
                ):

                    size_name = (
                        variant.size.name
                    )

                pdf_stock = getattr(
                    variant,
                    "stock",
                    0,
                )

                variant_rows.append(

                    [
                        Paragraph(
                            str(
                                color_name
                            ),
                            small_style,
                        ),

                        Paragraph(
                            str(
                                size_name
                            ),
                            small_style,
                        ),

                        Paragraph(
                            str(
                                pdf_stock
                            ),
                            small_style,
                        ),
                    ]

                )

            variant_table = Table(
                variant_rows,

                colWidths=[
                    35 * mm,
                    25 * mm,
                    28 * mm,
                ],

                repeatRows=1,
            )

            variant_table.setStyle(
                TableStyle(
                    [
                        (
                            "BACKGROUND",
                            (0, 0),
                            (-1, 0),
                            colors.HexColor(
                                "#173b68"
                            ),
                        ),

                        (
                            "TEXTCOLOR",
                            (0, 0),
                            (-1, 0),
                            colors.white,
                        ),

                        (
                            "GRID",
                            (0, 0),
                            (-1, -1),
                            0.4,
                            colors.HexColor(
                                "#cbd5e1"
                            ),
                        ),

                        (
                            "ALIGN",
                            (1, 0),
                            (-1, -1),
                            "CENTER",
                        ),

                        (
                            "VALIGN",
                            (0, 0),
                            (-1, -1),
                            "MIDDLE",
                        ),

                        (
                            "LEFTPADDING",
                            (0, 0),
                            (-1, -1),
                            4,
                        ),

                        (
                            "RIGHTPADDING",
                            (0, 0),
                            (-1, -1),
                            4,
                        ),

                        (
                            "TOPPADDING",
                            (0, 0),
                            (-1, -1),
                            4,
                        ),

                        (
                            "BOTTOMPADDING",
                            (0, 0),
                            (-1, -1),
                            4,
                        ),
                    ]
                )
            )

            details.append(
                variant_table
            )

        # =================================================
        # PRODUCT CARD
        # =================================================

        product_card = Table(
            [
                [
                    product_image,
                    details,
                ]
            ],

            colWidths=[
                95 * mm,
                87 * mm,
            ],
        )

        product_card.setStyle(
            TableStyle(
                [
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.7,
                        colors.HexColor(
                            "#cbd5e1"
                        ),
                    ),

                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "TOP",
                    ),

                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),

                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),

                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),

                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),

                    (
                        "LINEAFTER",
                        (0, 0),
                        (0, 0),
                        0.5,
                        colors.HexColor(
                            "#d9e1ea"
                        ),
                    ),
                ]
            )
        )

        elements.append(
            KeepTogether(
                [
                    product_card,

                    Spacer(
                        1,
                        7 * mm,
                    ),
                ]
            )
        )

    # =====================================================
    # NO PRODUCTS
    # =====================================================

    if not products:

        elements.append(
            Spacer(
                1,
                25 * mm,
            )
        )

        elements.append(
            Paragraph(
                "No products found.",
                ParagraphStyle(
                    "Empty",

                    parent=styles[
                        "Normal"
                    ],

                    fontSize=12,

                    alignment=TA_CENTER,

                    textColor=colors.HexColor(
                        "#64748b"
                    ),
                ),
            )
        )

    # =====================================================
    # BUILD
    # =====================================================

    doc.build(
        elements,

        onFirstPage=draw_page,

        onLaterPages=draw_page,
    )

    return file_path