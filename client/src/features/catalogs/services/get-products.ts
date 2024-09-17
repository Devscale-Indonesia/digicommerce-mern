export async function getProducts() {
  try {
    const res = await fetch('http://localhost:8000/api/products');

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error('Something went wrong...');
  }
}
