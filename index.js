const Tesseract = require('tesseract.js');
const got = require('got');
const dotenv = require('dotenv');
dotenv.config();

Tesseract.recognize(
    './public/assets/easy-algebra/algebra4.jpg',
    'eng',
    { logger: m => console.log(m) }
).then(async ({ data: { text } }) => {
    const prompt = `
I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".

Q: What is human life expectancy in the United States?
A: Human life expectancy in the United States is 78 years.

Q: How many squigs are in a bonk?
A: Unknown

Q: Jane has 9 balloons. 6 are green and the rest are blue. How many balloons are blue?
A: 3 balloons are blue

Q: Sam ate 7 cookies and Jane ate 2 cookies. How many more cookies did Sam eat than Jane?
A: Sam ate 5 more cookies than Jane

Q: What is the square root of banana?
A: Unknown

Q: Jane went to a book shop and bought a book. While at the store, Jane found a second interesting book and bought it for $80. The price of the second book was $10 less than three times the price of the first book. What was the price of the first book?
A: the first book was $30

Q: A man is 21 years older than his son. 5 years ago he was 4 times as old as his son. What are their ages now?
A: The man is 33 years old and the son is 12 years old

Q: In a class of 50 students, the number of females is 2 more than 5 times the number of males. How many males and females are there in the class?
A: There are 42 females and 8 males in the class

Q: ${text.replace(/\n/g, ' ')}
A:`;
    const url = 'https://api.openai.com/v1/engines/davinci/completions';
    const params = {
        "prompt": prompt,
        "temperature": 0,
        "max_tokens": 100,
        "top_p": 1,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0,
        "stop": ["\n"]
    };
    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    };
    
    try {
        const response = await got.post(url, { json: params, headers: headers }).json();
        output = `Q: ${text.replace(/\n/g, ' ')}\nA: ${response.choices[0].text}`;
        console.log(response.choices[0])
        console.log(output);
    } catch (err) {
        console.log(err);
    }
})




// const { createWorker, createScheduler } = require('tesseract.js');

// const scheduler = createScheduler();
// const worker1 = createWorker();
// const worker2 = createWorker();

// (async () => {
//   await worker1.load();
//   await worker2.load();
//   await worker1.loadLanguage('eng');
//   await worker2.loadLanguage('eng');
//   await worker1.initialize('eng');
//   await worker2.initialize('eng');
//   scheduler.addWorker(worker1);
//   scheduler.addWorker(worker2);
//   /** Add 10 recognition jobs */
//   const results = await Promise.all(Array(10).fill(0).map(() => (
//     scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png')
//   )))
//   console.log(results[0].data.text);
//   await scheduler.terminate(); // It also terminates all workers.
// })();