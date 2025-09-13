/*
define what our "wrestler" datatype is going to look like
using a class here for 2 reasons
1. To learn about using classes in JS
2. It makes it easier to organize/understand
    (yes I know typescript could be used but I want to try this out)

    Adding onto point 2: I am able to make things more efficent, 
    why would I group certain wrestlers or merge certain wrestlers who have nothing in common,
    and have never wrestlered at that federation?

*/ 


class Wrestler {
    
    constructor(name,championships = []) {
        this.name = name;
        this.championships = championships;
    }

    

}

