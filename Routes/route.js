const router = require("express").Router();
const User = require("../models/user");
const Ticket=require("../models/ticket");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { requireLogin } = require("../middleware/auth");

// Register user

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashed_password = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashed_password,
    });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, 'manoj', {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: err.message });
  }
});

// Get logged in user
router.get("/getAll", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    res.json(user);
  } catch (error) {
    // console.log(err);
    return res.status(400).json({ error: err.message });
  }
});


router.post('/init', async(req,res) =>{        
  try{
    for(var i=1;i<=40;i++)
    {
        var ticket=new Ticket({
            id:i,
            isbooked:false,
            email:"user@gmail.com",
            bookingid:"abc123"
        });
        await ticket.save();      
    }
    return res.status(201).json({ message: "Ticket Initialization Success" });
  }  
  catch(error){
    return res.status(400).json({ error });
  }
});



router.post('/booking', async(req,res) =>{        
    try{

    const id = req.body.id;

    let ticketdetail = await Ticket.findOne({ id,isbooked:false });


    if(!ticketdetail)
    {
        return res.status(400).json({ message: "Ticket Booked Already look for another one" });
    }
    
    const email=req.body.email;

    let userdetail = await User.findOne({email});

    if(!userdetail)
    {
        return res.status(400).json({ message: "Session Expired" });        
    }


    await Ticket.updateMany({id},{email:userdetail.email,isbooked:true,bookingid:userdetail._id});
    
    
    return res.status(201).json({ message: "Ticket Booking Successful" });
    
}  
    catch(error){
      return res.status(400).json({ error });
    }
  });
  

  router.get("/getseats", async (req, res) => {
    try {
      const user = await Ticket.find().select("-email -bookingid -__v");
      res.json(user);
    } catch (error) {
      return res.status(400).json({ error});
    }
  });


  router.get("/open", async (req, res) => {
    try {
    const open = await Ticket.find({isbooked:false}).select("-email -bookingid -__v");
    if(!open)
    {
        return res.status(201).json({ message: "No open Tickets" });
    }
      res.json(open);
    } catch (error) {
      return res.status(400).json({ error});
    }
  });



  router.get("/close", async (req, res) => {
    
    try {
        const close = await Ticket.find({isbooked:true}).select("-email -bookingid -__v");
      
      if(!close)
      {
          return res.status(201).json({ message: "No closed Tickets" });
      }
  
        res.json(close);
      }
    catch (error) {
      return res.status(400).json({ error});
    }
  });
  








module.exports = router;
