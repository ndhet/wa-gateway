const { toDataURL } = require("qrcode");
const whatsapp = require("wa-multi-session");
const fs = require("fs");
const ValidationError = require("../../utils/error");
const {
  responseSuccessWithMessage,
  responseSuccessWithData,
} = require("../../utils/response");

exports.createSession = async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');

  try {
    const scan = req.query.scan;
    const sessionName =
      req.body.session || req.query.session || req.headers.session;
    if (!sessionName) {
      throw new Error("Bad Request");
    }
    whatsapp.onQRUpdated(async (data) => {
      if (res && !res.headersSent) {
        const qr = await toDataURL(data.qr);
        if (scan && data.sessionId == sessionName) {
          res.render("scan", { qr: qr });
        } else {
          res.status(200).json(
	    responseSuccessWithData({
              qr: qr,
	    })
          );
        }
      }
    });
    await whatsapp.startSession(sessionName, { printQR: true });
  } catch (error) {
    next(error);
  }
};
exports.deleteSession = async (req, res, next) => {
  try {
    const sessionName =
      req.body.session || req.query.session || req.headers.session;
    if (!sessionName) {
      throw new ValidationError("session Required");
    }
    whatsapp.deleteSession(sessionName);
    res
      .status(200)
      .json(responseSuccessWithMessage("Success Deleted " + sessionName));
  } catch (error) {
    next(error);
  }
};
exports.sessions = async (req, res, next) => {
  try {
    const key = req.body.key || req.query.key || req.headers.key;

    // is KEY provided and secured
    if (process.env.KEY && process.env.KEY != key) {
      throw new ValidationError("Invalid Key");
    }

    res.status(200).json(responseSuccessWithData(whatsapp.getAllSession()));
  } catch (error) {
    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const sessionID = req.body.sessionID || req.query.sessionID || req.headers.sessionID;
    if(!sessionID) throw new ValidationError("Fuck You");
    const session = whatsapp.getSession(sessionID)
    const log = await session?.ws?.config
    console.log(log)
    res.status(200).json(responseSuccessWithData(whatsapp.getSession(sessionID)));
  }catch(e) {
   next(e);
  }
}

exports.session = async (req, res, next) => {
  try {
    const sessionID = req.body.sessionID || req.query.sessionID || req.headers.sessionID;
//    res.status(200).json(responseSuccessWithData(whatsapp.getSession(sessionID)));
    const testFolder = './wa_credentials/'+sessionID+'_credentials/';
    const fs = require('fs');

    fs.readdir(testFolder, (err, files) => {
      if(!err){
	if(!files.length){
	    res.status(200).json(
		responseSuccessWithData({
			error: true,
			data: "No session data, Pleas scan QRCODE",
		})
	    );
	}else{
	    res.status(200).json(
                responseSuccessWithData({
                        error: false,
                        data: `There are ${files.length} Session data`,
                })
            );
	}
      }else{
	res.status(200).json(
	    responseSuccessWithData({
	        error: true,
		data: "You haven't scanned the QR code",
	    })
	);
      }

    });

  }catch (error){
   console.log("asu");
  }
};
