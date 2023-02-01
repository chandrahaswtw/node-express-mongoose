## Online store

Developed using node.js, mongoDb and ejs as template engine. The collection information from mongodb is as below:

### users

Contain user information. Cart is associated with the user.

```
{
    _id: ObjectId("638343ea1a765c6f7dca7db6"),
    name: 'chandrahas balleda',
    email: 'chandrahaswtw@gmail.com',
    cart: {
      items: [
        {
          productId: ObjectId("63886f682e0890845eff287a"),
          quantity: 1
        }
      ]
    },
    resetToken : {
      token: "Token",
      expirationDate: 2023-02-01T13:26:02.634+00:00
    }
  }
```

### products

Contains information of all the products.

```
  {
    _id: ObjectId("63886f682e0890845eff287a"),
    title: 'Atlassian',
    imageUrl: 'https://i.guim.co.uk/img/media/d5bcb96ef160fe3706cc913861f2cf7bafd2c5b1/83_310_3368_2022/master/3368.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=afd2783ea78cd66bf61361f385c21cca',
    description: '',
    price: '300',
    userId: ObjectId("638343ea1a765c6f7dca7db6")
  }
```

### orders

They store all the orders the user has made.

```
 {
    _id: ObjectId("638df1b320c6e0926bd3dd9d"),
    userId: ObjectId("638343ea1a765c6f7dca7db6"),
    items: [
      {
        productId: ObjectId("63886f682e0890845eff287a"),
        quantity: 1
      }
    ]
  },
```
