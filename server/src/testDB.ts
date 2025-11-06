import mongoose from 'mongoose';
import connectDB from './app/lib/db/connectDB';
import User from './app/models/userModel';

const runTest = async () => {
  try {
    await connectDB();

    console.log('--- Iniciando prueba de base de datos ---');

    console.log('Creando usuario de prueba...');
    const testUser = new User({
      username: `TestUser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123', 
    });
    
    await testUser.save();
    console.log(`Usuario creado: ${testUser.username} (ID: ${testUser._id})`);

    console.log('\n--- ¡Prueba completada exitosamente! ---');
  } catch (error) {
    console.error('\n--- Error durante la prueba ---');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB.');
  }
};

runTest();