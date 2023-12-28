const { OpenAI } = require("openai");
const ValidationError = require("../../utils/error");
const { responseSuccessWithData,
	responseErrorWithData
	} = require("../../utils/response");
exports.Chatgpt = async (req, res, next) => {
  try {
    const query = req.body.query;
//    if(!query) throw new ValidationError("Parameter Not found");
    if(!query) return res.status(400).json(
      responseErrorWithData({
        status: false,
        data: "Parameter not found"
      })
    );

    const openai = new OpenAI({
      apiKey:'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'
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k-0613',
      messages: [{role: "user", content: query}],
      stream: false
    });
    res.status(200).json(
      responseSuccessWithData({
        status: true,
	data: response.choices[0].message.content
      })
    );
  }catch(e){
   next(e);
  }
}
