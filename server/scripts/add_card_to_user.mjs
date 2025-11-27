import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Intentar cargar server/.env usando el cwd + ruta 'server/.env'
const cwd = process.cwd();
let envPath = path.join(cwd, 'server', '.env');
if (path.basename(cwd) === 'server') envPath = path.join(cwd, '.env');
dotenv.config({ path: envPath });

// Si dotenv no inyectó MONGODB_URI (por compatibilidades), intentar parsear manualmente
import fs from 'fs';
if (!process.env.MONGODB_URI) {
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    console.log('DEBUG: raw .env length=', raw.length);
    // show first 200 chars for debugging
    console.log('DEBUG: raw .env head=', raw.slice(0, 200));
    const m = raw.match(/MONGODB_URI\s*=\s*["']?([^"'\n\r]+)["']?/);
    console.log('DEBUG: regex match MONGODB_URI =', !!m);
    if (m && m[1]) {
      process.env.MONGODB_URI = m[1].trim();
      console.log('DEBUG: set MONGODB_URI from file');
    }
    const j = raw.match(/JWT_SECRET\s*=\s*["']?([^"'\n\r]+)["']?/);
    console.log('DEBUG: regex match JWT_SECRET =', !!j);
    if (j && j[1]) {
      process.env.JWT_SECRET = j[1].trim();
      console.log('DEBUG: set JWT_SECRET from file');
    }
  } catch (err) {
    console.error('DEBUG: error reading envPath', err);
  }
}

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI no definida en .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const userEmail = 'testuser01@example.com';
  const user = await db.collection('users').findOne({ email: userEmail });
  if (!user) {
    console.error('Usuario no encontrado:', userEmail);
    await mongoose.disconnect();
    process.exit(1);
  }

  // Crear carta de ejemplo
  const cardDoc = {
    id: `local-${Date.now()}`,
    name: 'Test Pokemon Card',
    image: 'https://placehold.co/223x310',
    category: 'pokemon',
    createdAt: new Date(),
  };

  const res = await db.collection('pokemoncards').insertOne(cardDoc);
  console.log('Inserted card _id =', res.insertedId.toString());

  // Asociar la carta al usuario (cardCollection)
  const updateRes = await db.collection('users').updateOne(
    { _id: user._id },
    { $push: { cardCollection: res.insertedId } }
  );

  console.log('Updated user:', updateRes.modifiedCount === 1 ? 'OK' : 'NO_CHANGE');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
