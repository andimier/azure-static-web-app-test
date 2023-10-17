import React, { useEffect, useState } from "react";
import "./App.css";
// import { getProducts } from "./services/productService";
import useFetch from "./services/useFetch";
import Spinner from "./Spinner";
import PageNotFound from "./PageNotFound";
import { Link } from "react-router-dom";

function getFilteredProducts(products, size) {
  if (!size) {
    return products;
  }

  return products.filter((product) => {
    const hasSize = product.skus.some((sku) => sku.size === parseInt(size));
    return hasSize;
  });
}

export default function Products() {
  const [size, setSize] = useState("");

  /**
   * Movidos a un custom juc
   */
  //   const [products, setSetProducts] = useState([]);
  //   const [error, setError] = useState(null);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     getProducts("shoes")
  //       .then((response) => setSetProducts(response))
  //       .catch((e) => setError(e))
  //       .finally(() => setLoading(false));
  //   }, []);

  //   useEffect(() => {
  //     const getData = async () => {
  //       try {
  //         const products = await getProducts("shoes");
  //         setSetProducts(products);
  //       } catch (error) {
  //         setError(error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //
  //     getData();
  //   }, []);

  const { products, error, loading, category } = useFetch();

  if (loading) {
    return <Spinner />;
  }

  if (!products?.length) {
    return <PageNotFound />;
  }

  let filteredProducts = getFilteredProducts(products, size);

  if (error) {
    throw error;
  }

  function renderProduct(p) {
    return (
      <div key={p.id} className="product">
        {/* <a href="/"> */}
        <Link to={`/${category}/${p.id}`}>
          <img src={`/images/${p.image}`} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </Link>
        {/* </a> */}
      </div>
    );
  }

  return (
    <>
      <section id="filters">
        <label htmlFor="size">Filter by Size:</label>{" "}
        <select
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="">All sizes</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </section>
      <h2>{size && `Found ${filteredProducts.length} items`} </h2>
      <section id="products">{filteredProducts.map(renderProduct)}</section>
    </>
  );
}
