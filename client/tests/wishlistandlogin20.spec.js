/* eslint-disable */
// 1. Importaciones necesarias
require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

// 🚨 ESTA ES LA LÍNEA QUE TE FALTABA 🚨
const chrome = require('selenium-webdriver/chrome');

describe('wishlist and login 2.0', function() {
  this.timeout(60000)
  let driver
  let vars
  
  beforeEach(async function() {
    // 2. Configurar opciones para el entorno CI (GitHub Actions)
    const options = new chrome.Options();
    
    // Flags obligatorias para CI (Linux sin pantalla)
    options.addArguments('--headless=new'); // Ejecutar sin ventana visual
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    // 3. Crear el driver con las opciones
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options) // <--- Aplicamos las opciones aquí
      .build();
      
    vars = {}
  })
  
  afterEach(async function() {
    // Protección: Solo intentamos cerrar si el driver se creó correctamente
    if (driver) {
      await driver.quit();
    }
  })
  
  it('wishlist and login 2.0', async function() {
    // --- PASO 1: IR A LA WISHLIST ---
    console.log("🔵 Navegando a Wishlist...");
    await driver.get("http://localhost:3000/wishlist")
    
    await driver.sleep(2000)
    // Nota: setRect puede fallar en headless a veces, lo envolvemos en try/catch o lo omitimos si usamos window-size en options
    try {
        await driver.manage().window().setRect({ width: 1440, height: 786 })
    } catch (e) {
        console.log("Nota: No se pudo redimensionar ventana (normal en headless)");
    }

    // --- PASO 2: VERIFICAR CARTA EN WISHLIST ---
    console.log("🔍 Verificando existencia de Umbreon VMAX...");
    
    // Esperamos a que aparezca el elemento antes de leerlo
    const cardElement = await driver.wait(until.elementLocated(By.css(".relative:nth-child(1) .text-sm")), 10000);
    const cardText = await cardElement.getText();
    
    console.log(`   Texto encontrado: ${cardText}`);
    assert(cardText == "Umbreon VMAX (Moonbreon)")
    console.log("✅ Wishlist correcta.");

    // --- PASO 3: NAVEGACIÓN HACIA EL LOGIN/PERFIL ---
    console.log("👉 Clic en icono de usuario...");
    // Buscamos el enlace que contiene el icono de perfil
    const profileLink = await driver.findElement(By.css("a[href='/profile']"));
    await profileLink.click();
    
    await driver.sleep(1500)

    // --- PASO 4: IR A REGISTRO ---
    console.log("👉 Clic en enlace 'Registrarse'...");
    
    // Esperamos a que el botón sea visible y clickeable
    const registerBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Registrarse')]")), 5000);
    await registerBtn.click();
    
    await driver.sleep(1000)

    // --- PASO 5: VERIFICAR TÍTULO DE REGISTRO ---
    console.log("🔍 Verificando título del formulario...");
    
    const titleElement = await driver.wait(until.elementLocated(By.css("h1")), 5000);
    const titleText = await titleElement.getText();
    
    // Usamos 'includes' por si hay espacios extra o mayúsculas/minúsculas
    assert(titleText.includes("Crea tu colección"))
    console.log("✅ Navegación a Registro correcta.");
  })
})