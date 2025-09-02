# jester

Coding exercise in Vue 3, Quasar and Vite.

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

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

https://openclipart.org/detail/214483/colored-jester-hat-by-dear_theophilus-214483


## Implementation notes

### Fetch and render the API data
There's really not much "fetching" to do. The [Official Joke API](https://github.com/15Dkatz/official_joke_api/)
provides *some* API endpoints, but none that would allow the requirement to sort and filter. Joke "types" are not
queryable using the API. Instead, it makes more sense to pull the full dataset and build a Set of types for
use with this app.

(It would be more efficient to just include the JSON file in the project, but then there's no example of a fetch call.)

### Provide sorting controls
There's not much to sort by. `id` is conjecture and removed from the user space. We could sort the jokes
alphabetically by `setup`, but that seems pointless, and `punchline` even more so. The only remaining field
from the dataset is `type`, which is what has been implemented.

Instead of sorting, filter toggles have been added.

### Implement pagination
The API does not provide a way to fetch a page of jokes at a time. The options are limited to individual jokes
by ID, an arbitrary number of randomly chosen jokes or an arbitrary number of jokes by type. The only API call
that could be paged is the ID option, which seems inefficient. The current implementation uses QTable's built-in
pagination over the whole dataset.

Paging was implemented before adding Quasar, and is still present, just commented-out.
