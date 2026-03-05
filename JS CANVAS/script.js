const canvas = document.getElementById('canvas')
const colorPicker = document.getElementById("colorPicker")
const brushSizeInput = document.getElementById('brushSize')
const rangeNum = document.getElementById('rangeNum')
const eraserBtn = document.getElementById('eraserBtn')
const pencilBtn = document.getElementById('pencilBtn')
const undoBtn = document.getElementById("undoBtn")
const redoBtn = document.getElementById("redoBtn")
const slcColor = document.querySelectorAll(".slcColor")
const brushSlc = document.getElementById("brushSlc")
const ctx = canvas.getContext("2d")

let painting = false
let brushColor = "#000000"
let brushSize = 3
let pencilSize = 3
let isEraser = false
let undoStack =[]
let redoStack =[]

function startPaint(e){
    painting = true
    ctx.beginPath()
    ctx.moveTo(e.offsetX, e.offsetY)
}

function stopPaint(){
    painting = false
}

function paint(e){
    if(!painting) return

    ctx.lineWidth = brushSize
    ctx.lineCap = "round"

    if(isEraser){
        ctx.globalCompositeOperation = "destination-out"
    }else{
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = brushColor
    }

    ctx.lineTo(e.offsetX,e.offsetY)
    ctx.stroke()
}

function resizeCnv(){
    const data = canvas.toDataURL()

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const img = new Image
    img.src = data
    img.onload=()=>{
        ctx.drawImage(img,0,0)
    }
}

slcColor.forEach(color=>{
    color.addEventListener('click',(e)=>{
        brushColor = e.target.value
    })
})

colorPicker.addEventListener('change',(e)=>{
    brushColor = e.target.value
    isEraser=false
})

brushSizeInput.addEventListener('input',(e)=>{
    brushSize = e.target.value
    rangeNum.innerText = brushSize
})

eraserBtn.addEventListener('click',()=>{
    isEraser = true
})

brushSlc.addEventListener('click',()=>{
    isEraser = false
})

pencilBtn.addEventListener('click',()=>{
    isEraser = false
    brushSize = 3
    rangeNum.innerText = brushSize
    brushSizeInput.value = brushSize
})

function saveState(){
    undoStack.push(canvas.toDataURL())
    redoStack=[]
}

undoBtn.addEventListener('click',()=>{
    if(undoStack.length===0) return

    redoStack.push(canvas.toDataURL())
    const img = new Image()
    img.src = undoStack.pop()
    img.onload =()=>{
        ctx.clearRect(0,0, canvas.width,canvas.height)
        ctx.drawImage(img,0,0)
    }
})

redoBtn.addEventListener('click',()=>{
    if(redoStack.length===0) return

    undoStack.push(canvas.toDataURL())
    const img = new Image()
    img.src = redoStack.pop()
    img.onload =()=>{
        ctx.clearRect(0,0, canvas.width,canvas.height)
        ctx.drawImage(img,0,0)
    }
})

function resizeCnv(){
    const data = canvas.toDataURL()

    canvas.setAttribute(width = canvas.innerWidth)
    canvas.setAttribute(height = canvas.innerHeight)

    const img = new Image
    img.src = data
    img.onload=()=>{
        ctx.drawImage(img,0,0)
    }
}

canvas.addEventListener('resize', resizeCnv)

canvas.addEventListener('mousedown',saveState)
canvas.addEventListener('mousedown', startPaint)
canvas.addEventListener('mousemove', paint)
canvas.addEventListener('mouseup', stopPaint)
// const canvas = document.getElementById("myCanvas")
// const ctx = canvas.getContext("2d")
 
// let painting = false
// let brushColor = "#000000"
// let brushSize = 5
// let isEraser = false
 
// function startPaint(e) {
//     painting = true
//     ctx.beginPath()
//     ctx.moveTo(e.offsetX, e.offsetY)
// }
 
// function stopPaint() {
//     painting = false
// }
 
// function paint(e) {
//     if (!painting) return
 
//     ctx.lineWidth = brushSize
//     ctx.lineCap = "round"
 
//     if (isEraser) {
//         ctx.globalCompositeOperation = "destination-out"
//     } else {
//         ctx.globalCompositeOperation = "source-over"
//         ctx.strokeStyle = brushColor
//     }
 
//     ctx.lineTo(e.offsetX, e.offsetY)
//     ctx.stroke()
// }
 
// const colorPicker = document.getElementById("colorPicker")
 
// colorPicker.addEventListener("change", (e) => {
//     brushColor = e.target.value
//     isEraser = false
// })
 
 
// const brushSizeInput = document.getElementById("brushSize")
 
// brushSizeInput.addEventListener("input", (e) => {
//     brushSize = e.target.value
// })
 
// const brushBtn = document.getElementById("brushBtn")
// brushBtn.addEventListener("click", () => {
//     isEraser = false
// })
 
// const eraserBtn = document.getElementById("eraserBtn")
// eraserBtn.addEventListener("click", () => {
//     isEraser = true
// })
 
// const undoBtn = document.getElementById("undoBtn")
// const redoBtn = document.getElementById("redoBtn")
 
// let undoStack = []
// let redoStack = []
 
// function saveState() {
//     undoStack.push(canvas.toDataURL())
//     redoStack = []
// }
 
// canvas.addEventListener("mousedown", saveState)
 
// undoBtn.addEventListener("click", () => {
//     if (undoStack.length === 0) return
 
//     redoStack.push(canvas.toDataURL())
//     const img = new Image()
//     img.src = undoStack.pop()
//     img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height)
//         ctx.drawImage(img, 0, 0)
//     }
// })
 
// redoBtn.addEventListener("click", () => {
//     if (redoStack.length === 0) return
 
//     undoStack.push(canvas.toDataURL())
 
//     const img = new Image()
//     img.src = redoStack.pop()
//     img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height)
//         ctx.drawImage(img, 0, 0)
//     }
// })
 
// canvas.addEventListener("mousedown", startPaint)
// canvas.addEventListener("mousemove", paint)
// canvas.addEventListener("mouseup", stopPaint)
// canvas.addEventListener("mouseleave", stopPaint)
 
