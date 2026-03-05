import { DATA } from "./Data.js"
const router = document.querySelectorAll("#router")
const priceContainer = document.getElementById('price-container')

router.forEach(btn=>{

    btn.addEventListener('click',()=>{
        router.forEach(b=>{
            b.classList.remove("bg-red-500")
        })

        document.addEventListener('click',()=>{
            b.classList.remove("bg-red-500")
        })
        
        btn.classList.add("bg-red-500")
        
    })
    
}) 

const renderItems =()=>{
    const maxLength = 60
    priceContainer.innerHTML=''
    DATA.forEach(data=>{
        console.log(data)
        //create element
        const div = document.createElement('div')
        const div3 = document.createElement('div')
        const div2 = document.createElement('div')
        const img = document.createElement('img')
        const h2 = document.createElement('h2')
        const p = document.createElement('p')
        const h3 = document.createElement('h3')
        const h4 = document.createElement('h4')

        //style element
        div.classList='flex flex-col w-full h-full p-3'
        div2.classList='flex  justify-between'
        img.classList='w-full h-full object-cover rounded-xl'
        h2.classList='text-xl text-green-600 my-2'
        p.classList='text-gray-500 mb-2'

        //data connect
        img.setAttribute('src',data.image)
        h2.innerText = data.name
        p.innerText = data.description.length>maxLength?data.description.slice(0,maxLength)+"...":data
        h3.innerText = data.price + "$"
        h4.innerText = data.inStock
        
        div2.append(h3,h4)
        div3.append(h2,p,div2)
        div.append(img,div3)

        priceContainer.append(div)
    })
}

renderItems()
 