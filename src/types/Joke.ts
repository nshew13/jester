export interface IJokeOrigin {
	id?: number;
	punchline: string;
	setup: string;
	type: string;
}

export interface IJoke extends Required<IJokeOrigin> {
	/**
	 * a lower-cased, "word" character-only setup
	 */
	searchString: string;
}

export type TJokeCategoryToggles = Record<IJoke['type'], boolean>;
