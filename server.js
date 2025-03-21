const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oaktree App</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="flex items-center justify-center h-screen bg-gray-100">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
            <h1 class="text-3xl font-bold text-blue-600">Hello, Oaktree!</h1>
            <p class="text-gray-700 mt-2">CI/CD Pipeline with TailwindCSS</p>
            <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Click Me
            </button>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

