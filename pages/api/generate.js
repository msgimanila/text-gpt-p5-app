import { Configuration, OpenAIApi } from "openai";
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : '*' ;

const cors = Cors({
  origin: whitelist
})

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

/* For testing */
// export default async function (req, res) {
//   setTimeout(() => {
//     res.status(200).json({ code: `console.log("hello world ${req.body.prompt}")`});
//   }, 4000);
// }

export default async function (req, res) {
  await runMiddleware(req, res, cors);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  console.log('User prompt:', prompt);

  try {
    const completion = await openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages:[
          {
            "role": "user", 
            "content": `Do not explain, answer only in code. You are converting user text input into p5.js code. Your response must start with 'function setup() {' or 'const' or 'let'. Your response must include 'function setup()' and 'function draw()'. This is the user text input: ${prompt}`
          }
        ]
    });
  console.log(completion.data);
  console.log("Sent: " + completion.data.choices[0].message.content);
  res.status(200).json({ code: completion.data.choices[0].message.content});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.'
        }
      });
    }
  }
}
