import { writable } from 'svelte/store';

export const selectedCountry = writable(null);
export const ecoScore = writable(0);
export const botStep = writable(0); // for bot assistant
