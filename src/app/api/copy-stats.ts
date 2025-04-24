import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const srcPath = path.join(process.cwd(), 'data', 'cache', 'last_successful_stats.json');
    const destPath = path.join('/tmp', 'last_successful_stats.json');

    const content = fs.readFileSync(srcPath, 'utf-8');
    fs.writeFileSync(destPath, content);

    return res.status(200).json({ message: `Copied to: ${destPath}` });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to copy stats file' });
  }
}
