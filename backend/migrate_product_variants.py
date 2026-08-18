import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).resolve().parent / "mybusiness.db"


def column_exists(
    cursor,
    table,
    column,
):
    columns = cursor.execute(
        f"PRAGMA table_info({table})"
    ).fetchall()

    return any(
        row[1] == column
        for row in columns
    )


def add_column(
    cursor,
    table,
    column,
    definition,
):

    if not column_exists(
        cursor,
        table,
        column,
    ):

        print(
            f"Adding {table}.{column}"
        )

        cursor.execute(
            f"""
            ALTER TABLE {table}
            ADD COLUMN {column} {definition}
            """
        )


def main():

    print(
        f"Database: {DB_PATH}"
    )

    connection = sqlite3.connect(
        DB_PATH
    )

    cursor = connection.cursor()

    try:

        # =====================================================
        # PRODUCTS
        # =====================================================

        add_column(
            cursor,
            "products",
            "discount_percent",
            "NUMERIC(5,2) NOT NULL DEFAULT 0",
        )

        # Existing MRP becomes nullable.
        # We keep the old column for compatibility.
        # SKU also remains nullable for old records.
        cursor.execute(
            """
            UPDATE products
            SET discount_percent = 0
            WHERE discount_percent IS NULL
            """
        )

        # =====================================================
        # PRODUCT VARIANTS
        # =====================================================

        add_column(
            cursor,
            "product_variants",
            "unit_id",
            "INTEGER",
        )

        add_column(
            cursor,
            "product_variants",
            "mrp",
            "NUMERIC(12,2) NOT NULL DEFAULT 0",
        )

        add_column(
            cursor,
            "product_variants",
            "rate",
            "NUMERIC(12,2) NOT NULL DEFAULT 0",
        )

        # =====================================================
        # OLD VARIANTS
        # =====================================================

        # Old variants had no MRP/rate.
        # Copy old product MRP into variant MRP and Rate.
        cursor.execute(
            """
            UPDATE product_variants
            SET mrp = COALESCE(
                (
                    SELECT p.mrp
                    FROM products p
                    WHERE p.id = product_variants.product_id
                ),
                0
            )
            WHERE mrp = 0
            """
        )

        cursor.execute(
            """
            UPDATE product_variants
            SET rate = mrp
            WHERE rate = 0
            """
        )

        connection.commit()

        print("")
        print(
            "========================================"
        )
        print(
            "PRODUCT MIGRATION COMPLETED"
        )
        print(
            "========================================"
        )
        print(
            "Product discount_percent added"
        )
        print(
            "Variant unit_id added"
        )
        print(
            "Variant mrp added"
        )
        print(
            "Variant rate added"
        )
        print(
            "Existing variant prices preserved"
        )

    except Exception as error:

        connection.rollback()

        print(
            "MIGRATION FAILED:"
        )

        print(error)

        raise

    finally:

        connection.close()


if __name__ == "__main__":
    main()
