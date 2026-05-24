
const Groq = require("groq-sdk")
// const  { tavily } = require('@tavily/core')

const apiResponse = (req,res)=>{
  const usermessage = req.body.message
  // const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY  });
  const groqAi = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  async function main() {
    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    // const tavilyResponse = await tvly.search(`${usermessage}`);
    const response = chatCompletion.choices[0]?.message?.content || " "

    res.status(200).send(response)
  }
  
  async function getGroqChatCompletion() {
    return groqAi.chat.completions.create({
      temperature:0, // depend upon the content creation .value betn 0-2 more valu generate the random value .
      top_p:0.1, // alternative of temperature
      stop:'10', 
      max_completion_tokens:300,
      frequency_penalty:-2.0,  //between -2.0 and 2.0 if word generate multiple line  
      presence_penalty:-2,   // icrease it gererate the creative word 
      // response_format:{type:'json_schema'},
      messages: [
        {
          role:'system',
          content:`you are a assistant use in chatbot . you give output through a structure manner . you give the output 3-4 line .
          not generating the unessary data or symbol.
          genarate  the data in sipmle plane text format .  `
        },
        {
          role: "user",
          content:`${usermessage}`
        },
      ],

      // tool_choice:'auto',
      model: "openai/gpt-oss-20b",
    });
  
  }
  
  main()
}

module.exports = apiResponse




