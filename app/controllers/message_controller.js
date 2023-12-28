const whatsapp = require("wa-multi-session");
const ValidationError = require("../../utils/error");
const { responseSuccessWithData } = require("../../utils/response");

exports.sendMessage = async (req, res, next) => {
  try {
    let to = req.body.to || req.query.to;
    let text = req.body.text || req.query.text;
    let isGroup = req.body.isGroup || req.query.isGroup;
    const sessionId =
      req.body.session || req.query.session || req.headers.session;

    if (!to || !text) throw new ValidationError("Missing Parameters");

    const receiver = to;
    if (!sessionId) throw new ValidationError("Session Not Founds");
    const send = await whatsapp.sendTextMessage({
      sessionId,
      to: receiver,
      isGroup: !!isGroup,
      text,
    });

    res.status(200).json(
      responseSuccessWithData({
          id: send?.key?.id,
          status: send?.status,
          message: send?.message?.extendedTextMessage?.text || "Not Text",
          remoteJid: send?.key?.remoteJid,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.sendImageMessage = async (req, res, next) => {
  try {
    let to = req.body.to || req.query.to;
    let text = req.body.text || req.query.text;
    let isGroup = req.body.isGroup || req.query.isGroup;
    const sessionId = req.body.session || req.query.session || req.headers.session;
    let uimg = req.body.image || req.query.image;
    if(!uimg || !to || !text) throw new ValidationError("Missing Parameters");

    const receiver = to;
    if (!sessionId) throw new ValidationError("Session Not Founds");

    const send = await whatsapp.sendImage({
      sessionId,
      to: receiver,
      text,
      media: uimg,
    });
    res.status(200).json(
      responseSuccessWithData({
          id: send?.key?.id,
          status: send?.status,
	  message: send?.message?.extendedTextMessage?.text || "Not text",
  	  remoteJid: send?.key?.remoteJid
      })
    );
  } catch (error) {
    next(error);
  }
}

exports.readMessage = async (req, res, next) => {
  try {
    const sessionId = req.body.session || req.query.session;
    if(!sessionId) throw new ValidationError("Invalid Parameter");
    const read = await whatsapp.readMessage({
      sessionId,
      key: read.key
    })
    console.log(read)
  }catch (e) {
   next(e);
  }
}


exports.sendBulkMessage = async (req, res, next) => {
  try {
    const sessionId =
      req.body.session || req.query.session || req.headers.session;
    const delay = req.body.delay || req.query.delay || req.headers.delay;
    const text = req.body.text || req.query.text;
    if (!sessionId) {
      return res.status(400).json({
        status: false,
        data: {
          error: "Session Not Found",
        },
      });
    }
    res.status(200).json({
      status: true,
      data: {
        message: "Bulk Message is Processing",
      },
    });
    const datas = req.body.data;
    for (const dt of datas){
      const to = dt
      const isGroup = !!dt.isGroup;

      await whatsapp.sendTextMessage({
        sessionId,
        to: to,
        isGroup: isGroup,
        text,
      });
      await whatsapp.createDelay(delay ?? 1000);
    }
    console.log("SEND BULK MESSAGE WITH DELAY SUCCESS");
  } catch (error) {
    next(error);
  }
};
