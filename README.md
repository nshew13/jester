# jester

Coding exercise in Vue 3, Quasar and Vite.

![app screenshot](./app-screenshot.png)

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with Vitest

```sh
pnpm test
```

### Lint with ESLint

```sh
pnpm lint
```

## Image attribution
- Jester hat from [openclipart.org](https://openclipart.org/detail/214483/colored-jester-hat-by-dear_theophilus-214483)
- Bomb from [pixabay.com](https://pixabay.com/de/illustrations/bombe-explodieren-detonieren-1602109/)

## Implementation highlights
 - Native `fetch` calls
 - Responsive layout (breakpoint at 720px)
 - Quasar component library
   - QTable used for data
 - Search and sort by joke setup
   - `searchString` added to model to reduce repeated `toLocaleLowerCase` calls 
 - Filter by joke type, liked
 - Pinia stores for jokes and user preferences
   - Preferences automatically written to `localStorage` via `vueuse`
 - User preferences
   - Hide punchline with "click to reveal"
   - Like/dislike individual jokes
   - Hide disliked jokes
 - CSS
   - "Click to reveal" punchlines animate in
   - Logo spins while loading
   - Joke background colors sourced from jester graphic and programmatically lightened
 - Higher-order components `ButtonActionLike` and `ButtonActionDislike` extend `ButtonActionBase` 
 - Simple unit testing
   - Coverage report is available with `--coverage`
 - Git `pre-push` hook (via Husky)
   - Prevents pushing with failing lint or test(s), or packages failing security audit

## Implementation notes

### Fetch and render the API data
There's really not much "fetching" to do. The [Official Joke API](https://github.com/15Dkatz/official_joke_api/)
provides *some* API endpoints, but none that would satisfy the requirement to
sort and filter. Instead, it makes more sense to pull the full dataset and store
in memory for use with this app.

(It would be more efficient to just include the JSON file in the project, but
then there's no example of a fetch call.)

### Provide sorting controls
There's not much to sort by that seems practical for a real UX. Nevertheless, we allow the
user to sort the jokes alphabetically by `setup`. When `setup` sorting isn't active, the
jokes are sorted/grouped by `type`.

In addition to sorting (or maybe in place of), filter toggles have been added for joke `type`.

### Implement pagination
The API does not provide a way to fetch a page of jokes at a time. The options are limited to
individual jokes by ID, an arbitrary number of randomly chosen jokes or an arbitrary number of
jokes by type. The only API call that could be paged is the ID option, which seems inefficient.
The current implementation uses QTable's built-in pagination over the whole dataset.

Paging was implemented before adding Quasar, and is still present in `JokesStore`, just commented-out.


## Possible roadmap
- `App` is starting to get too big and needs to delegate to subcomponents.
- If we get many more joke types, we'll need to put their filter toggles in a drop-down.
  The current design avoids the extra click(s) involved in that UI.


## Known issues
- [**typescript-eslint #11546:**](https://github.com/typescript-eslint/typescript-eslint/issues/11530)
  Bug: (Windows) Parsing error: inferred tsconfigRootDir should be a resolved absolute path, but received: "C:/Users/29422/Desktop/vue-project".
  - Fixed with pnpm override `"typescript-eslint": "^8.42.0"` until packages catch up. 
