package com.example.backend;


import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class IntegrationTests {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Bartul\\Downloads\\chromedriver-win64\\chromedriver.exe");
        driver = new ChromeDriver();
        driver.get("http://stopnshop.zapto.org/");
    }

    @Test
    public void loginHomeRedirectIT() {

        login(driver, "bartuls42@gmail.com", "Lozinka12!");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("naslov")));
        assertTrue(element.getText().contains("Kupovina koja prati tvoj ritam"));

    }

    @Test
    public void openNewThreadIT() throws InterruptedException {

        login(driver, "bartuls42@gmail.com", "Lozinka12!");

        Thread.sleep(3000);
        driver.findElement(By.xpath("//a[text()='Forum']")).click();

        Thread.sleep(3000);
        driver.findElement(By.className("novaRasprava")).click();

        Thread.sleep(2000);
        assertTrue(driver.findElement(By.className("newDiscussionTitle")).getText().contains("NOVA RASPRAVA"));

        driver.findElement(By.className("newDiscussionNameInput")).sendKeys("Diskusija1");
        driver.findElement(By.className("newDiscussionDescriptionInput")).sendKeys("Ovo je prva diskusija.");

        Thread.sleep(2000);
        driver.findElement(By.className("publishDiscussion")).click();

        Thread.sleep(2000);
        assertTrue(driver.findElement(By.className("header-title")).getText().contains("Forum"));
    }

    @Test
    public void placeMarkerIT() throws InterruptedException {

        driver.get("http://stopnshop.zapto.org/addShop");

        Thread.sleep(3000);
        WebElement mapElement = driver.findElement(By.cssSelector(".map-container"));

        Actions actions = new Actions(driver);

        actions.moveToElement(mapElement).click().perform();

        Thread.sleep(3000);
        WebElement markerElement = driver.findElement(By.cssSelector(".gm-style .gmnoprint"));
        assertNotNull(markerElement);

    }

    @Test
    public void changeUserProfileIT() throws InterruptedException {

        login(driver, "bartuls42@gmail.com", "Lozinka12!");

        Thread.sleep(3000);
        driver.findElement(By.cssSelector(".hamburger-btn")).click();

        Thread.sleep(1000);
        driver.findElement(By.cssSelector(".hamburger-menu button:first-of-type")).click();

        Thread.sleep(1000);
        driver.findElement(By.id("dateOfBirth")).sendKeys("24-08-2000");

        Select hoodSelect = new Select(driver.findElement(By.id("hood")));
        hoodSelect.selectByVisibleText("Jarun");

        driver.findElement(By.id("submitProfile")).click();

        Thread.sleep(3000);
        assertTrue(driver.findElement(By.cssSelector("h2")).getText().contains("Podaci su uspješno spremljeni!"));
    }

    @Test
    public void registerExistingEmailIT() throws InterruptedException {

        WebElement registrationLink = driver.findElement(By.linkText("Registriraj se"));
        registrationLink.click();

        Thread.sleep(1000);
        WebElement firstNameField = driver.findElement(By.id("firstName"));
        WebElement lastNameField = driver.findElement(By.id("lastName"));
        WebElement emailField = driver.findElement(By.id("email"));
        WebElement passwordField = driver.findElement(By.id("pass"));
        WebElement confirmPasswordField = driver.findElement(By.id("passConfirm"));
        WebElement submitButton = driver.findElement(By.id("submit"));
        firstNameField.sendKeys("Marko");
        lastNameField.sendKeys("Perić");
        emailField.sendKeys("bartuls42@gmail.com");
        passwordField.sendKeys("Lozinka12!");
        confirmPasswordField.sendKeys("Lozinka12!");

        Thread.sleep(1000);
        submitButton.click();

        Thread.sleep(3000);
        assertTrue(driver.findElement(By.cssSelector("h2")).getText().contains("Email already in use"));
    }

    @AfterEach
    public void tearDown() {
        // driver.quit();
    }

    public void login(WebDriver driver, String email, String password) {
        driver.findElement(By.id("email")).sendKeys(email);
        driver.findElement(By.id("pass")).sendKeys(password);
        driver.findElement(By.id("submit")).click();
    }
}
