import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = './images';

const jsonPath = path.join(process.cwd(), 'gi.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) //.slice(0, 3);

const errorLog = fs.createWriteStream('errors.log', {flags: 'a'});

const updateFile = 'update.json';

let updates = [];

function sanitizeFilename(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '');
}

async function downloadImage(url, filepath) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Ошибка скачивания ${url}: ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filepath, buffer);
}

async function runWithLimit(tasks, limit = 5) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = task().then(res => {
      executing.splice(executing.indexOf(p), 1);
      return res;
    });
    results.push(p);
    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, {recursive: true});
  }

  let completed = 0;
  const total = data.length;

  const tasks = data.map((item) => async () => {
    const url = item.image_url;

    const baseName = path.basename(url) // sanitizeFilename(item.name_en || item.name_ru || item.name_de || 'image');
    const ext = path.extname(url);
    const filename = `${baseName}`;

    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
      completed++;
      console.log(`⏭ Уже существует: ${filename} (${completed}/${total})`);

      // Добавляем в update.json, если записи нет
      if (!updates.find(u => u.old_url === url)) {
        updates.push({
          ...item,
          image_url: filepath
        });
      }

      return;
    }

    try {
      await downloadImage(url, filepath);
      completed++;
      console.log(`✅ Скачано: ${filename} (${completed}/${total})`);

      updates.push({
        ...item,
        image_url: filepath
      });
    } catch (err) {
      const msg = `Ошибка при скачивании ${url}: ${err.message}\n`;
      console.error(`❌ ${msg}`);
      errorLog.write(msg);
    }
  });

  await runWithLimit(tasks, 1);

  fs.writeFileSync(updateFile, JSON.stringify(updates, null, 2));

  console.log('\n🎉 Готово! Все изображения обработаны.');
}

main();
