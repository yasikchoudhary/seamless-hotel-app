import express, {Request,Response} from "express";
import multer from 'multer';
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024 // 5mb
    }
});
// api/my-hotels
router.post("/" ,verifyToken,[
    body("name").notEmpty().withMessage('Name is required'),
    body("city").notEmpty().withMessage('city is required'),
    body("country").notEmpty().withMessage('country is required'),
    body("description").notEmpty().withMessage('Description is required'),
    body("type").notEmpty().withMessage('Hotel type is required'),
    body("pricePerNight").notEmpty().isNumeric().withMessage('price per night is required and must be a number'),
    body("facilities").notEmpty().isArray().withMessage('facilities are required'),

],upload.array("imageFiles",6), async (req:Request , res: Response) => {

  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    // 1. uplaod the omages to cloudinary 
        const imageUrls = await uploadImages(imageFiles);  // waiting for all the images to upload 

       

    // 2. if upload was successful , add the url to the new hotel

    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;
       

    //3. save the new hotel in out database 

    const hotel = new Hotel(newHotel);
    await hotel.save();
    // 4. return 201 status

     res.status(201).send(hotel);

  } catch (error) {
      console.log("Error creating hotel: ",error);
      res.status(500).json({ message: "Something went wrong"});
      
  }
    
});

router.get("/" , verifyToken,async (req :Request , res: Response) => {

    try {

        const hotels = await Hotel.find({userId : req.userId});
        res.json(hotels);
        
    } catch (error) {

        res.status(500).json({message : "Error fetching hotels"})
        
    }
    
});

router.get("/:id" , verifyToken,async (req :Request , res: Response) => {
  
  const id = req.params.id.toString();

  try {
   
    const hotel = await Hotel.findOne({
        _id: id,
        userId : req.userId
    });

    res.json(hotel);
  
    
} catch (error) {

    res.status(500).json({message : "Error fetching hotels"})
    
}
    
});


router.put("/:hotelId" , verifyToken , upload.array("imageFiles") , async (req:Request , res:Response) => {
    try {
   
      const updatedHotel : HotelType = req.body;
      updatedHotel.lastUpdated = new Date();
      
      const hotel = await Hotel.findOneAndUpdate({
        _id : req.params.hotelId,
        userId: req.userId,
      } , updatedHotel , {new: true});

      if(!hotel){
        return res.status(404).json({message : "Hotel not found"});
      }

      const files = req.files as Express.Multer.File[];

      const updatedImageURls = await uploadImages(files);

      hotel.imageUrls = [...updatedImageURls , 
        ...(updatedHotel.imageUrls || [])];

        await hotel.save();

        res.status(201).json(hotel);

      
    } catch (error) {
    
        res.status(500).json({message : "Something went wrong"})
        
    }
})






async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises); // waiting for all the images to upload 
    return imageUrls;
}


export default router;
