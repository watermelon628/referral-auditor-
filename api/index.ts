import app from '../server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function (req: any, res: any) {
  return app(req, res);
}
