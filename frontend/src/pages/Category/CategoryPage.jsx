import { useEffect, useState } from "react";

import MasterEntryPage from "../../components/Master/MasterEntryPage";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const data = await getCategories();

    const list = Array.isArray(data)
      ? data
      : [];

    setCategories(list);

    return list;
  };

  useEffect(() => {
    loadCategories().catch((error) => {
      console.error(
        "Failed to load categories:",
        error
      );
    });
  }, []);

  /*
   * FIND
   *
   * Backend mein single GET endpoint nahi hai.
   * Isliye already loaded category list se
   * record find karenge.
   */
  const findCategory = async (value) => {
    const search = String(value || "")
      .trim()
      .toLowerCase();

    if (!search) {
      return null;
    }

    /*
     * Exact code/name
     */
    const exactMatch = categories.find(
      (category) => {
        const code = String(
          category.code || ""
        ).toLowerCase();

        const name = String(
          category.name || ""
        ).toLowerCase();

        return (
          code === search ||
          name === search
        );
      }
    );

    if (exactMatch) {
      return exactMatch;
    }

    /*
     * Partial code/name
     */
    const partialMatch = categories.find(
      (category) => {
        const code = String(
          category.code || ""
        ).toLowerCase();

        const name = String(
          category.name || ""
        ).toLowerCase();

        return (
          code.includes(search) ||
          name.includes(search)
        );
      }
    );

    return partialMatch || null;
  };

  /*
   * CREATE
   */
  const handleCreate = async (form) => {
    const data = {
      code: String(
        form.code || ""
      ).trim(),

      name: String(
        form.name || ""
      ).trim(),

      description:
        form.description?.trim() || null,

      is_active:
        form.is_active === true ||
        form.is_active === "true",
    };

    const result =
      await createCategory(data);

    await loadCategories();

    return result;
  };

  /*
   * UPDATE
   */
  const handleUpdate = async (
    id,
    form
  ) => {
    const data = {
      code: String(
        form.code || ""
      ).trim(),

      name: String(
        form.name || ""
      ).trim(),

      description:
        form.description?.trim() || null,

      is_active:
        form.is_active === true ||
        form.is_active === "true",
    };

    const result =
      await updateCategory(
        id,
        data
      );

    await loadCategories();

    return result;
  };

  /*
   * DELETE
   */
  const handleDelete = async (id) => {
    await deleteCategory(id);

    await loadCategories();
  };

  /*
   * CATEGORY FIELDS
   */
  const fields = [
    {
      name: "code",
      label: "Category Code",
      type: "text",
      required: true,
    },

    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
    },

    {
      name: "is_active",
      label: "Status",
      type: "select",
      options: [
        {
          value: "true",
          label: "Active",
        },
        {
          value: "false",
          label: "Inactive",
        },
      ],
    },
  ];

  const emptyForm = {
    code: "",
    name: "",
    description: "",
    is_active: "true",
  };

  return (
    <MasterEntryPage
      title="Category Master"
      fields={fields}
      emptyForm={emptyForm}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onFind={findCategory}
    />
  );
}
