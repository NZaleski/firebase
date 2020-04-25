const cafeList = document.querySelector('#cafe-list')
const form = document.querySelector('#add-cafe-form')

const renderCafe = function(doc) {
    let li = document.createElement('li')
    let name = document.createElement('span')
    let city = document.createElement('span')
    let cross = document.createElement('div')

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name
    city.textContent = doc.data().city
    cross.textContent = 'x'

    li.appendChild(name)
    li.appendChild(city)
    li.appendChild(cross)

    cafeList.appendChild(li)

    cross.addEventListener('click', e => {
        e.stopPropagation()
        let id = e.target.parentElement.getAttribute('data-id')
        db.collection('cafes').doc(id).delete().then(function(){
            console.log('deleted')
        }).catch(function(err){
            console.log(err)
        })
    })
}


// db.collection('cafes').orderBy('name').get().then((querySnapshot) => {
//     querySnapshot.forEach(doc => {
//         renderCafe(doc)
//     })
// })



form.addEventListener('submit', (e) => {
    console.log('e', e)
    e.preventDefault()
    db.collection('cafes').add({ 
        name: form.name.value, 
        city: form.city.value 
    })
    form.name.value = ''
    form.city.value = ''

})

db.collection('cafes').onSnapshot(snapShot => {
    let changes = snapShot.docChanges()
    changes.forEach(each=> {
        if (each.type === 'added') {
            renderCafe(each.doc)
        }
        if (each.type === 'removed') {
            let li = cafeList.querySelector('[data-id=' + each.doc.id + ']')
            cafeList.removeChild(li)
        }
    })
})