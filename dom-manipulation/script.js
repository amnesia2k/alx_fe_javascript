let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Server simulation (using JSONPlaceholder API)
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to display a random quote
function showRandomQuote() {
  const filteredQuotes = filterQuotesByCategory();
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").textContent =
      filteredQuotes[randomIndex].text;
  } else {
    document.getElementById("quoteDisplay").textContent =
      "No quotes available for this category.";
  }
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    syncQuotes(); // Sync quotes with the server after adding
  }
}

// Function to populate categories dynamically in the dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

// Function to filter quotes by the selected category
function filterQuotesByCategory() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter((quote) => quote.category === selectedCategory);
}

// Function to sync quotes between local storage and server
async function syncQuotes() {
  try {
    // Fetch latest quotes from the server
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Resolve conflicts
    resolveConflicts(serverQuotes);

    // Sync any new local quotes to the server
    quotes.forEach((quote) => syncNewQuoteToServer(quote));
  } catch (error) {
    console.error("Error syncing quotes with the server:", error);
  }
}

// Function to sync a single new quote with the server
async function syncNewQuoteToServer(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" },
    });
    const serverResponse = await response.json();
    // console.log("Quote synced to the server:", serverResponse);
  } catch (error) {
    console.error("Error syncing new quote to the server:", error);
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Resolve conflicts and merge with local storage
    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Error fetching quotes from the server:", error);
  }
}

// Function to resolve conflicts (server data takes precedence)
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Find new quotes from the server that are not in the local storage
  const newQuotes = serverQuotes.filter(
    (serverQuote) =>
      !localQuotes.some((localQuote) => localQuote.text === serverQuote.text)
  );

  // Update local storage with new server quotes
  if (newQuotes.length > 0) {
    localQuotes.push(...newQuotes);
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    quotes = localQuotes; // Update local quotes array
    alert("Quotes updated from the server!");
  }
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    alert("Quotes imported successfully!");
    syncQuotes(); // Sync after import
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Automatically fetch quotes from the server every minute and sync data
setInterval(syncQuotes, 2000); // Sync every 60 seconds

// Initial setup
populateCategories();
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
