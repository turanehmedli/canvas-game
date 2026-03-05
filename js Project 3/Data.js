import { faker } from 'https://esm.sh/@faker-js/faker';

export const DATA = Array(30).fill(null).map(()=>({
    id:faker.string.uuid(),
    name:faker.commerce.productName(),
    description:faker.commerce.productDescription(),
    price:Number(faker.commerce.price({min:10,max:1000})),
    category:faker.commerce.department(),
    image:faker.image.urlLoremFlickr({category:"products", width:300, height:500}),
    inStock:faker.datatype.boolean(),
    rating:faker.number.float({min:1,max:5,precision:0.1}),
    createAt:faker.date.past()
}))