function setupEventHandler() {
    document.addEventListener('keydown', function(event) {
    //rotationSpeed_inc = 1.6;
    console.log(event.keyCode);
    if(event.keyCode == 32)
        rotationSpeed_inc = 5;    
    if(event.keyCode == 37) {
        // console.log(rotationSpeed_inc);
        c.pos[0] -= 1.5;
        if(c.pos[0] <= -1.5)
            c.pos[0] = -1.5;
    event.preventDefault();
    }
    else if(event.keyCode == 39) {
        c.pos[0] += 1.5;
        if(c.pos[0] >= 1.5)
            c.pos[0] = 1.5;
    event.preventDefault();
    }
});
}