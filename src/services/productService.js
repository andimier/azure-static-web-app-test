const baseUrl = process.env.REACT_APP_API_BASE_URL;

let fetchCount = 1;

export async function getProducts(category) {
  const response = await fetch(baseUrl + "products?category=" + category);
  console.log('fetch count = ', fetchCount++);

  if (response.ok) {
    return response.json();
  }

  throw response;
}

export async function getProduct(id) {
  const response = await fetch(baseUrl + "products/" + id);
  if (response.ok) return response.json();
  throw response;
}
