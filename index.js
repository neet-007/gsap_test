const divs = [];
for (let i = 0; i < 4; i++) {
    const div = document.createElement("div");
    div.id = "div" + i;
    div.classList.add("box");
    document.body.append(div);
}

gsap.to('.box', {
    rotation: 360,
    duration: 2,
});
