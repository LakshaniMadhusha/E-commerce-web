import Order from '../models/Order.js';
import Product from '../models/product.js';

export async function createOrder(req, res) {
    try{

    
   if(req.user==null){
    res.status(401).json({
        message: "Please login to create an order"
        
    });
    return;
   }
//    CBC00202 //product ID for testing

    const latestOrder=await Order.find().sort({date:-1}).limit(1);
    let orderId="CBC00202"; //default order ID if no previous orders exist

    if(latestOrder.length>0){
        // if old orders exist
        const lastOrderIdInString=latestOrder[0].orderID; // e.g., "CBC00205"
        const lastOrderIdWithoutPrefix=lastOrderIdInString.replace("CBC","") //"00635"
        const lastOrderIdInteger=parseInt(lastOrderIdWithoutPrefix); //635
        const newOrderIdInteger=lastOrderIdInteger+1; //636
        const newOrderIdWithoutPrefix=newOrderIdInteger.toString().padStart(5,'0'); //"00636"
        orderId="CBC"+newOrderIdWithoutPrefix; //"CBC00636"
    }
    const items=[];
    let  total=0;

    if(req.body.items !==null && Array.isArray(req.body.items)){
        for(let i=0; i<req.body.items.length; i++){
            let item=req.body.items[i];

            // console.log(item);
            let product=await Product.findOne({
                productId: item.productID

            });

            if(product==null){
                res.status(400).json({
                    message:"Invalid product ID: "+item.productID
                });
                return;
            }
                items[i]={
                    productID:product.productId,
                    name:product.name,
                    image:product.images[0],
                    price:product.price,
                    qty:item.qty
                }
            
        }
    }else{
        res.status(400).json({
            message:"Invalid items format"
        });
        return;
    }


    const order=new Order({
        orderID:orderId,
        email:req.user.email,
        name:req.user.firstName+" "+req.user.lastName,
        address:req.body.address,
        phone:req.body.phone,
        items:items,
        total:total,
        notes:req.body.notes
    })
    const result=await order.save();

    res.json({
        message:"Order created successfully",
        result:result
    });
} catch (error) {
    console.error("Error creating order:",error);
    res.status(500).json({
        message: "Failed tocreate order"
    });
}
}

export async function getOrders(req, res) {
    if (req.user == null) {
        return res.status(401).json({
            message: "Please login to view your orders"
        });
    }

    try {
        if (req.user.role === "admin") {
            const orders = await Order.find().sort({ date: -1 });
            res.json(orders);
        } else {
            const orders = await Order.find({
                email: req.user.email
            }).sort({ date: -1 });

            res.json(orders);
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
}
