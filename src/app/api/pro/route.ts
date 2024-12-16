/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile, writeFile } from 'fs/promises'; // Import the fs module for file operations
import path from 'path';

// Path to your data.json file
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'data.json');

// Helper function to read data from data.json file
async function readDataFromFile() {
  try {
    const data = await readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from file:", error);
    return []; // Return an empty array in case of error
  }
}

// Helper function to write data to data.json file
async function writeDataToFile(data:string) {
  try {
    await writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing data to file:", error);
  }
}

// Handle GET request
export async function GET() {
  const products = await readDataFromFile();
  return new Response(JSON.stringify(products), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Handle POST request
export async function POST(request: Request) {
  try {
    const newProduct = await request.json(); // Get the JSON data from the request body

    // Validate the incoming data (check for required fields)
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Read existing data from file
    const products = await readDataFromFile();

    // Generate a new ID based on the current length of products
    const newProductId = products.length + 1;
    const productWithId = { ...newProduct, id: newProductId };

    // Add the new product to the array
    products.push(productWithId);

    // Write the updated data back to the file
    await writeDataToFile(products);

    // Return a success response
    return new Response(JSON.stringify({ message: 'Product added successfully', product: productWithId }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to add product' }), { status: 500 });
  }
}
