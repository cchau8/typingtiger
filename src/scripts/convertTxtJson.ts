import fs from "fs";
import path from "path";

const getWords = () => {
    const fileName = "google-10000-english";
    const filePath = path.join(process.cwd(), "words", `${fileName}.txt`);

    const fileContents = fs.readFileSync(filePath, "utf-8");

    const words = fileContents.split(/\s+/).filter(Boolean);
    fs.writeFile(`./words/${fileName}.json`, JSON.stringify(words), (err) => {
        if (err) {
            console.error(err);
        }
    });
    return "ok";
};

console.log(getWords());
