const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Simple HTML template for PDF conversion
const generateHTML = (markdownContent) => {
  // Basic markdown to HTML conversion (simplified)
  let html = markdownContent
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    // Code blocks
    .replace(/```(.*?)```/gims, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    // Tables (basic)
    .replace(/\|/g, '</td><td>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Daily Expenses Manager - User Manual</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    h2 {
      color: #34495e;
      border-bottom: 2px solid #95a5a6;
      padding-bottom: 8px;
      margin-top: 25px;
    }
    h3 {
      color: #555;
      margin-top: 20px;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid #3498db;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #3498db;
      padding-left: 15px;
      margin-left: 0;
      color: #555;
      font-style: italic;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #3498db;
      color: white;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    li {
      margin: 5px 0;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .page-break {
      page-break-after: always;
    }
    @media print {
      body {
        max-width: 100%;
      }
    }
    hr {
      border: none;
      border-top: 2px solid #ddd;
      margin: 30px 0;
    }
    strong {
      color: #2c3e50;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `;
};

// Read the markdown file
const markdownPath = path.join(__dirname, 'USER_MANUAL.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf8');

// Generate HTML
const htmlContent = generateHTML(markdownContent);

// Write HTML file
const htmlPath = path.join(__dirname, 'USER_MANUAL.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('HTML file created successfully: USER_MANUAL.html');
console.log('You can open this file in a browser and use "Print to PDF" to create a PDF version.');
console.log('Or use a tool like wkhtmltopdf or Chrome headless to convert it programmatically.');
