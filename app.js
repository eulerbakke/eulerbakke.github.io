// Pet classes

class Pet {
    constructor(name, age, vaccinated = false, castrated = false, dewormed = false) {
        this.name = name;
        this.age = age;
        this.vaccinated = vaccinated;
        this.castrated = castrated;
        this.dewormed = dewormed;
    }

}


class Dog extends Pet {

}

class Cat extends Pet {

}



// Logo sizing
const img = document.querySelector('#logoImg');

img.style.width = '50%';
img.style.height = '50%';