import { Router, Request, Response } from "express";
import { prisma } from '../lib/prisma';
import z, { number, string } from 'zod';
const account = Router();
// 
//A = 100
//add50 -> A   , A = 150 1sec database down open 3 min
// transfer A to b 100 -> A = 50 , 1 sec -> 0
//



// subtract lock 


// add -> 100

// user1 -> sachin Block 3 sec
account.get('/balance', async (req: Request, res: Response) => {
    const id: number = req.user?.id as number;
    const result = await prisma.account.findUnique({
        where: {
            userId: id
        }
    })

    res.status(200).json({
        data: result
    });
})

// first method 
const transferSchema = z.object({
    toUser: z.string().min(2).max(30),
    amount: z.number().min(1)
});

type transfer = z.infer<typeof transferSchema>

function timer() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res({})

        }, 4000)
    })
}


account.post('/add50', async (req: Request, res: Response) => {
    const data = 50;
        // sachin amount
        // 100
        
        
        // wait for 3 min
        
        // backend 
        // stop until email send
        
        // after 4 min
        //
        // async
        // 1 function only to update 

        // 3 - 4 function 
        // await timer();

        const updateUser1 = await prisma.account.update({
            where: {
                userId: req.user?.id
            },
            data: {
                balance : {
                    increment : 50
                }
            }
        })
        res.status(200).json(updateUser1);

})

// send money from one user to another user with username
account.post('/transfer', async (req: Request, res: Response) => {
    const result = transferSchema.safeParse(req.body);

    // user1 -> user2 
    if (!result.success) {
        return res.status(411).json({
            msg: "The person you are sending money is wrong / you'r sending amount is too small"
        })
    }

    let data: transfer = result.data;
    //check user exists

    const response = await prisma.user.findUnique({
        where: {
            username: data.toUser,
        }
    })
    if (!response) {
        return res.status(411).json({
            msg: "The person you are sending money is doesn't exist"
        })
    }
    const user2 = await prisma.account.findUnique({
        where: {
            userId: response.id
        }
    });
    if (!user2) {
        return res.status(404).json({
            msg: 'error in user'
        })
    };
    // create transaction to send money from one user1 to user2

    //deduct the amount from user1 
    let amountToSend = data.amount;

    //block -> issue 
    const user1 = await prisma.account.findUnique({
        where: {
            userId: req.user?.id
        }
    });
    if (!user1) {
        return res.status(404).json({
            msg: 'error in user'
        })
    };
    let totalAmount = user1.balance;

    if (totalAmount - amountToSend < 0) {
        return res.status(404).json({
            msg: 'insufficient amount'
        })
    }

    let newAmount = totalAmount - amountToSend;
    let user2Amount = user2.balance + amountToSend;
    // deduct from user1
    const updateUser1 = await prisma.account.update({
        where: {
            userId: req.user?.id
        },
        data: {
            balance: newAmount
        }
    })

    const updateUser2 = await prisma.account.update({
        where: {
            userId: user2.id
        },
        data: {
            balance: user2Amount
        }
    })


    //add to user2
    res.status(200).json({
        msg: {
            user1: updateUser1,
            user2: updateUser2
        }
    })


})

export default account;