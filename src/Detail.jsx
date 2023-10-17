import React, { useState } from "react";
import useFetch from "./services/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Spinner from "./Spinner";
import { useCart } from "./cartContext";

// export default function Detail(props) {
export default function Detail() {
  const { dispatch } = useCart();
  const { id } = useParams();
  const { products, error, loading } = useFetch();
  const navigate = useNavigate();
  const [sku, setSku] = useState("");

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    throw error;
  }

  const product = (products || []).find((p) => p.id == id);

  if (!product) {
    return <PageNotFound />;
  }

  return (
    <div id="detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p id="price">${product.price}</p>

      <select
        id="size"
        value={sku.size}
        onChange={(e) => setSku(e.target.value)}
      >
        <option value="">What size?</option>
        {product.skus.map((p) => (
          <option key={p.sku} value={p.sku}>
            {p.size}
          </option>
        ))}
      </select>

      {sku && (
        <p>
          <button
            className="btn btn-primary"
            onClick={() => {
              // props.addToCart(id, sku);
              dispatch({ type: "add", id, sku });
              navigate("/cart");
            }}
          >
            Add to cart
          </button>
        </p>
      )}
      <img src={`/images/${product.image}`} alt={product.category} />
    </div>
  );
}
