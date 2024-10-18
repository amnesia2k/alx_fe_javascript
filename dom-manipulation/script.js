let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Server simulation (using JSONPlaceholder API)
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Display a random quote
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

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    syncNewQuoteToServer(newQuote); // Sync with server
  }
}

// Populate categories dynamically in the dropdown
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

// Filter quotes by selected category
function filterQuotesByCategory() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter((quote) => quote.category === selectedCategory);
}

// Sync new quote with the server
async function syncNewQuoteToServer(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" },
    });
    const serverResponse = await response.json();
    console.log("Quote synced to the server:", serverResponse);
  } catch (error) {
    console.error("Error syncing new quote to the server:", error);
  }
}

// Fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Resolve conflicts
    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Error fetching quotes from the server:", error);
  }
}

// Conflict resolution: server data takes precedence
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Find new quotes from the server that don't exist locally
  const newQuotes = serverQuotes.filter(
    (serverQuote) =>
      !localQuotes.some((localQuote) => localQuote.text === serverQuote.text)
  );

  // Update local storage with new quotes from server
  if (newQuotes.length > 0) {
    localQuotes.push(...newQuotes);
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    quotes = localQuotes; // Update local quotes array
    alert("Quotes updated from the server!");
  }
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to a JSON file
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

// Automatically fetch quotes from the server every minute
setInterval(fetchQuotesFromServer, 60000);

// Initial setup
populateCategories();
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
