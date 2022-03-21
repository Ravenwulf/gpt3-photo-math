const Tesseract = require('tesseract.js');
const got = require('got');
const dotenv = require('dotenv');
dotenv.config();

Tesseract.recognize(
    './public/assets/wordproblem-3.jpg',
    'eng',
    { logger: m => console.log(m) }
).then(async ({ data: { text } }) => {
    console.log(text);
    const prompt = `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\n`;
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
        output = `${prompt}${response.choices[0].text}`;
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