# Implementation Plan

Below is a step-by-step Implementation Plan for the Connections Game. Each step includes a small, specific task and a test to validate successful completion. Focus is on the base daily puzzle functionality, using the Game Design Document, tech stack recommendations, and the Cursor Rules.

---

# Implementation Plan

## 1\. Establish the Project Structure

1. **Create a new repository** and initialize a clean project folder.  
2. **Add a `.cursor/rules`** file containing the Cursor Rules (from "Cursor Rules.md").  
   - Ensure these rules are version-controlled and recognized by your environment.  
3. **Commit** the initial project setup to source control.

**Test**

- Verify the `.cursor/rules` file is present in the repository and references "Cursor Rules.md" accurately.  
- Confirm that your development environment recognizes these project-specific rules (no build or lint errors related to the rules).

---

## 2\. Configure the Tech Stack

1. **Initialize your package manager** (e.g., `npm init` or `yarn init`).  
2. **Install core dependencies** based on the Game Design Document:  
   - **React 18.2.0**  
   - **Parcel 2.9.2**  
   - **Tailwind CSS**  
   - **Styled Components**  
   - **Radix UI**  
   - **google-spreadsheet**  
   - **date-fns**  
   - **ESLint** \+ **Prettier**  
   - **React Spring** and **React Confetti Explosion** (for future animations)  
3. **Set up Parcel** as your development/build tool.

**Test**

- Run the development server via Parcel.  
- Confirm that the basic starter application compiles with zero errors or warnings.  
- Check that installed versions match the recommended versions (or are compatible if pinned versions aren't available).

---

## 3\. Implement and Test Linting/Formatting

1. **Configure ESLint** using the react-app config (or a custom config if needed).  
2. **Add Prettier** to handle code formatting.  
3. **Enable "format on save"** in your code editor or build scripts.

**Test**

- Intentionally add poorly formatted code or a small lint error.  
- Observe ESLint flags the error, and Prettier corrects formatting on save.  
- Confirm that no error or warning remains after correction.

---

## 4\. Initialize the Frontend Structure

1. **Create an `index.html`** entry file.  
2. **Add a root `App` component** in `src/App.jsx` (or `.tsx` if using TypeScript).  
3. **Configure Tailwind CSS**:  
   - Generate the `tailwind.config.js`.  
   - Import Tailwind in your main CSS entry point.

**Test**

- Start the dev server and ensure a simple "Hello Puzzle" text appears in the browser.  
- Confirm Tailwind utility classes work by applying a small style (e.g., a background color).

---

## 5\. Set Up Google Sheets Access

1. **Obtain credentials** for reading from your specific Google Sheet.  
2. **Create a dedicated module** (e.g., `src/utils/fetchPuzzles.js`) that uses the `google-spreadsheet` package:  
   - Authenticate with your Google service account credentials.  
   - Read the columns: `category`, `word1-4`, `difficulty`, and `releaseDate`.  
3. **Parse the dates** with `date-fns` to compare them with the current date.

**Test**

- Temporarily log the fetched puzzle data to the console.  
- Confirm the columns (`category`, `word1-4`, `difficulty`, `releaseDate`) are received and parsed correctly.

---

## 6\. Implement Daily Puzzle Selection

1. **Create a utility function** `getPuzzleForDate` that:  
   - Accepts a target date (default to "today").  
   - Matches puzzle rows where `releaseDate` \== the target date.  
   - Returns the appropriate puzzle object or an indicator if no puzzle is found.  
2. **Integrate** this utility in your main `App` component so the homepage loads the daily puzzle.

**Test**

- Manually test with the current date.  
- If a puzzle row has `releaseDate` matching today, verify that puzzle is returned and displayed.  
- If no puzzle is found, confirm the UI shows a "No puzzle for today" message (or a placeholder).

---

## 7\. Build the Base Puzzle Logic

1. **Define data structures** in a new file (e.g., `PuzzleLogic.js`):  
   - How you'll store the puzzle words, category, and difficulty.  
   - The guess limit and how to decrement guesses on each incorrect grouping.  
2. **Create methods** for:  
   - Checking if four selected words match the correct category.  
   - Tracking the number of correct/incorrect guesses until puzzle completion or failure.

**Test**

- Feed in a mock puzzle with known words and category.  
- Attempt both correct and incorrect groupings:  
  - Ensure guesses decrease on incorrect attempts.  
  - Confirm a correct grouping triggers "completed" logic.

---

## 8\. Integrate Local Storage

1. **Use `localStorage`** to record each puzzle's result keyed by its `releaseDate`.  
2. **On puzzle load**, check if there's a stored completion or fail state:  
   - If present, load that state immediately (e.g., no need to solve again).  
3. **After puzzle ends**, write the new status (win/fail) to localStorage.

**Test**

- Complete the puzzle or exceed the guess limit.  
- Refresh the page and confirm the UI shows the correct final state without re-solving.  
- Check `localStorage` in the browser dev tools to verify the data is stored.

---

## 9\. Implement a Basic Puzzle UI

1. **Create a React component** (e.g., `<DailyPuzzle />`) that:  
   - Displays the puzzle's words.  
   - Lets the user select four words to form a group.  
   - Shows the guess count and puzzle status (in-progress, win, or fail).  
2. **Use Radix UI** components where relevant for accessibility and standard UI patterns (e.g., modals or alerts).

**Test**

- Select four words intentionally (both correct and incorrect):  
  - Observe the guess count updates.  
  - Ensure correct grouping triggers completion state.  
  - Exceed guess limit and check that the puzzle transitions to fail state.

---

## 10\. Apply Basic Styling and Feedback

1. **Use Tailwind** classes or Styled Components for layout and design.  
2. **(Optional)** Add small transitions with React Spring or a short confetti effect on success (React Confetti Explosion).  
3. **Ensure accessibility** with ARIA roles/labels, especially on interactive elements.

**Test**

- Interact with the puzzle in the browser.  
- Confirm that the puzzle layout is clear, readable, and consistent with your design goals.  
- Use a screen reader to verify that essential elements (buttons, modals) are announced appropriately.

---

## 11\. Validate Build and Deployment

1. **Run a production build** via Parcel and confirm no errors.  
2. **Test your final build** in multiple browsers:  
   - Chrome, Firefox, Safari, and Edge if possible.  
   - Confirm puzzle loads properly and localStorage states persist.  
3. **Finalize documentation** for how to run and maintain the project.

**Test**

- Serve the production build (e.g., using a simple static server).  
- Load the puzzle in the browser and do a final pass on all functionalities:  
  - Fetching data from Google Sheets.  
  - Displaying the correct daily puzzle.  
  - Tracking completion in localStorage.  
  - Handling correct vs. incorrect groupings.

---

## 12\. Implement Puzzle Navigation Features

1. **Create a Puzzle Archive component** that:
   - Displays all available puzzles organized by date.
   - Shows completion status for each puzzle (from localStorage).
   - Uses a clear, accessible UI for navigating between puzzles.
2. **Add routing logic** using React Router:
   - Implement routes for `/` (today's puzzle) and `/puzzles/:date` (specific puzzle by date).
   - Create navigation links in the header/sidebar.
3. **Enhance the PuzzleDataProvider** to:
   - Load a specific puzzle based on the route parameter.
   - Handle loading and error states for puzzle navigation.

**Test**

- Navigate to the Archive view and verify all available puzzles are listed.
- Click on a specific puzzle date and confirm the correct puzzle loads.
- Test direct URL access to `/puzzles/:date` to ensure deep linking works.
- Verify completion status indicators match the localStorage data.

---

## Summary

By following these steps, you ensure a clean, modular setup that respects the **Game Design Document** requirements and the **Cursor Rules** guidelines. Each step is validated through focused tests, keeping the implementation robust and ready to extend for future enhancements.  
