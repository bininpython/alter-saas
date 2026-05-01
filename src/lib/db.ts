import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.json');

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], workouts: [], checkins: [] }, null, 2));
}

export const readDB = () => {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

export const writeDB = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};
