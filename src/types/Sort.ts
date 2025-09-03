export const SORT_DIRECTION = {
	ASC: 'asc',
	DESC: 'desc',
	NONE: 'none',
} as const;

export type TSortDirection = typeof SORT_DIRECTION[keyof typeof SORT_DIRECTION];
