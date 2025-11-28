/* eslint-disable */
// 1. Importamos chromedriver para evitar bloqueos
require('chromedriver');

const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('wishlist and login 2.0', function() {
  this.timeout(60000) // Aumentamos timeout a 60s
  let driver
  let vars
  
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  
  afterEach(async function() {
    await driver.quit();
  })
  
  it('wishlist and login 2.0', async function() {
    // --- PASO 1: IR A LA WISHLIST ---
    console.log("🔵 Navegando a Wishlist...");
    await driver.get("http://localhost:3000/wishlist")
    
    // Esperamos a que carguen las cartas
    await driver.sleep(2000)
    await driver.manage().window().setRect({ width: 1440, height: 786 })

    // --- PASO 2: VERIFICAR CARTA EN WISHLIST ---
    console.log("🔍 Verificando existencia de Umbreon VMAX...");
    
    // Verificamos que la primera carta (o una de ellas) sea la esperada
    // Nota: Usamos el selector relativo que generó el IDE, pero con una espera previa
    const cardText = await driver.findElement(By.css(".relative:nth-child(1) .text-sm")).getText()
    console.log(`   Texto encontrado: ${cardText}`);
    
    // Aserción: Comprobamos que sea Umbreon (carta de wishlist por defecto)
    assert(cardText == "Umbreon VMAX (Moonbreon)")
    console.log("✅ Wishlist correcta.");


    // --- PASO 3: NAVEGACIÓN HACIA EL LOGIN/PERFIL ---
    // El test original hacía clic en el icono de usuario (clase .text-2xl suele ser el emoji 👤)
    console.log("👉 Clic en icono de usuario...");
    await driver.findElement(By.css(".text-2xl")).click()
    
    // Esperamos a que cambie de página (a /login o /profile)
    await driver.sleep(1500)


    // --- PASO 4: IR A REGISTRO ---
    console.log("👉 Clic en enlace 'Registrarse'...");
    // Usamos By.linkText porque es más robusto que el CSS generado automáticamente
    await driver.findElement(By.linkText("Registrarse")).click()
    
    // Esperamos a que cargue el formulario de registro
    await driver.sleep(1000)


    // --- PASO 5: VERIFICAR TÍTULO DE REGISTRO ---
    console.log("🔍 Verificando título del formulario...");
    
    // Buscamos el h1 (clase .text-3xl)
    const titleText = await driver.findElement(By.css(".text-3xl")).getText()
    
    // Aserción: Debe decir "Crea tu colección"
    assert(titleText == "Crea tu colección")
    console.log("✅ Navegación a Registro correcta.");
  })
})