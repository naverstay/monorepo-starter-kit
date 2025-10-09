/* LIBRARIES */
import bodyParser from "body-parser";

/* MIDDLEWARE */
export class BodyParser {
  static optionsJson: bodyParser.OptionsJson = {
    verify: (req: any, _res, buf, _encoding) => {
      req.rawBody = buf;
    },
  };

  static optionsUrlencoded: bodyParser.OptionsUrlencoded = {
    extended: false,
    verify: (req: any, _res, buf, _encoding) => {
      req.rawBody = buf;
    },
  };
}
