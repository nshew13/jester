export interface IJoke {
	id?: number;
	punchline: string;
	setup: string;
	type: string;
}

export type TJokeCategoryToggles = Record<IJoke['type'], boolean>;
