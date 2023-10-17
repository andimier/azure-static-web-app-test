import { useState, useEffect, useRef } from "react";
import { getProducts } from "./productService";
import { useParams } from "react-router-dom";

export default function useFetch() {
    const isMounted = useRef(false);
    const [products, setSetProducts] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // React Hook to get the url params set by the Router
    const {category} = useParams();

    console.log('USE FETCH');

    useEffect(() => {
      isMounted.current = true;

      const getData = async () => {
        try {
          const products = await getProducts(category); // acá le paso los params
          if (isMounted.current) setSetProducts(products);
        } catch (error) {
          if (isMounted.current) setError(error);
        } finally {
          if (isMounted.current) setLoading(false);
        }
      }

      getData();

      return () => {isMounted.current = false;}
    }, []);

    return {products, error, loading, category};
}