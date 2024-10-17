// Array to hold quotes with text and category, initially loaded from local storage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: "Inspiration",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    category: "Motivation",
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    category: "Life",
  },
];

// Function to display a random quote from the array
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><strong>Category:</strong> ${quote.category}</p>`;

  // Save the last viewed quote to session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Function to create the form for adding quotes dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  // Create input for new quote text
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  // Create input for quote category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Create button to add new quote
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  // Append elements to the form container
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Append the form container to the body (or another element)
  document.body.appendChild(formContainer);
}

// Function to add a new quote to the quotes array and update the DOM
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Clear the input fields after adding
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Save updated quotes to local storage
    saveQuotes();

    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Function to save quotes array to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

// Attach event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Attach event listener to the "Export Quotes" button
document
  .getElementById("exportButton")
  .addEventListener("click", exportToJsonFile);

// Load the last viewed quote from session storage if available
window.onload = function () {
  createAddQuoteForm();

  // Load last viewed quote from session storage
  const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
  if (lastViewedQuote) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${lastViewedQuote.text}"</p><p><strong>Category:</strong> ${lastViewedQuote.category}</p>`;
  }
};
