const userText = document.querySelector(".user-text") as HTMLTextAreaElement;
const charAll = document.querySelector("#char-all") as HTMLSpanElement;
const charNowhitespace = document.querySelector(
    "#char-nowhitespace"
) as HTMLSpanElement;
const wordAll = document.querySelector("#word-all") as HTMLSpanElement;
const wordUnique = document.querySelector("#word-unique") as HTMLSpanElement;
const avgWordLength = document.querySelector(
    "#avg-word-length"
) as HTMLSpanElement;
const templateWordItem = document.querySelector(
    "#word-item"
) as HTMLTemplateElement;
const words = document.querySelector(".words") as HTMLDivElement;

userText.addEventListener("input", updateStats);

interface Word {
    value: string;
    count: number;
}

function updateStats(e: any) {
    const value: string = e.target.value;

    if (value === "") {
        charAll.textContent = (0).toString();
        charNowhitespace.textContent = (0).toString();
        wordAll.textContent = (0).toString();
        wordUnique.textContent = (0).toString();
        avgWordLength.textContent = (0).toString();
        words.textContent = "";
        return;
    }

    charAll.innerText = value.length.toString();
    charNowhitespace.innerText = getCharNowhitespace(value).toString();
    wordAll.innerText = getAllWords(value).length.toString();
    wordUnique.innerText = getUniqueWords(value).size.toString();
    avgWordLength.innerText = getAvgLength(value).toFixed(2).toString();

    const frequencies = getFrequencies(value).slice(0, 15);
    renderFrequencies(frequencies);
}

function getCharNowhitespace(value: string): number {
    return value.replace(/ /gi, "").replace(/\n/gi, "").length;
}

function getAllWords(value: string): string[] {
    return value
        .split(" ")
        .map((v) => v.toLowerCase())
        .map((v) => v.split("\n"))
        .reduce((acc, val) => acc.concat(val), [])
        .filter((value) => value !== "")
        .map((v) => v.replace(/[\[\]()\{\},"'.?!:;]/gi, ""));
}

function getUniqueWords(value: string): Set<string> {
    return new Set(getAllWords(value));
}

function getFrequencies(value: string): Word[] {
    const words = getAllWords(value);
    const frequencies: Word[] = [];
    words.forEach((word) => {
        word = word.toLowerCase();
        if (frequencies.some((f) => f.value == word)) {
            frequencies.forEach((frequency) => {
                if (frequency.value === word) {
                    frequency.count++;
                    return;
                }
            });
            return;
        }

        frequencies.push({ count: 1, value: word });
    });

    frequencies.sort(sortWordsFrequencies).reverse();
    return frequencies;
}

function getAvgLength(value: string): number {
    const words = getAllWords(value);
    let sum = 0;
    words.forEach((word) => (sum += word.length));
    return sum / words.length || 0;
}

function renderFrequencies(frequencies: Word[]) {
    if (frequencies.length == 0) return;

    const old_list = document.querySelector(".words ul");
    if (old_list != null) {
        old_list.parentElement?.removeChild(old_list);
    }

    const new_list = document.createElement("ul");

    frequencies.forEach((frequency) => {
        const clone = templateWordItem.content.cloneNode(true) as any;
        clone.querySelector(".frequent-value").innerText = frequency.value;
        clone.querySelector(".frequent-count").innerText =
            frequency.count.toString();

        new_list.appendChild(clone);
    });

    words?.appendChild(new_list);
}

function sortWordsFrequencies(a: Word, b: Word) {
    if (a.count > b.count) return 1;
    if (a.count < b.count) return -1;
    if (a.value.length > b.value.length) return 1;
    if (a.value.length < b.value.length) return -1;
    return 0;
}
