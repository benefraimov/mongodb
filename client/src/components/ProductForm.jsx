import {
  Form,
  useNavigate,
  useNavigation,
  useActionData,
  redirect,
} from "react-router-dom";
import classes from "./ProductForm.module.css";
import { getAuthToken } from "../util/auth";

function ProductForm({ method, product }) {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  function cancelHandler() {
    navigate("..");
  }

  return (
    <Form method={method} className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="name">name</label>
        <input
          id="name"
          type="text"
          name="name"
          required
          defaultValue={product ? product.name : ""}
        />
      </p>
      <p>
        <label htmlFor="imageUrl">Image</label>
        <input
          id="imageUrl"
          type="url"
          name="imageUrl"
          required
          defaultValue={product ? product.imageUrl : ""}
        />
      </p>
      <p>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          name="price"
          required
          defaultValue={product ? product.price : ""}
        />
      </p>
      <p>
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          name="category"
          required
          defaultValue={product ? product.category : ""}
        />
      </p>
      <p>
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          type="number"
          name="stock"
          required
          defaultValue={product ? product.stock : ""}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          required
          defaultValue={product ? product.description : ""}
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default ProductForm;

export async function action({ request, params }) {
  const method = await request.method;
  const data = await request.formData();

  // get the data from the formData by names:
  const productData = {
    name: data.get("name"),
    imageUrl: data.get("imageUrl"),
    price: data.get("price"),
    category: data.get("category"),
    stock: data.get("stock"),
    description: data.get("description"),
  };

  let url = "http://localhost:3000/products";

  if (method === "PUT") {
    const id = params.productId;
    url = `http://localhost:3000/products/${id}`;
  }

  const token = getAuthToken();

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(productData),
  });

  if (response.status === 422) {
    return response;
  }

  if (!response.ok) {
    return { isError: true, message: "Could not add product" };
  }

  return redirect("/products");
}
