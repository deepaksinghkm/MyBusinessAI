import { useEffect, useState } from "react";
import MasterEntryPage from "../../components/Master/MasterEntryPage";

import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
  deleteBrandLogo,
} from "../../api/brandApi";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);

  const loadBrands = async () => {
    const data = await getBrands();

    setBrands(
      Array.isArray(data)
        ? data
        : []
    );

    return data;
  };

  useEffect(() => {
    loadBrands().catch((error) => {
      console.error(
        "Failed to load brands:",
        error
      );
    });
  }, []);

  /*
   * FIND BRAND
   *
   * User F2/F3 press karega,
   * Name ya Code dalega,
   * Enter karega.
   */
  const findBrand = async (value) => {
    const search =
      String(value || "")
        .trim()
        .toLowerCase();

    if (!search) {
      return null;
    }

    /*
     * Pehle loaded records mein exact/partial match
     */
    const localMatch =
      brands.find((brand) => {
        const name =
          String(
            brand.name || ""
          ).toLowerCase();

        const code =
          String(
            brand.code || ""
          ).toLowerCase();

        return (
          name === search ||
          code === search
        );
      }) ||
      brands.find((brand) => {
        const name =
          String(
            brand.name || ""
          ).toLowerCase();

        const code =
          String(
            brand.code || ""
          ).toLowerCase();

        return (
          name.includes(search) ||
          code.includes(search)
        );
      });

    if (localMatch) {
      return getBrand(
        localMatch.id
      );
    }

    /*
     * Agar local match nahi mila
     * to null return hoga.
     */
    return null;
  };

  /*
   * CREATE
   */
  const handleCreate = async (
    form
  ) => {
    const {
      logoFile,
      ...brandData
    } = form;

    const created =
      await createBrand({
        name:
          brandData.name?.trim(),
        description:
          brandData.description || "",
        logo:
          brandData.logo || "",
        is_active:
          brandData.is_active !== false,
      });

    /*
     * Logo selected ho to
     * create ke baad upload karo.
     */
    if (logoFile) {
      await uploadBrandLogo(
        created.id,
        logoFile
      );
    }

    await loadBrands();

    return created;
  };

  /*
   * UPDATE
   */
  const handleUpdate = async (
    id,
    form
  ) => {
    const {
      logoFile,
      ...brandData
    } = form;

    const updated =
      await updateBrand(
        id,
        {
          name:
            brandData.name?.trim(),
          description:
            brandData.description ||
            "",
          logo:
            brandData.logo || "",
          is_active:
            brandData.is_active !== false,
        }
      );

    /*
     * New logo selected
     */
    if (logoFile) {
      await uploadBrandLogo(
        id,
        logoFile
      );
    }

    await loadBrands();

    return updated;
  };

  /*
   * DELETE
   */
  const handleDelete = async (
    id
  ) => {
    await deleteBrand(id);

    await loadBrands();
  };

  /*
   * FIELDS
   */
  const fields = [
    {
      name: "name",
      label: "Brand Name",
      type: "text",
      required: true,
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
    },

    {
      name: "logo",
      label: "Logo URL",
      type: "text",
    },

    {
      name: "is_active",
      label: "Status",
      type: "select",
      options: [
        {
          value: true,
          label: "Active",
        },
        {
          value: false,
          label: "Inactive",
        },
      ],
    },
  ];

  /*
   * EMPTY FORM
   */
  const emptyForm = {
    name: "",
    description: "",
    logo: "",
    logoFile: null,
    is_active: true,
  };

  return (
    <MasterEntryPage
      title="Brand Master"
      fields={fields}
      emptyForm={emptyForm}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onFind={findBrand}
    />
  );
}
