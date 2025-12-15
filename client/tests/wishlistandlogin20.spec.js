/* eslint-disable */
// 1. Importamos chromedriver
require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
// Importar opciones de Chrome para modo headless
const chrome = require('selenium-webdriver/chrome');
describe('wishlist and login 2.0', function() {
  this.timeout(60000)
  let driver
  let vars
  beforeEach(async function() {
    const options = new chrome.Options();
    // Flags vitales para CI
    options.addArguments('--headless=new'); 
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    vars = {}
  })
  afterEach(async function() {
    if (driver) {
      await driver.quit();
    }
  })
  it('wishlist and login 2.0', async function() {
    // --- PASO 1: IR A LA WISHLIST ---
    await driver.get("http://localhost:3000/wishlist")
    await driver.sleep(2000)
    try {
        await driver.manage().window().setRect({ width: 1440, height: 786 })
    } catch (e) {
    }
    // --- PASO 2: VERIFICAR CARTA ---
    const cardElement = await driver.wait(until.elementLocated(By.css(".relative:nth-child(1) .text-sm")), 10000);
    const cardText = await cardElement.getText();
    assert(cardText == "Umbreon VMAX (Moonbreon)")
    // --- PASO 3: NAVEGACIÓN HACIA EL LOGIN/PERFIL ---
    // Buscamos por el enlace del perfil, es más seguro que clases CSS genéricas
    const profileLink = await driver.findElement(By.css("a[href='/profile']"));
    await profileLink.click();
    await driver.sleep(1500)
    // --- PASO 4: IR A REGISTRO (CORREGIDO) ---
    // ⚠️ CAMBIO AQUÍ: Antes buscaba "//button", ahora busca "//a" (enlace)
    // Buscamos cualquier enlace (a) que contenga el texto 'Registrarse'
    const registerLink = await driver.wait(until.elementLocated(By.xpath("//a[contains(.,'Registrarse')]")), 5000);
    await registerLink.click();
    await driver.sleep(1000)
    // --- PASO 5: VERIFICAR TÍTULO DE REGISTRO ---
    const titleElement = await driver.wait(until.elementLocated(By.css("h1")), 5000);
    const titleText = await titleElement.getText();
    // Verificamos que contenga "Crea tu colección"
    assert(titleText.includes("Crea tu colección"))
  })
})