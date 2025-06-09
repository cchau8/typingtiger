import words from "@/lib/words/google-10000-english.json";

/**
 * Shuffles an array in place and returns a new shuffled array.
 * This function does not modify the original array.
 * @param {Array} arr The array to shuffle.
 * @returns {Array} A new array with the elements of the original array in a random order.
 */
export function shuffleArray(arr: string[]) {
    // Create a copy of the array to avoid modifying the original
    const shuffled = [...arr];

    // Start from the last element and swap one by one
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));

        // Swap the elements at positions i and j
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Gets n unique random items from an array.
 * @param {Array} arr The source array.
 * @param {number} n The number of unique random items to get.
 * @returns {Array} An array containing n unique random items.
 */
export function getRandomItems(arr: string[], n: number) {
    if (n > arr.length) {
        console.warn(
            "Cannot get more items than are available in the array. Returning the shuffled array."
        );
        return shuffleArray(arr);
    }
    // 1. Shuffle the whole array
    const shuffled = shuffleArray(arr);

    // 2. Return the first 'n' items from the shuffled array
    return shuffled.slice(0, n);
}

export default function generateWords(number: number): string[] {
    try {
        const half = words.splice(0, 200);
        const randomWords = getRandomItems(half, number);
        return randomWords;
    } catch (error) {
        console.error(error);
    }
    return [];
}
