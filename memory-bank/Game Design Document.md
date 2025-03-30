# Game Design Document

## 1\. Overview

Create a daily “NY Connections”-style puzzle game using data from a Google Spreadsheet. The puzzle displays groups of words that share a common connection. Each puzzle is tied to a `releaseDate`, which determines when it appears on the homepage.

## 2\. Google Spreadsheet Data

Your game will read from a Google Sheet with the following columns:

- **category**  
- **word1**  
- **word2**  
- **word3**  
- **word4**  
- **difficulty**  
- **releaseDate**

**Usage**

- Each row represents a single puzzle.  
- `category` is the label or theme for the group of words.  
- `word1` through `word4` are the words for that category.  
- `difficulty` is a hint for how challenging the puzzle is.  
- `releaseDate` indicates when the puzzle becomes active (and is shown on the main page on that date).

## 3\. Key Features

1. **Daily Puzzle (Homepage)**  
     
   - Shows the puzzle corresponding to today’s `releaseDate`.  
   - Pulls puzzle data from the Google Sheet.

   

2. **More Puzzles Page**  
     
   - Lists all available puzzles by `releaseDate`.  
   - Allows navigation to any puzzle for replay or catching up on missed days.

   

3. **Puzzle Play**  
     
   - Player groups related words to solve each puzzle.  
   - Limited guesses (set by design) before a puzzle is marked failed.

   

4. **Progress Tracking**  
     
   - Local storage tracks puzzle completion status (win/fail).  
   - Past puzzles show their status in the “More Puzzles” list.

## 4\. Gameplay Flow

1. **Start**  
     
   - User lands on the homepage and sees today’s puzzle.  
   - Words and category info come from the row matching today’s `releaseDate`.

   

2. **Solve Attempts**  
     
   - User tries to group the four words that share a common category.  
   - The puzzle might have multiple categories to discover.  
   - If guesses run out, puzzle is marked failed.

   

3. **Completion**  
     
   - If solved within the guess limit, user sees a “Victory” message.  
   - If out of guesses, user sees a “Failure” message.  
   - Local storage updates with the result.

   

4. **Exploring More Puzzles**  
     
   - “More Puzzles” page lists puzzles by `releaseDate`.  
   - User can jump to older or future puzzles.  
   - Completed puzzles display their status.

## 5\. Puzzle Mechanics

- **Groups of Four**  
  - Each puzzle has one or more categories, each with four words.  
- **Incorrect Guesses**  
  - If user picks the wrong group of words, a guess is deducted.  
  - Exceeding guess limit ends the game in failure.  
- **Difficulty Setting**  
  - Pulled from the `difficulty` column.  
  - Could adjust guess limits or time limits based on difficulty.

## 6\. User Interface

1. **Homepage**  
     
   - Displays the current puzzle.  
   - Shows puzzle words, guess counter, and any instruction or hint.  
   - Includes top navigation bar with a link to “More Puzzles.”

   

2. **More Puzzles Page**  
     
   - Lists puzzles by `releaseDate`.  
   - Clearly marks completed puzzles (win/fail).

   

3. **Puzzle Screen**  
     
   - Center area to choose and confirm word groupings.  
   - Visual feedback for correct/incorrect groupings.

   

4. **Victory/Failure Overlay**  
     
   - Appears after puzzle conclusion.  
   - Shows puzzle result, stats, and navigation options.

## 7\. Local Storage Integration

- **Key/Value Structure**  
  - A key for each `releaseDate`.  
  - Value includes puzzle result (win/fail) and other relevant data.  
- **Behavior**  
  - On puzzle load, game checks local storage to see if user already completed it.  
  - On puzzle completion, game writes the final status to local storage.

## 8\. Tech Stack

### Core Technologies

- **React 18.2.0** for building a component-based frontend.  
- **Parcel 2.9.2** for bundling and development server.

### Styling

- **Tailwind CSS 3.3.3** for utility-first styling.  
- **Styled Components 6.1.0** for scoped, component-level styling.  
- **Radix UI** for accessible components.

### UI Components & Libraries

- **Radix UI** (Accordion, Alert Dialog, Popover, etc.) for consistent, accessible UI elements.  
- **Lucide React** for icons.

### Animations

- **React Spring** for smooth animations.  
- **React Confetti Explosion** for celebratory effects on puzzle completion.

### Date Handling

- **date-fns** for parsing and formatting dates (e.g., matching today’s `releaseDate`).

### URL Parameter Handling

- **query-string** for reading and setting URL parameters.

### Development Tools

- **ESLint** (react-app config) for linting.  
- **Prettier** for code formatting.  
- **new-component** for generating new React components quickly.

### Data Management

- **google-spreadsheet** for fetching puzzle data from Google Sheets.  
- **localStorage** for storing puzzle completion status.

### Browser Support

- Targets browsers with \>0.5% market share.  
- Last 2 versions of major browsers.  
- Excludes dead browsers.

### Architecture

- **Component-based** structure with React.  
- **Context API** for global state management.  
- **Modern build tooling** with Parcel.  
- **Utility-first CSS** with Tailwind.  
- **Google Sheets** for the data source backend.

## 9\. Future Enhancements

- Improved mobile UX with responsive layouts.  
- Social sharing to let users post results.  
- Additional animations or sound effects.  
- Support for timed challenges or optional hints.

## 10\. Summary

This game uses React, Parcel, and a range of modern web technologies to create a custom daily “NY Connections”-style puzzle. The puzzle data, including words, categories, difficulty, and release dates, comes from a Google Sheet. Players access the day’s puzzle by default on the homepage and can explore older and upcoming puzzles on the “More Puzzles” page. Local storage tracks wins and losses for each puzzle. This design supports a variety of future improvements for a polished, engaging puzzle experience.  
