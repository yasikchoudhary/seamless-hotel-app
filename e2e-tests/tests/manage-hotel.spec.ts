import {test , expect} from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/"
test.beforeEach(async ({page}) => {
    await page.goto(UI_URL);
    // get the sign in button 
    await page.getByRole("link",{name : "Sign In"}).click();
    await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();
    await page.locator("[name = email]").fill("1@1.com");
    await page.locator("[name = password]").fill("password123");
    await page.getByRole("button" , {name : "login"}).click();
    await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow user to add a hotel",async({page})=>{
    await page.goto(`${UI_URL}add-hotel`);
    await page.locator('[name = "name"]').fill("Test Hotel");
    await page.locator('[name = "city"]').fill("Test city");
    await page.locator('[name = "country"]').fill("Test country");
    await page.locator('[name = "description"]').fill("This is a description for the test Hotel");
    await page.locator('[name = "pricePerNight"]').fill("1000");
    await page.selectOption('select[name="starRating"]',"3");
    await page.getByText("Budget").click();
    await page.getByLabel("Free Wifi").click();
    await page.getByLabel("Parking").click();
    await page.locator('[name = "adultCount"]').fill("2");

    await page.locator('[name = "childCount"]').fill("4");

    await page.setInputFiles(`[name = "imageFiles"]`,[
        path.join(__dirname,"files","1.png.jpg"),
       
    ])

    await page.getByRole('button' , {name : "Save"}).click();
     
    await expect(page.getByText("Hotel Saved!")).toBeVisible();    
})


test("should display hotels" , async({ page})=>{
    await page.goto(`${UI_URL}my-hotels`);

    await expect(page.getByText("Dublin Getaways")).toBeVisible(); 

    await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible(); 

    await expect(page.getByText("Dublin , Ireland")).toBeVisible();
    await expect(page.getByText("All Inclusive")).toBeVisible();
   
    await expect(page.getByText("$ 119 Per Night")).toBeVisible();
    await expect(page.getByText("2 adults , 3 children")).toBeVisible();
    await expect(page.getByText("2 Star Rating")).toBeVisible();

    await expect(page.getByRole('link' , {name : "View Details"})).toBeVisible();
    await expect(page.getByRole('link' , {name : "Add Hotel"})).toBeVisible();

})

test("should edit hotel" ,async({ page})=>{
    await page.goto(`${UI_URL}my-hotels`);
    await page.getByRole('link' , {name : "View Details"}).click();
    await page.waitForSelector('[name = "name"]',{state : "attached"})
    await expect(page.locator('[name = "name"]')).toHaveValue('Dublin Getaways')
    await page.locator('[name = "name"]').fill("Dublin Getaways Updated")
    await page.getByRole("button" , {name : "Save"}).click();
    await expect(page.getByText("Hotel Updated!")).toBeVisible();
}) 