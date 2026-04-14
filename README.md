# 🔍 Lost & Found Portal - Manipal University Jaipur

A modern, feature-rich web application designed for MUJ students to report and find lost items on campus. Built with HTML, CSS, and vanilla JavaScript in Manipal's signature orange and white colors.

## ✨ Features

- **Report Lost/Found Items**: Easy-to-use form to report lost or found items with detailed information
- **Campus Location Dropdown**: Specific MUJ locations (AB1, AB2, AB3, LHC, Mess halls, Dome Building, Sports areas, etc.)
- **Advanced Search & Filtering**: Search by keywords and filter by category or item type
- **Category Organization**: Items organized into 8 categories
- **Image Upload**: Support for uploading images of items
- **Local Storage**: All data persists in browser's localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **MUJ Themed UI**: Orange and white color scheme
- **Hero Background**: Dome building background image support

---

## 🏗️ Architecture: Interface & Model

This application follows a clear separation between the **Interface** (what the user sees and interacts with) and the **Model** (how data is stored, managed, and processed behind the scenes).

---

### 🖥️ Interface (Presentation Layer)

The Interface is everything the user directly sees and interacts with. It is responsible for displaying data visually, capturing user input, and responding to user actions. The interface is built across all three project files.

#### HTML Structure (`index.html`)

The HTML defines the skeleton of the page. It is divided into five main sections:

| Section | Description |
|---|---|
| **Header & Navigation** | A sticky top bar containing the site logo ("MUJ Lost & Found") and navigation links (Home, Browse Items, Report Item). The header stays fixed at the top of the viewport as the user scrolls, providing constant access to navigation. |
| **Hero Section** | A full-width banner area with a background image of the Dome Building overlaid with a dark gradient. It contains the main heading, a descriptive paragraph about the portal's purpose, and two call-to-action buttons — "Report Lost Item" and "Report Found Item". This is the first thing the user sees. |
| **Main Content Area** | The core browsing area. It contains three sub-components: (1) **Tab buttons** that let the user switch between viewing All Items, only Lost Items, or only Found Items; (2) **Search and filter bar** with a text search input, a category dropdown (Electronics, Accessories, Documents, etc.), and a sort order dropdown (Most Recent / Oldest First); (3) **Items grid** — an empty container that JavaScript dynamically fills with item cards. There is also an **empty state** message that appears when no items match the current filters. |
| **Report Modal** | A hidden overlay form that slides into view when the user clicks a report button. It contains a complete form with fields for: item name, category (dropdown), description (textarea), campus location (dropdown with 12 MUJ locations), date (date picker), contact information (email or phone), and an optional image upload. A hidden input field stores whether the report is for a "lost" or "found" item. The modal has a close button and can also be dismissed by clicking outside it. |
| **Footer** | Contains copyright information and a contact box with details for the CSO Office and Security Office at Flap Gates / Gate No. 2 for in-person item claims. |

#### CSS Styling (`style.css`)

The CSS controls all visual presentation. Key aspects include:

**Layout System:**
- The `.container` class creates a centered, max-width (1120px) wrapper for content
- The items grid uses CSS Grid with `auto-fill` and `minmax(320px, 1fr)`, which means cards automatically arrange into rows, each card being at least 320px wide and expanding to fill available space
- Flexbox is used for the navigation bar, tab buttons, search bar, hero actions, and card metadata

**Color Scheme:**
- Primary color: `#e8622a` (Manipal orange) — used for the logo, active tabs, buttons, links, and accents
- Backgrounds: `#f5f6f8` (light gray body), `#ffffff` (white cards and header)
- Text: `#1c1f26` (dark for headings), `#5f6778` (gray for secondary text), `#9aa1b0` (muted for metadata)
- Lost badge: Red background (`#fef2f2`) with red text (`#dc2626`)
- Found badge: Green background (`#f0fdf4`) with green text (`#16a34a`)

**Component Styling:**
- **Item cards**: White background with a subtle border and shadow. On hover, cards lift upward by 4px and gain a deeper shadow, giving a sense of interactivity
- **Buttons**: Two variants — primary (solid orange background with white text) and secondary (white background with orange border and text). Both have hover effects
- **Modal**: A fixed overlay covering the entire viewport with a semi-transparent dark background. The modal content box is centered, has rounded corners, and scrolls vertically if the form is tall
- **Form inputs**: Clean borders with an orange highlight on focus
- **Badges**: Pill-shaped labels with rounded corners, used to distinguish "Lost" (red) from "Found" (green) items
- **File upload area**: A dashed border box that changes color on hover to indicate it's interactive

**Responsive Design:**
- At 768px and below: navigation stacks vertically, hero text shrinks, the items grid becomes single-column, tabs stack vertically, and the search/filter bar stacks vertically
- At 480px and below: hero title shrinks further, grid gap reduces, and card images become shorter

#### Dynamic Rendering (JavaScript → DOM)

While the HTML provides the static skeleton and CSS styles it, JavaScript bridges the Model and Interface by dynamically generating and updating what the user sees:

- **`renderItems()`**: This is the core rendering function. Every time data changes (new item added, filter changed, search performed), this function is called. It clears the items grid, gets the current filtered data from the Model, and rebuilds every card from scratch. If no items match, it shows the empty state message instead.

- **`createItemCard(item)`**: Takes a single item object from the Model and constructs a complete card element using `document.createElement()`. The card includes an image (or placeholder), a type badge, title, category with emoji icon, truncated description, location, and relative date. Each card is also given a click event that triggers a contact information popup.

- **`showItemDetails(item)`**: When a card is clicked, this function creates a popup overlay entirely in JavaScript (not from HTML) showing the reporter's contact information and instructions for claiming the item.

- **`openModal(type)` / `closeModal()`**: Controls the visibility of the report form. Opening adds the `.active` CSS class (which changes `display` from `none` to `flex`), sets the form title based on whether the user is reporting a lost or found item, and disables body scrolling. Closing removes the class, resets the form, and restores scrolling.

---

### 🧠 Model (Data Layer)

The Model handles all data — its structure, storage, retrieval, and the logic that processes it. The user never sees the Model directly; they only see its effects through the Interface.

#### Data Structure

Every item in the system (whether lost or found) is represented as a JavaScript object with the following properties:

| Property | Type | Description |
|---|---|---|
| `id` | String | A unique identifier generated by combining the current timestamp (in base-36) with a random string. This ensures no two items ever have the same ID, even if created at the same millisecond. |
| `type` | String | Either `"lost"` or `"found"`. Determines the badge color and which tab the item appears under. |
| `name` | String | The name of the item as entered by the user (e.g., "iPhone 13 Pro", "Blue Backpack"). |
| `category` | String | One of eight predefined categories: `electronics`, `accessories`, `documents`, `clothing`, `bags`, `keys`, `pets`, or `other`. Used for filtering and displaying category-specific emoji icons. |
| `description` | String | A free-text description providing details about the item. Displayed on the card but truncated to 3 lines via CSS. |
| `location` | String | The campus location where the item was lost or found. Selected from a dropdown of 12 MUJ-specific locations (AB1, AB2, AB3, LHC, Old Mess, New Mess, Dome Building, Football Ground, Grand Stairs, Running Ground, Mech AWS Building, Running Track). |
| `date` | String | The date the item was lost or found, in `YYYY-MM-DD` format. Displayed on cards as a relative date ("Today", "Yesterday", "3 days ago", or a formatted date for older items). |
| `contact` | String | The reporter's contact information — typically an MUJ email address or phone number. Shown when a user clicks on an item card. |
| `image` | String or null | If the user uploads an image, it is converted to a base64-encoded data URL string using the FileReader API and stored here. If no image is uploaded, this is `null` and a placeholder SVG is used instead. |
| `timestamp` | Number | A Unix timestamp in milliseconds (`Date.now()`). This is the primary field used for sorting items by "Most Recent" or "Oldest First". It represents when the report was submitted, not when the item was lost/found. |

#### Application State

The entire application state is held in four global JavaScript variables:

| Variable | Type | Purpose |
|---|---|---|
| `items` | Array | The master list of all reported items. Every item object lives in this array. When a new item is reported, it is added to the beginning of this array using `unshift()`. |
| `currentFilter` | String | Tracks which tab is currently active. Possible values: `"all"`, `"lost"`, or `"found"`. When the user clicks a tab, this variable is updated, and the items are re-rendered. |
| `currentCategory` | String | Tracks the selected category filter. Possible values: `"all"` or any of the 8 category names. Updated when the user changes the category dropdown. |
| `currentSort` | String | Tracks the selected sort order. Possible values: `"recent"` (newest first) or `"oldest"` (oldest first). Updated when the user changes the sort dropdown. |

These four variables together fully describe what the user should see at any moment. Any change to these variables triggers a re-render of the Interface.

#### Data Persistence (localStorage)

The application uses the browser's `localStorage` API to save and load data so that items survive page reloads and browser restarts:

- **`saveItemsToStorage()`**: Called every time the `items` array changes (after adding a new item). It converts the entire `items` array to a JSON string using `JSON.stringify()` and stores it under the key `"lostAndFoundItems"` in localStorage. Wrapped in a try-catch to handle potential storage errors (e.g., exceeding the ~5MB localStorage limit).

- **`loadItemsFromStorage()`**: Called once when the page loads. It retrieves the stored JSON string from localStorage, parses it back into a JavaScript array using `JSON.parse()`, and assigns it to the `items` variable. If parsing fails or nothing is stored, `items` defaults to an empty array.

**Important limitation**: Since images are stored as base64 strings (which can be very large — a single photo can be 1-2MB as base64), uploading many images can quickly fill the ~5MB localStorage limit. A production version would use a server and database.

#### Business Logic

**Filtering — `getFilteredItems()`**

This function applies a pipeline of filters to the master `items` array and returns the result:

1. Start with all items
2. If `currentFilter` is not `"all"`, keep only items whose `type` matches (e.g., only `"lost"` items)
3. If `currentCategory` is not `"all"`, keep only items whose `category` matches (e.g., only `"electronics"`)
4. Sort the remaining items by `timestamp` — either descending (newest first) or ascending (oldest first) based on `currentSort`
5. Return the filtered and sorted array

**Searching — `handleSearch()`**

When the user types in the search box, the function takes the already-filtered items (from `getFilteredItems()`) and further filters them by checking if the search term (case-insensitive) appears in the item's `name`, `description`, or `location`. The results are then rendered.

**ID Generation — `generateId()`**

Creates a unique ID by combining `Date.now().toString(36)` (current time in base-36) with `Math.random().toString(36).substr(2)` (random characters). This produces IDs like `"m3k8x7fah92jk"` that are virtually guaranteed to be unique.

**Date Formatting — `formatDate()`**

Converts a `YYYY-MM-DD` date string into a human-friendly relative format:
- If today → "Today"
- If yesterday → "Yesterday"
- If within 7 days → "X days ago"
- If older → Formatted date like "Jan 15, 2026"

**Placeholder Images — `getPlaceholderImage()`**

When no image is uploaded, generates an inline SVG data URI for each category. These are lightweight vector images embedded directly as strings — no network request is needed. Each category has its own emoji (📱 for electronics, 🎒 for bags, 🔑 for keys, etc.) rendered on a light gray background.

**Sample Data — `addSampleData()`**

On the very first visit (when localStorage is empty), the application populates 5 sample items so the page doesn't appear empty. These items cover different types, categories, and locations with realistic MUJ-specific data. Their timestamps are artificially staggered to demonstrate sorting.

---

### 🔄 How Interface & Model Work Together

The Interface and Model communicate through a simple cycle:

```
User Action (Interface)
    ↓
Update State (Model)
    ↓
Save to Storage (Model)
    ↓
Re-render Display (Interface)
    ↓
User sees updated view
```

**Example Flow — Reporting a Lost Item:**

1. User clicks "Report Lost Item" button → **Interface** opens the modal form
2. User fills out all fields and clicks Submit → **Interface** captures form data
3. JavaScript creates a new item object → **Model** adds it to the `items` array with `unshift()`
4. `saveItemsToStorage()` writes updated array to localStorage → **Model** persists the data
5. `renderItems()` rebuilds the entire grid → **Interface** shows the new card at the top
6. `closeModal()` hides the form → **Interface** returns to the main view

**Example Flow — Filtering Items:**

1. User clicks the "Found Items" tab → **Interface** detects the click
2. `currentFilter` is set to `"found"` → **Model** state is updated
3. `renderItems()` calls `getFilteredItems()` → **Model** filters the array to only "found" items
4. The filtered array is used to rebuild the grid → **Interface** shows only found items

**Example Flow — Searching:**

1. User types "wallet" in the search box → **Interface** captures the input
2. `getFilteredItems()` applies tab and category filters → **Model** produces filtered list
3. Search further filters by matching "wallet" against name, description, and location → **Model** produces final list
4. `renderItems(searchResults)` rebuilds the grid → **Interface** shows matching items only

---

## 🎨 MUJ Customizations

- **Orange & White Theme**: Matches Manipal University branding
- **Campus Locations**: 12 specific MUJ locations including academic blocks, mess halls, sports facilities
- **Sample Data**: Pre-loaded with MUJ-specific examples
- **Contact Information**: CSO Office and Security Office details in footer

## 📍 Campus Locations Available

- AB1 (Academic Block 1)
- AB2 (Academic Block 2)
- AB3 (Academic Block 3)
- LHC (Learning Hub Center)
- Old Mess
- New Mess
- Dome Building
- Football Ground
- Grand Stairs
- Running Ground
- Mech AWS Building
- Running Track

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Installation

1. Download all project files to a folder:
   - `index.html`
   - `style.css`
   - `script.js`

2. **(Optional)** Add a photo of the MUJ dome building:
   - Save your dome building photo as `dome-building.jpg` in the same folder
   - The image will appear as the hero section background

3. Open `index.html` in your web browser

That's it! The application will load with sample data.

## 📖 How to Use

### Reporting a Lost Item

1. Click the **"Report Lost Item"** button
2. Fill in the form:
   - Item name
   - Category
   - Description
   - Select campus location from dropdown
   - Date
   - Your contact information (MUJ email recommended)
   - Optional: Upload an image
3. Click **"Submit Report"**
4. Your item will appear in the listings

### Reporting a Found Item

1. Click the **"Report Found Item"** button
2. Fill in the details of the item you found
3. Submit the form
4. Item appears with a "Found" badge

### Searching for Items

1. Use the **search box** to search by name, description, or location
2. Use the **category dropdown** to filter by specific categories
3. Use the **tabs** (All Items / Lost Items / Found Items) to filter by type
4. Use the **sort dropdown** to sort by date

### Contacting Item Owners

1. Click on any item card
2. A popup will show the contact information
3. Reach out and provide proof of ownership

### Need Help?

For any issues or to claim items in person:

- Contact **CSO Office** or **Security Office**
- Location: **Flap Gates / Gate No. 2**

## 💾 Data Storage

All data is stored in your browser's localStorage:

- ✅ No server required
- ✅ Fast and instant
- ✅ Data persists between sessions
- ⚠️ Data is local to your browser
- ⚠️ Items are not shared between different browsers or devices

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling
- **JavaScript (ES6+)**: Vanilla JavaScript, no dependencies
- **Google Fonts**: Inter and Outfit fonts
- **localStorage API**: Data persistence

### File Structure

```
Lost_and_found_portal/
├── index.html          # Main HTML structure
├── style.css           # All styling (MUJ orange theme)
├── script.js           # Application logic
├── dome-building.jpg   # (Optional) Hero background image
└── README.md           # This file
```

## 📄 License

This project is open source and available for educational and campus use.

---

**Built with ❤️ for Manipal University Jaipur students**

For support, contact CSO Office or Security Office at Flap Gates / Gate No. 2
