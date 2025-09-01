import type {IJoke} from '@/types/Joke.ts';

export interface IPreference {
	dislikedJokeIDs: Set<IJoke['id']>;
	likedJokeIDs: Set<IJoke['id']>;
	optClickToRevealPunchline: boolean;
	optHideDisliked: boolean;
}
