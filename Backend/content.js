const Groq = require("groq-sdk");


const apiResponse = (req, res) => {
  const usermessage = req.body.message;
  const groqAi = new Groq({ apiKey: process.env.API_KEY });

  async function main() {
    const chatCompletion = await getGroqChatCompletion();
    const response = chatCompletion.choices[0]?.message?.content || " ";

    res.status(200).send(response);
  }

  async function getGroqChatCompletion() {
    return groqAi.chat.completions.create({
      temperature: 0, 
      top_p: 0.1,
      stop: "10",
      max_completion_tokens: 300,
      frequency_penalty: -2.0, 
      presence_penalty: -2, 
      messages: [
        {
          role: "system",
          content: `you are a assistant use in chatbot . you give output through a structure manner . you give the output 3-4 line .
          not generating the unessary data or symbol.
          genarate  the data in sipmle plane text format .  `,
        },
        {
          role: "user",
          content: `${usermessage}`,
        },
        
      ],

      tool_choice: "auto",
      model: "groq/compound"
    });
  }

  main();
};

module.exports = apiResponse;
