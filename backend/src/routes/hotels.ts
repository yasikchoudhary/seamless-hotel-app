import express , {Request , Response} from "express"
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";

const router = express.Router();





// /api/hotels/search
router.get("/search" , async (req:Request , res : Response) => {

    try {

        const query = constructSearchQuery(req.query);

        let sortOptions = {};

        switch(req.query.sortOption){

            case "starRating" : 
              sortOptions = {starRating : -1};
              break;

            case "pricePerNightAsc" : 
              sortOptions = {pricePerNight : 1};
              break; 
              
            case "pricePerNightDesc" : 
              sortOptions = {pricePerNight : -1};
              break;  



        }
        
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        
        // if pagenumber user wants to see is 3 then acc to logic it will skip (3-1)*5 = 10 images
        const skip = (pageNumber -1 ) * pageSize;

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response : HotelSearchResponse = {
            data : hotels,
            pagination :{
                total , 
                page : pageNumber,
                pages : Math.ceil(total / pageSize),
            },
        }

        res.json(response);
     
    } catch (error) {
        console.log("error",error);
        res.status(500).json({message: "Something went wrong"})
    }
    
})

router.get(
    "/:id",
    [param("id").notEmpty().withMessage("Hotel ID is required")],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const id = req.params.id.toString();
  
      try {
        const hotel = await Hotel.findById(id);
        res.json(hotel);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching hotel" });
      }
    }
  );

const constructSearchQuery = (queryParams : any)=>{
    let constructedQuery : any = {};
    if(queryParams.destination){
        constructedQuery.$or =[
            {city: new RegExp(queryParams.destination , "i")},
            {country: new RegExp(queryParams.destination , "i")},

        ];
    }

    if(queryParams.adultCount){
        constructedQuery.adultCount = {
            $gte : parseInt(queryParams.adultCount),
        };
    }

    if(queryParams.childCount){
        constructedQuery.childCount = {
            $gte : parseInt(queryParams.childCount),
        };
    }

    if(queryParams.facilites){

        constructedQuery.facilites = {
            $all : Array.isArray(queryParams.facilites ) ? queryParams.facilites :[queryParams.facilites],
        };

    }

    if(queryParams.types){

        constructedQuery.type = {
            $in : Array.isArray(queryParams.types ) ? queryParams.types :[queryParams.types],
        };

    }

    // if(queryParams.stars){
    //     const starRatings = Array.isArray(queryParams.stars)
    //      ? queryParams.stars.map((star : string)=>parseInt(star))
    //      : parseInt(queryParams.star);
         
    //      constructedQuery.starRating = {$in : starRatings}
    // }

    if(queryParams.stars){
        const starRating = parseInt(queryParams.stars.toString());
        constructedQuery.starRating = {$eq : starRating};
    }

    if(queryParams.maxPrice){
        constructedQuery.pricePerNight = {
            $lte : parseInt(queryParams.maxPrice).toString(),
        }
    }

    return constructedQuery;
}

export default router;