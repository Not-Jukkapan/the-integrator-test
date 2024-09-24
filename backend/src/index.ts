import express, { Express, Request, Response } from "express";
import cors from 'cors'
const app: Express = express();
const PORT = 3001

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
}

const productList: Product[] = [
    {
        id: 1,
        name: 'Product 1',
        category: "category A",
        price: 100,
        quantity: 24,
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
    },
    {
        id: 2,
        name: 'Product 2',
        category: "category A",
        price: 250,
        quantity: 24,
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
    }
];


app.use(cors({
    origin: 'http://127.0.0.1:8080',
    credentials: true

}))

app.use(express.json())


// get all products
app.get("/product", (req: Request, res: Response) => {
    res.json({
        status: "success",
        message: "Here there are your all products",
        product: productList
    })
})

// get prodcut by id
app.get("/product/:id", (req: Request, res: Response) => {
    const productId = parseInt(req.params.id) as number
    const product = productList.filter((product) => product.id === productId)
    if (product.length == 0) {
        res.status(404).json({
            status: "error",
            message: "Product not found.",
        })
    }
    res.json({
        status: "success",
        message: "Here this is your product",
        product
    })
})

// create product
app.post("/product", (req: Request, res: Response) => {
    const { name, category, price, quantity, description } = req.body;
    const id = productList[productList.length - 1].id + 1
    const newProduct = {
        id,
        name,
        category,
        price,
        quantity,
        description
    }
    productList.push(newProduct)
    res.status(201).json({
        status: "success",
        message: "Create product successfully",
        product: productList.filter((product) => product.id === id)
    })
})

// update product
app.put("/product/:id", (req: Request, res: Response) => {
    const productId = parseInt(req.params.id)
    const { name, category, price, quantity, description } = req.body
    productList.every((product) => {
        if (product.id == productId) {
            if (name) product.name = name;
            if (price) product.price = price;
            if (category) product.category = category;
        }
    })
    res.json({
        status: "success",
        message: "Update product successfully",
        product: productList.filter((product) => product.id === productId)
    })

})

// delete product
app.delete("/product/:id", (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const productIndex = productList.findIndex((product) => product.id === productId);
    if (productIndex < 0) {
        return res.status(404).json({
            status: "error",
            message: "Bad Request, params is bad"
        })
    }
    if (!productList[productIndex]) {
        return res.status(404).json({
            status: "error",
            message: "Bad Request, ProductList failed"
        })
    }

    const deleteProduct = productList.splice(productIndex, 1);

    console.log("delete", deleteProduct);

    res.status(200).json({
        status: "success",
        message: "successfully to delete product",
        product: deleteProduct[0]
    })

})

app.listen(PORT, () => {
    console.log("Im running ", PORT);
})

