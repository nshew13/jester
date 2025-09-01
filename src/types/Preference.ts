import type {IJoke} from '@/types/Joke.ts';

export interface IPreference {
	clickToRevealPunchline: boolean;
	dislikedJokeIDs: Set<IJoke['id']>;
	likedJokeIDs: Set<IJoke['id']>;
}
