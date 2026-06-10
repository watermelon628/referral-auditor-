import app from '../server';

export default function (req: any, res: any) {
  // Recover original URL path rewritten by Vercel so Express router matches correctly
  const forwardedPath = req.headers['x-vercel-forwarded-path'] || req.headers['x-vercel-original-url'] || req.headers['x-original-url'] || req.headers['x-forwarded-url'];
  if (forwardedPath) {
    req.url = forwardedPath;
  }
  return app(req, res);
}
